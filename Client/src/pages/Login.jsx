
import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    ArrowRight,
    LoaderCircle
} from "lucide-react";

import { loginUser } from "../services/authService";
import { userAuth } from "../context/authContext";
import "./Login.css";

function Login() {
    const { login } = userAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);

            localStorage.setItem("token", data.token);

            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Unable to log in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">

                {/* Welcome panel */}
                <section className="login-welcome">
                    <div className="login-brand-icon">
                        🍃
                    </div>

                    <h1>Daily Thali</h1>

                    <p>
                        Your everyday management,
                        made simple.
                    </p>

                    <div className="login-welcome-note">
                        Organize customers, manage menu items,
                        track orders, and keep your payments
                        organized — all in one place.
                    </div>
                </section>

                {/* Login form */}
                <section className="login-form-panel">
                    <div className="login-heading">
                        <h2>Welcome back!</h2>
                        <p>
                            Sign in to continue to your dashboard.
                        </p>
                    </div>

                    {error && (
                        <div
                            className="login-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="login-field">
                            <label htmlFor="login-email">
                                Email address
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter your email"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="login-password">
                                Password
                            </label>

                            <div style={{ position: "relative" }}>
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    style={{ paddingRight: "48px" }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    title={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        border: "none",
                                        background: "transparent",
                                        color: "#718078",
                                        cursor: "pointer",
                                        padding: "6px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    {showPassword
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

                        <button
                            className="login-submit-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="login-spinner"
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "#287747",
                                fontWeight: 600
                            }}
                        >
                            Create an account
                        </Link>
                    </p>

                    <div className="login-footer">
                        <LockKeyhole
                            size={14}
                            style={{
                                verticalAlign: "middle",
                                marginRight: "5px"
                            }}
                        />
                        Your account is protected by secure authentication.
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Login;
