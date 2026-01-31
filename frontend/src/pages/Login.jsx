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
      // 1) Login -> get token
      const loginRes = await API.post("/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const token = loginRes.data?.token;
      if (!token) throw new Error("Token missing from login response");

      localStorage.setItem("token", token);

      // 2) Fetch profile -> get user + role
      const profileRes = await API.get("/profile");
      const user = profileRes.data;

      // 3) Store user in context + localStorage
      login({ token, user });

      // 4) Role based redirect
      if (user.role === "admin") navigate("/admin");
      else navigate("/employee");
    } catch (err) {
      console.log("LOGIN ERROR:", err?.response?.status, err?.response?.data);

      setError(err?.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
