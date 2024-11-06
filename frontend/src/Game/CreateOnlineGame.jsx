import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const createGameSession = () => {
    return axios.get(`http://127.0.0.1:8000/game_handler/create_game_session`, {
        withCredentials: true
    })
}

function CreateOnlineGame() {

    const navigate = useNavigate();

    const {data, isLoading, isSuccess, error, isError} = useQuery({
        queryKey: ["creating_game_session"],
        queryFn: createGameSession,
        select: data => data.data,
        retry: false,
    })

    if (isLoading) {
        return (
            <p>Creating...</p>
        )
    }

    if (isError) {
        console.log(error);
        
    }

    if (isSuccess) {
        setTimeout(() => (navigate(`/online_game/${data.session}`)), 300)
    }

}

export default CreateOnlineGame;