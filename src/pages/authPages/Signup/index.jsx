import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGenericMutation } from "../../../api/apiSlice";
import { toast } from "react-toastify";
import KnowledgeLogo from "../../../assets/icons/knowledgebase-logo.svg";
import EmailIcon from "../../../assets/icons/email.svg";
import LoginArrow from "../../../assets/icons/login-btn.svg";
import InputField from "../../../components/InputField";
import { endpoints } from "../../../api/config";
import { getErrorMessage } from "../../../utils/HelperFunction";

const Signup = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useGenericMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        endpoint: endpoints.auth.signup,
        method: "POST",
        data: {
          username: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          role: "user",
        },
      };
      await signup(payload).unwrap();
      toast.success("Signup Successful!");
      navigate("/checkemail", { state: { email: formData.email } });
    } catch (err) {
      toast.error(getErrorMessage(err) || "Signup failed!");
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
          <div className="row g-2 m-0">
            <div className="col-6 px-0 pe-1">
              <InputField
                name="firstName"
                value={formData.firstName}
                placeholder="First Name"
                heading="First Name"
                onChange={handleChange}
                error={errors.firstName}
              />
            </div>
            <div className="col-6 px-0 ps-1">
              <InputField
                name="lastName"
                value={formData.lastName}
                placeholder="Last Name"
                heading="Last Name"
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>
          </div>

          <InputField
            name="email"
            value={formData.email}
            heading="Email Address"
            placeholder="Enter Your Email"
            showIcon={true}
            rightIcon={EmailIcon}
            type="email"
            onChange={handleChange}
            error={errors.email}
          />

          <div className="row g-2 m-0">
            <div className="col-6 px-0 pe-1 m-0">
              <InputField
                name="password"
                value={formData.password}
                heading="Your Password"
                placeholder="••••••••••••"
                showIcon={true}
                passwordIcon={true}
                onChange={handleChange}
                error={errors.password}
              />
            </div>
            <div className="col-6 px-0 ps-1 m-0">
              <InputField
                name="confirmPassword"
                value={formData.confirmPassword}
                heading="Confirm Password"
                placeholder="••••••••••••"
                showIcon={true}
                passwordIcon={true}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>
          </div>
        </div>

        <div className="login-btn-container">
          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <img src={LoginArrow} alt="icon" />
            )}
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
