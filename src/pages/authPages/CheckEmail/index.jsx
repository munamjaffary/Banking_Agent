import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KnowledgeLogo from "../../../assets/icons/knowledgebase-logo.svg";
import LoginArrow from "../../../assets/icons/login-btn.svg";
import { useGenericMutation } from "../../../api/apiSlice";
import { endpoints } from "../../../api/config";
import { toast } from "react-toastify";

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendEmail, { isLoading }] = useGenericMutation();
  
  const email = location.state?.email || "your registered email";

  const handleResend = async () => {
    if (!location.state?.email) {
      toast.error("Email not found. Please signup again.");
      return;
    }

    try {
      await resendEmail({
        endpoint: endpoints.auth.resendverification,
        method: "POST",
        params: { email: location.state.email }
      }).unwrap();
      toast.success("A new verification link has been sent!");
    } catch (err) {
      toast.error("Failed to resend email. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-info-container">
        <img src={KnowledgeLogo} className="login-logo" alt="logo" />
        <div className="login-heading">
          <p>Check Your</p>
          <span>Email Address.</span>
        </div>

        <p className="login-desc">
          We've sent a verification link to <b>{email}</b>.
          Please click the link in your inbox to activate your account.
        </p>
      </div>

      <div className="loginForm">
        <div className="login-btn-container mt-4 d-flex flex-column gap-3">
          <button 
            className="login-btn" 
            style={{ backgroundColor: "#28a745", border: "none" }} 
            onClick={() => navigate("/activate")}
          >
            <img src={LoginArrow} alt="icon" />
            Go to Activation Screen
          </button>
          <button className="login-btn btn-outline" onClick={() => navigate("/")}>
            <img src={LoginArrow} alt="icon" />
            Back to Login
          </button>
        </div>
        
        <div className="dont-have text-center mt-4">
          <p>
            Didn't receive the email? 
            <span 
              style={{ 
                cursor: isLoading ? 'not-allowed' : 'pointer', 
                color: '#007bff', 
                marginLeft: '5px',
                fontWeight: 'bold' 
              }}
              onClick={!isLoading ? handleResend : undefined}
            >
              {isLoading ? "Sending..." : "Resend Link"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;