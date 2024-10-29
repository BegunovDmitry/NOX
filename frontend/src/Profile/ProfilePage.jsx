import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";


const getUserData = () => {
    return axios.get(`http://127.0.0.1:8000/get_authorised_user_data`, {
        withCredentials: true
    })
}

function ProfilePage() {

    const navigate = useNavigate();

    const {data, isLoading, isError} = useQuery({
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
            <>
            <p>Profile Page</p>
            <p>Please enter your account</p>
            <button onClick={() => (navigate("/login"))}>Login</button><br/>
            <button onClick={() => (navigate("/register"))}>Registration</button><br/>
            <button onClick={() => (navigate("/"))}>To MainPage</button>
            </>
        )
    }

    return(
        <>
            <p>Profile Page</p>
            <p>{data.username}</p>
            <p>{data.email}</p>
            <Link to="/"><button>To MainPage</button></Link>
            <button onClick={handleLogout}>Logout</button>
        </>
        
    )
}

export default ProfilePage;