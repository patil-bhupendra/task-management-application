import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginRes = await API.post("/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const token = loginRes.data?.token;
      const userFromLogin = loginRes.data?.user;

      if (!token) throw new Error("Token missing from login response");

      localStorage.setItem("token", token);

      // If backend returns user in /login, use it.
      // Otherwise fallback to /profile.
      let user = userFromLogin;
      if (!user) {
        const profileRes = await API.get("/profile");
        user = profileRes.data;
      }

      login({ token, user });

      if (user?.role === "admin") navigate("/admin");
      else navigate("/employee");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="headerRow">
          <div>
            <h2 className="title">Welcome back</h2>
            <p className="subTitle">Login to manage your tasks</p>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div>
            <span className="label">Email</span>
            <input
              className="input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <span className="label">Password</span>
            <input
              className="input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="actionsRow">
            <button className="btn btnPrimary" type="submit">
              Login
            </button>
            <span className="small">Use seeded credentials from README</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
