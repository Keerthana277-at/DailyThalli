
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Eye,
    EyeOff,
    UserRound,
    Mail,
    LockKeyhole,
    ArrowRight,
    LoaderCircle
} from "lucide-react";

import { userAuth } from "../context/authContext";
import "./Login.css";
const API = import.meta.env.VITE_API_URL;

function Register() {
    const { register } = userAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await register(
            name.trim(),
            email.trim(),
            password,
            phone.trim(),
            department.trim()
        );

            setSuccess("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (err) {
            setError(
                err.message || "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <section className="login-welcome">
                    <div className="login-brand-icon">🍃</div>

                    <h1>Daily Thali</h1>

                    <p>Your everyday management, made simple.</p>

                    <div className="login-welcome-note">
                        Create your account to explore the available
                        food menu, place orders, and track your order status.
                    </div>
                </section>

                <section className="login-form-panel">
                    <div className="login-heading">
                        <h2>Create your account</h2>
                        <p>Join Daily Thali in a few simple steps.</p>
                    </div>

                    {error && (
                        <div className="login-error" role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            style={{
                                padding: "12px",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                background: "#e8f5e9",
                                color: "#216e39"
                            }}
                        >
                            {success}
                        </div>
                    )}

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="login-field">
                            <label htmlFor="register-name">
                                Full name
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="register-phone">Phone number</label>
                            <input
                                id="register-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="register-department">
                                College department
                            </label>
                            <input
                                id="register-department"
                                type="text"
                                value={department}
                                onChange={(e) => {
                                    setDepartment(e.target.value);
                                    setError("");
                                }}
                                placeholder="e.g. BCA, CSE, IT"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div style={{ position: "relative" }}>
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    minLength={8}
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
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        padding: "6px",
                                        color: "#718078"
                                    }}
                                >
                                    {showPassword
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="register-confirm-password">
                                Confirm password
                            </label>

                            <div style={{ position: "relative" }}>
                                <input
                                    id="register-confirm-password"
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    required
                                    style={{ paddingRight: "48px" }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        padding: "6px",
                                        color: "#718078"
                                    }}
                                >
                                    {showConfirmPassword
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        Already have an account?{" "}
                        <Link
                            to="/"
                            style={{
                                color: "#287747",
                                fontWeight: 600
                            }}
                        >
                            Sign in
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

export default Register;
