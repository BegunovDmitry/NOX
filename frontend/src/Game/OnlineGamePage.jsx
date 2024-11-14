import OnlineGameField from "./Components/OnlineGameField";
import DisconnectPopup from "./Components/DisconnectPopup";
import ExitPopup from "./Components/ExitPopup"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";


const winCombos = [
    ['1','2','3'], ['4','5','6'], ['7','8','9'], //rows
    ['1','4','7'], ['2','5','8'], ['3','6','9'], //cols
    ['1','5','9'], ['3','5','7'] //diagonals
]

const includesAll = (arr, values) => {
    for (const i in values) {
        if (!(arr.includes(values[i]))) {
            return false;
        }
    }
    return true;
}

const setLocalStorageEndGameStatus = (session_id) => {
    localStorage.setItem(`isEnd \ ${session_id}`, true)
}

const connectGameSession = (session_id) => {
    const localData = localStorage.getItem(session_id);
    
    if (!localData) {
        return axios.get(`http://127.0.0.1:8000/game_handler/connect_game_session/${session_id}`, {
            withCredentials: true
        })
    }
    return Promise.resolve(JSON.parse(localData))
}

const setTurns = (session_id, oldLocalTurns, newTurnX, newTurnsO) => {
    if (!oldLocalTurns) {
        localStorage.setItem(`turns / ${session_id}`, JSON.stringify(
            {
                turnsX: newTurnX,
                turnsO: newTurnsO
            }
        ))
    } else {
        const oldTurnsX = oldLocalTurns.turnsX
        const oldTurnsO = oldLocalTurns.turnsO
        localStorage.setItem(`turns / ${session_id}`, JSON.stringify(
            {
                turnsX: oldTurnsX.concat(newTurnX) ,
                turnsO: oldTurnsO.concat(newTurnsO)
            }
        ))
    }

}

const clearLocalStorage = (session_id) => {
    localStorage.removeItem(session_id);
    localStorage.removeItem(`turns / ${session_id}`)
    localStorage.removeItem(`isEnd \ ${session_id}`)
}

let localTurns


