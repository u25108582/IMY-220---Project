import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [userOrEmail, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const nav = useNavigate();

    const login = async () => {
        if (userOrEmail.trim() == "" || password.trim() == "") {
            return;
        }

        if (userOrEmail.length < 3) {
            console.log("Username/Email is too short");
            return;
        }

        if (password.length < 6) {
            console.log("Password is too short");
            return;
        }

        try {
            const resp = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userOrEmail, password })
            });

            const data = await resp.json();
            if (!resp.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            console.log("Loggin in");
            localStorage.setItem('user', JSON.stringify(data.user));

            nav("/Home");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <form className="splash-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={userOrEmail}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" onClick={login} className="btn btn-primary">Login</button>

            </form>
        </>
    );
}

export default Login;