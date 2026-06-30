import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGenericMutation } from "../../../api/apiSlice";
import { endpoints } from "../../../api/config";
import { setToken, setUser } from "../../../redux/authSlice";
import { toast } from "react-toastify";
import InputField from "../../../components/InputField";
import EmailIcon from "../../../assets/icons/email.svg";
import LoginArrow from "../../../assets/icons/login-btn.svg";
import NazariLogo from "../../../assets/icons/nazari-logo.png";
import { getErrorMessage } from "../../../utils/HelperFunction";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useGenericMutation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await login({
        endpoint: endpoints.auth.login,
        method: "POST",
        data: formData,
      }).unwrap();
      dispatch(setToken(response.access_token));
      dispatch(setUser(response.user));
      sessionStorage.setItem("npfcu_fresh_login", "1");
      toast.success("Welcome back!");
      navigate("/portal/admin");
    } catch (err) {
      toast.error(getErrorMessage(err) || "Login failed!");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--public-bg, #F5F1E8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Public Sans', system-ui, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "var(--public-dropdown-bg, #FFFFFF)",
        borderRadius: "20px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "40px 36px",
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: "0",
            marginBottom: "28px",
          }}
        >
          <img src={NazariLogo} alt="Nazari" style={{ height: "36px", width: "auto" }} />
        </button>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--public-nav-active, #0E3B36)", margin: "0 0 6px" }}>Welcome back</h1>
          <p style={{ fontSize: "14px", color: "var(--Blue-Gray, #9A958A)", margin: "0", lineHeight: "1.5" }}>
            Sign in to access your secure member portal, documents, and support.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "6px" }}>
            <InputField
              name="email"
              heading="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              rightIcon={EmailIcon}
              showIcon={true}
              type="email"
              className={"login-fields"}
              error={errors.email}
            />
            <InputField
              name="password"
              heading="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              showIcon={true}
              passwordIcon={true}
              className={"login-fields"}
              error={errors.password}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", fontSize: "13px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--public-nav-text, #3F3D38)", cursor: "pointer" }}>
                <input type="checkbox" id="remember" defaultChecked style={{ accentColor: "#0E3B36", width: "16px", height: "16px" }} />
                Remember Password
              </label>
              <Link to="/ForgotPassword" style={{ color: "#0E3B36", textDecoration: "none", fontWeight: "500" }}>Forgot Password?</Link>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 20px",
                border: "none",
                borderRadius: "10px",
                background: isLoading ? "#9A958A" : "#0E3B36",
                color: "#F5F1E8",
                fontSize: "15px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (!isLoading) e.target.style.background = "#0A2C28"; }}
              onMouseLeave={(e) => { if (!isLoading) e.target.style.background = "#0E3B36"; }}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <img src={LoginArrow} alt="" style={{ width: "18px", height: "18px", filter: "brightness(0) invert(1)" }} />
                  Sign In
                </>
              )}
            </button>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--public-nav-text, #3F3D38)", margin: "0", textAlign: "center" }}>
              New here?{" "}
              <Link to="/signup" style={{ color: "#0E3B36", fontWeight: "700", textDecoration: "none" }}>Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