function OnlineGamePage() {

    let {session_id} = useParams()
    const navigate = useNavigate();

    const [isDisconnect, setIsDisconnect] = useState(false)
    const [isGameEnded, setIsGameEnded] = useState(localStorage.getItem(`isEnd \ ${session_id}`) ?? false)
    const [isPlayerWon, setisPlayerWon] = useState("No")

    const [turnsXpage, setTurnsXpage] = useState(JSON.parse(localStorage.getItem(`turns / ${session_id}`))?.turnsX ?? [])
    const [turnsOpage, setTurnsOpage] = useState(JSON.parse(localStorage.getItem(`turns / ${session_id}`))?.turnsO ?? [])
    const [lastChange, setlastChange] = useState("")

    const [ws, setWs] = useState(null);
    const localStorageData = localStorage.getItem(session_id)

    
    const setLocalTurns = () => {
        localTurns = JSON.parse(localStorage.getItem(`turns / ${session_id}`))
    }
    
    const {data, isLoading, isSuccess} = useQuery({
        queryKey: ["game_session", {session_id}],
        queryFn: () => connectGameSession(session_id),
        select: data => data.data,
        // retry: false,
        // staleTime: Infinity
    })


    useEffect(() => {
        if (isSuccess && data) {

            const disconnect_popup = document.querySelector(".disconnect_popup")
            const exit_popup = document.querySelector(".exit_popup")
            const is_first_turn = !localStorage.getItem(`turns / ${session_id}`)

            if (data.player_num == 1 && is_first_turn) {
                setIsDisconnect(true)
                disconnect_popup.style.display = 'block';
            }


            const websocketUrl = `ws://127.0.0.1:8000/game/game_session/${session_id}/${data.player_num}`; // URL вашего WebSocket сервера
            const socket = new WebSocket(websocketUrl);
            setWs(socket);


            socket.onopen = () => {
                console.log("WebSocket connected");
            };

            socket.onmessage = (event) => {
                console.log("Received message:", event.data);
                if (!event.data.includes(" ")) {
                    if (data[`sign_player${data.player_num}`] == "X") {
                        setTurnsOpage(prevs => ([...prevs, event.data]))
                        setTurns(session_id, localTurns, [], [event.data])
                        setLocalTurns()
                    } else {
                        setTurnsXpage(prevs => ([...prevs, event.data]))
                        setTurns(session_id, localTurns, [event.data], [])
                        setLocalTurns()
                    }

                } else if (event.data == `disconnect ${data.opponent_num}`) {
                    setIsDisconnect(true)
                    disconnect_popup.style.display = 'block';
                
                } else if (event.data == `connect ${data.opponent_num}`) {
                    if (is_first_turn) {
                        localStorage.setItem(`turns / ${session_id}`, JSON.stringify(
                            {
                                turnsX: [],
                                turnsO: []
                            }
                        ))
                    }
                    disconnect_popup.style.display = 'none';
                    setIsDisconnect(false)

                } else if (event.data == "player exit") {
                    setIsDisconnect(true)
                    exit_popup.style.display = 'block';
                    setIsGameEnded(true)

                    axios.post(`http://127.0.0.1:8000/game_handler/end_game_session/${session_id}/${data.player_num}`)
                    axios.delete(`http://127.0.0.1:8000/game_handler/delete_game_session/${session_id}`)


                    socket.close() 
                }
            };

            socket.onclose = () => {
                console.log("WebSocket closed");
            };

            // Чистим ресурсы при размонтировании компонента
            return () => {
                socket.close();
                setWs(null);
            };
        }
    }, [isSuccess]);

    const sendMessage = () => {
        if (ws && lastChange) {
            ws.send(lastChange);
            setlastChange("")
        }
    };

    useEffect(() => {
        if (lastChange != []) {
            if (data[`sign_player${data.player_num}`] == "X") {
                setTurns(session_id, localTurns, [lastChange], [])
                setLocalTurns()
            } else {
                setTurns(session_id, localTurns, [], [lastChange])
                setLocalTurns()
            }
            sendMessage()
        }
    }, [lastChange])


    const checkWin = () => {
        if (((turnsXpage.length + turnsOpage.length) >= 4 && (turnsXpage.length + turnsOpage.length) <= 8)) {
            for (const i in winCombos) {
                if (includesAll(turnsXpage, winCombos[i])) {
                    if (isSuccess) {
                        if (data[`sign_player${data.player_num}`] == "X") {
                            setisPlayerWon("Yes")
                            const exit_popup = document.querySelector(".exit_popup")
                            exit_popup.style.display = 'block';

                            axios.post(`http://127.0.0.1:8000/game_handler/end_game_session/${session_id}/${data.player_num}`)
                            axios.delete(`http://127.0.0.1:8000/game_handler/delete_game_session/${session_id}`)

                        } else {
                            const exit_popup = document.querySelector(".exit_popup")
                            exit_popup.style.display = 'block';
                        }
                    }
                    setIsGameEnded(true)
                    setLocalStorageEndGameStatus(session_id)
                    if (ws) {
                        ws.close()
                    }
                    console.log("X won!"); 
                    break;
                }
                if (includesAll(turnsOpage, winCombos[i])) {
                    if (isSuccess) {
                        if (data[`sign_player${data.player_num}`] == "O") {
                            setisPlayerWon("Yes")
                            const exit_popup = document.querySelector(".exit_popup")
                            exit_popup.style.display = 'block';

                            axios.post(`http://127.0.0.1:8000/game_handler/end_game_session/${session_id}/${data.player_num}`)
                            axios.delete(`http://127.0.0.1:8000/game_handler/delete_game_session/${session_id}`)

                        } else {
                            const exit_popup = document.querySelector(".exit_popup")
                            exit_popup.style.display = 'block';
                        }
                    }
                    setIsGameEnded(true)
                    setLocalStorageEndGameStatus(session_id)
                    if (ws) {
                        ws.close()
                    }
                    console.log("O won!"); 
                    break;
                }
            }
        } else if ((turnsXpage.length + turnsOpage.length) >= 9) {
            setisPlayerWon("Nobody")
            const exit_popup = document.querySelector(".exit_popup")
            exit_popup.style.display = 'block'
            if (data.player_num == 1) {
                axios.post(`http://127.0.0.1:8000/game_handler/end_game_session/${session_id}/0`)
            }
            setIsGameEnded(true)
            setLocalStorageEndGameStatus(session_id)
            if (ws) {
                ws.close()
            }
            console.log("Nobody");
        }
    }

    useEffect(() => {
        checkWin()
    }, [turnsXpage, turnsOpage])

    const handleExit = () => {
        if (ws && !isGameEnded) {
            ws.send(`player exit`);
        }
        clearLocalStorage(session_id)
        navigate("/")
    }    



    if (isLoading) {
        return (<p>Loading....</p>)
    }

    if (isSuccess) {

        localTurns = JSON.parse(localStorage.getItem(`turns / ${session_id}`))


        let isEven
        if (!localTurns) {
            isEven = (turnsOpage.length + turnsXpage.length) % 2 == 0
        } else {      
            isEven = (localTurns.turnsO.length + localTurns.turnsX.length) % 2 == 0
        } 

        let isMyTurn = false
        if (!isGameEnded) {
            if ((data.player_num == data.start_user) && (isEven)) {
                isMyTurn = true
            } else if ((data.player_num != data.start_user) && (!isEven)) {
                isMyTurn = true
            } else {
                isMyTurn = false
            }
        }
        

        if (!localStorageData) {
            localStorage.setItem(session_id, JSON.stringify({data: {
                status: data.status,
                player_num: data.player_num,
                opponent_num: data.opponent_num,
                start_user: data.start_user,
                sign_player1: data.sign_player1,
                sign_player2: data.sign_player2
            }}))
        }

        if (localTurns) {
            return(
                <>
                    <p>X turns: {localTurns.turnsX}</p>
                    <p>O turns: {localTurns.turnsO}</p>
    
                    <OnlineGameField 
                        turns = {[localTurns.turnsX,localTurns.turnsO]}
                        user_sign = {data[`sign_player${data.player_num}`]}
                        isMyTurn = {isMyTurn}
                        turnFuncs = {[setTurnsXpage, setTurnsOpage, setlastChange]}
                    />

                    <DisconnectPopup disconnect={isDisconnect} session={session_id}/>
                    <ExitPopup end_by_disconnect={isDisconnect} is_won={isPlayerWon}/>

    
                    <button onClick={handleExit}>To MainPage</button>
                </>
            ) 
        }

        return(
            <>
                <p>X turns: {turnsXpage}</p>
                <p>O turns: {turnsOpage}</p>

                <OnlineGameField 
                    turns = {[turnsXpage,turnsOpage]}
                    user_sign = {data[`sign_player${data.player_num}`]}
                    isMyTurn = {isMyTurn}
                    turnFuncs = {[setTurnsXpage, setTurnsOpage, setlastChange]}
                />

                <DisconnectPopup disconnect={isDisconnect} session={session_id}/>
                <ExitPopup end_by_disconnect={isDisconnect} is_won={isPlayerWon}/>

                <button onClick={handleExit}>To MainPage</button>
            </>
        )        
    }
}

export default OnlineGamePage;