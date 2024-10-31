import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

const getEditUserData = () => {
    return axios.get(`http://127.0.0.1:8000/users/me`, {
        withCredentials: true
    })
}


function EditProfilePage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {data, isLoading, isError, isSuccess} = useQuery({
        queryKey: ["edit_user_profile"],
        queryFn: getEditUserData,
        select: data => data.data,
        retry: false,
    })

    const mutation = useMutation({
        mutationFn: (data) => axios.patch("http://127.0.0.1:8000/users/me", data, { withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            },
          },)
    });


    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    const handleSubmit = () => {

        const editData = {}

        if (username != "") {
            editData.username = username
        }
        if (email != "") {
            editData.email = email
        }
        if (password != "") {
            editData.password = password
        }

        mutation.mutate(editData)

        navigate('/')
    }

    
    if (isSuccess) {
        return(
            <>
            <p>Edit Page</p>
            <form onSubmit={handleSubmit}>
            <label>
            New username:<br/>
            <input type="text" placeholder={data.username} onChange={(e) => (setUsername(e.target.value))} /><br/>
            New email:<br/>
            <input type="email" placeholder={data.email} onChange={(e) => (setEmail(e.target.value))} /><br/>
            New password:<br/>
            <input type="text" placeholder="******" onChange={(e) => (setPassword(e.target.value))} /><br/>
            </label>
            <input type="submit" value="Отправить" /><br/>
        </form>
        <button onClick={() => (navigate('/'))}>Back</button>
        </>
        )
    }
    
}

export default EditProfilePage;