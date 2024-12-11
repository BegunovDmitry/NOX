import { useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import OflineGameField from "../Game/Components/OflineGameField";

const getUserData = () => {
    return axios.get(`http://127.0.0.1:8000/get_authorised_user_data`, {
        withCredentials: true
    })
}

function MainPage() {

    const navigate = useNavigate();

    const {data, isLoading, isError, isSuccess} = useQuery({
        queryKey: ["user_profile"],
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
        return(
            <>
                <div className="title"><p>Let's play.</p></div>
    
                <OflineGameField/>
    
                <button onClick={() => (navigate('/my_profile'))}>Sign In</button>
                <button onClick={() => (navigate('/create_game'))}>Online game</button>
            </>
        )
    }

    if (isSuccess) {
        return(
            <>
                <div className="title"><p>Main Page</p></div>

                <p className="main_page_name">{data.username}</p>
                <p className="main_page_rating">Your rating: {data.rating}</p>
    
                <OflineGameField/>
    
                <button onClick={() => (navigate('/my_profile'))}>To ProfilePage</button>
                <button onClick={() => (navigate('/create_game'))}>Online game</button>
            </>
        )
    }
};

export default MainPage;