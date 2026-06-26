import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGenericMutation } from "../../../api/apiSlice";
import { endpoints } from "../../../api/config";
import { setToken, setUser } from "../../../redux/authSlice";
import { toast } from "react-toastify";
import InputField from "../../../components/InputField";
import KnowledgeLogo from "../../../assets/icons/knowledgebase-logo.svg";
import EmailIcon from "../../../assets/icons/email.svg";
import LoginArrow from "../../../assets/icons/login-btn.svg";
import { getErrorMessage } from "../../../utils/HelperFunction";

function Login() {
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
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(getErrorMessage(err) || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-info-container">
        <img src={KnowledgeLogo} className="login-logo" alt="logo" />
        <div className="login-heading">
          <p>Where files become</p>
          <span>shared knowledge.</span>
        </div>
        <p className="login-desc">
          Securely upload, organize, and access important information all in one
          trusted place.
        </p>
      </div>

      <form className="loginForm" onSubmit={handleSubmit} noValidate>
        <div className="login-input-contaner">
          <InputField
            name="email"
            heading="Email Address"
            placeholder="Enter Email"
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
            placeholder="••••••••••••"
            value={formData.password}
            onChange={handleChange}
            showIcon={true}
            passwordIcon={true}
            className={"login-fields"}
            error={errors.password}
          />

          <div className="remember-container">
            <div className="remember-checkBox-container">
              <input type="checkbox" id="remember" defaultChecked />
              <label htmlFor="remember">Remember Password</label>
            </div>
            <div className="forgot-password">
              <Link to="/ForgotPassword">Forgot Password?</Link>
            </div>
          </div>
        </div>

        <div className="login-btn-container">
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Logging in..."
            ) : (
              <>
                <img src={LoginArrow} alt="icon" />
                Login
              </>
            )}
          </button>
          <div className="dont-have">
            <p>
              New here? <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
