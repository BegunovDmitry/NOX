import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";


const formData = new FormData();

function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => axios.post('http://127.0.0.1:8000/auth/cookie/login',
                                        data,
                                        {
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                            }, withCredentials: true
                                        },)
    });

    const handleSubmit = () => {
        formData.set('username', email);
        formData.set('password', password);
        mutation.mutate(formData)
        navigate('/')
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
        <label>
          Email:<br/>
          <input type="email" value={email} onChange={(e) => (setEmail(e.target.value))} /><br/>
          Password:<br/>
          <input type="text" value={password} onChange={(e) => (setPassword(e.target.value))} /><br/>
        </label>
        <input type="submit" value="Отправить" />
      </form>
      <button onClick={() => (navigate("/"))}>To MainPage</button>
      </>
    )


}

export default  LoginPage;