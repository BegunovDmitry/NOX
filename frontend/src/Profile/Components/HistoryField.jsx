import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import HistoryFieldElement from "./HistoryFieldElement";

const getUserData = () => {
    return axios.get("http://127.0.0.1:8000/get_all_user_games", {
        withCredentials: true
    })
}


function HistoryField(props) {

    const {data, isLoading, isError, isSuccess, error} = useQuery({
        queryKey: ["user_games", props.player_id],
        queryFn: getUserData,
        select: data => data.data,
        retry: false,
    })

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    if (isError) {
        console.log(error);
        
        return (
            <>
            <p>Error!</p>
            <p>Games not found :/</p>
            </>
        )
    }

    if (isSuccess) {
        return(
            <>
                {data.map((game) => 
                    <HistoryFieldElement key={game.id} game={game} user_id={props.player_id}/>
                )}
            </>
            
        )
    }

    
}

export default HistoryField;