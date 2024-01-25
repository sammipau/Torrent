import { useNavigate } from "react-router-dom";
import "./pages.css";
import { useState } from "react";
const Login = () => {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    // const [success, setSuccess] = useState<any>("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        console.log("login")
        // TODO: might need to hash password
        try { 
            if (username === "" || password === "") {
                setError("Please enter a username and password")
                return
            }
            const data = {
                username: username,
                password: password
            }
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            console.log(response)
            await navigate("/all")

        } catch (error) {
            console.log(error)
            setError("Invalid username or password")
            return
        }

    }

    return (
        <div className="login login-text">
            <div className="login__container">
                <h1 className="login__title">Login</h1>
                    <input
                        className="login__input button-space-right login-space-top"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="login__input button-space-right"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" onClick={handleLogin}>Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    )
}

export default Login;