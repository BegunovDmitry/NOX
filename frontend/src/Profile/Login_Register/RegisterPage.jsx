import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

function RegisterPage() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: () => axios.post('http://localhost:8000/auth/register', {
                                                                                username: username,
                                                                                email: email,
                                                                                password: password,
                                                                            })
    });

    const handleSubmit = () => {
        mutation.mutate()
        navigate('/')
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
        <label>
          Username:<br/>
          <input type="text" value={username} onChange={(e) => (setUsername(e.target.value))} /><br/>
          Email:<br/>
          <input type="text" value={email} onChange={(e) => (setEmail(e.target.value))} /><br/>
          Password:<br/>
          <input type="text" value={password} onChange={(e) => (setPassword(e.target.value))} /><br/>
        </label>
        <input type="submit" value="Отправить" />
      </form>
      <button onClick={() => (navigate("/"))}>To MainPage</button>
      </>
    )
}

export default RegisterPage;