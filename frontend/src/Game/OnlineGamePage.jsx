import OnlineGameField from "./Components/OnlineGameField";
import DisconnectPopup from "./Components/DisconnectPopup";

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";


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
    localStorage.removeItem(session_id)
    localStorage.removeItem(`turns / ${session_id}`)
}

let localTurns


function OnlineGamePage() {

    let {session_id} = useParams()
    const navigate = useNavigate();

    const [turnsXpage, setTurnsXpage] = useState([])
    const [turnsOpage, setTurnsOpage] = useState([])
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
                } else if (event.data == "player exit") {
                    clearLocalStorage(session_id)
                    navigate("/")
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

    const handleExit = () => {
        if (ws) {
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
        if ((data.player_num == data.start_user) && (isEven)) {
            isMyTurn = true
        } else if ((data.player_num != data.start_user) && (!isEven)) {
            isMyTurn = true
        } else {
            isMyTurn = false
        }
        

        if (!localStorageData) {
            localStorage.setItem(session_id, JSON.stringify({data: {
                status: data.status,
                player_num: data.player_num,
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

                    <DisconnectPopup display={"none"}/>
    
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

                <DisconnectPopup display={"none"}/>

                <button onClick={handleExit}>To MainPage</button>
            </>
        )        
    }
}

export default OnlineGamePage;