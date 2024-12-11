import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import HistoryField from "./Components/HistoryField";


const getUserData = () => {
    return axios.get(`http://127.0.0.1:8000/get_authorised_user_data`, {
        withCredentials: true
    })
}

function ProfilePage() {

    const navigate = useNavigate();

    const {data, isLoading, isError, isSuccess} = useQuery({
        queryKey: ["user_profile"],
        queryFn: getUserData,
        select: data => data.data,
        retry: false,
    })

    const mutation = useMutation({
        mutationFn: () => axios.post(
            'http://127.0.0.1:8000/auth/cookie/logout',
            '',
            {
              headers: {
                'accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              withCredentials: true
            }
          )
    });


    const handleLogout = () => {
        mutation.mutate()
        navigate('/')
    };

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    if (isError) {
        return (
            <div className="profile_page_content">
                <p className="profile_page_title">Profile Page</p>
                <p className="profile_page_msg">Please enter your account</p>
                <button onClick={() => (navigate("/login"))}>Login</button><br/>
                <button onClick={() => (navigate("/register"))}>Registration</button><br/>
                <button onClick={() => (navigate("/"))}>To MainPage</button>
            </div>
        )
    }

    if (isSuccess) {
        return(
            <div className="profile_page_logined">
                
                <div className="profile_page_content">
                    <p className="profile_page_title">Profile Page</p>
                    <p className="profile_page_name">{data.username}</p>
                    <p className="profile_page_email">{data.email}</p>

                    <button onClick={() => (navigate("/"))}>To MainPage</button>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={() => (navigate("/edit_profile"))}>Edit profile</button>
                </div>
                
                <div className="profile_page_history">
                 <HistoryField player_id={data.id}/>   
                </div>

            </div>
        )
    }
}

export default ProfilePage;