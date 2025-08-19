import React, { useState } from "react";
import { authAPI } from "../api/Api";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await authAPI.Login({ email, password });

    const token = res.data?.token;
    const userFromLogin = res.data?.user;

    if (!token) throw new Error("No token from server");
    localStorage.setItem("token", token);

    // If user object is not in login response, fetch it
    let theUser = userFromLogin;
    if (!theUser) {
      const me = await authAPI.GetUser();
      theUser = me.data;
    }

    if (!theUser?.role) throw new Error("User role missing");

    localStorage.setItem("user", JSON.stringify(theUser));
    setUser(theUser);

    // Navigate to correct dashboard
    if (theUser.role === "admin") {
      navigate("/admin");
    } else if (theUser.role === "secretary") {
      navigate("/secretary");
    } else {
      setError("Unknown user role");
    }
  } catch (err) {
    setError(
      err.response?.data?.message || err.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
