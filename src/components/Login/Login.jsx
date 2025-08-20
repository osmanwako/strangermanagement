import React, { useState } from "react";
import { authAPI } from "../../api/Api";
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
      const userFromLogin = res.data?.user;

      let theUser = userFromLogin;
      if (!theUser) {
        const me = await authAPI.GetUser();
        theUser = me.data;
      }

      if (!theUser?.role) throw new Error("User role missing");

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
    <div className="login-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '64px', height: '64px'}}>
                    <i className="fas fa-shield-alt text-white fs-3"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">EFP Guest System</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 py-2 fw-medium"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4 pt-4 border-top">
                  <div className="text-muted small">
                    <p className="fw-medium mb-2">Demo Credentials:</p>
                    <div>
                      <p className="mb-1"><strong>Admin:</strong> admin@example.com / password</p>
                      <p className="mb-0"><strong>Secretary:</strong> secretary@example.com / password</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;