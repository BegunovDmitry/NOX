
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";


function OnlineGamePage() {

    let {session_id} = useParams()

    const navigate = useNavigate();

    const localStorageData = localStorage.getItem(session_id)

    const connectGameSession = (session_id) => {
    if (!localStorageData) {
        return axios.get(`http://127.0.0.1:8000/game_handler/connect_game_session/${session_id}`, {
            withCredentials: true
        })
    }
    return(JSON.parse(localStorageData))
    }
    
    const {data, isLoading, isSuccess} = useQuery({
        queryKey: ["game_session", {session_id}],
        queryFn: () => connectGameSession(session_id),
        select: data => data.data,
        retry: false,
        staleTime: Infinity
    })


    if (isLoading) {
        return (<p>Loading....</p>)
    }

    if (isSuccess) {
        if (!localStorageData) {
            localStorage.setItem(session_id, JSON.stringify({data: {
                status: data.status,
                player_num: data.player_num,
                start_user: data.start_user,
                sign_player1: data.sign_player1,
                sign_player2: data.sign_player2
            }}))
        }
        return(
            <>
                <p>Status: {data.status}</p>
                <p>Player num: {data.player_num}</p>
                <p>Start user: {data.start_user}</p>
                <p>Sign 1: {data.sign_player1}</p>
                <p>Sign 2: {data.sign_player2}</p>
                <button onClick={() => (navigate("/"))}>To MainPage</button>
            </>
        )
    }
}

export default OnlineGamePage;