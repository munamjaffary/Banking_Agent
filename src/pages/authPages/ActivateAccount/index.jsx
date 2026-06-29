import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGenericMutation, useLazyGetQuery } from "../../../api/apiSlice";
import { endpoints } from "../../../api/config";
import { toast } from "react-toastify";
import InputField from "../../../components/InputField";
import { getErrorMessage } from "../../../utils/HelperFunction";

const ActivateAccount = () => {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState("");
  const [status, setStatus] = useState("idle");

  const [genericMutation, { isLoading: isMutationLoading }] =
    useGenericMutation();
  const [triggerVerify, { isFetching: isVerifying }] = useLazyGetQuery();

  const isLoading = isMutationLoading || isVerifying;

  const handleManualActivation = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim() || isLoading) return;

    try {
      setStatus("verifying");

      await triggerVerify({
        endpoint: endpoints.auth.authentication,
        params: { token: tokenInput },
      }).unwrap();

      await genericMutation({
        endpoint: endpoints.auth.activate,
        method: "POST",
        params: { token: tokenInput },
      }).unwrap();

      setStatus("success");
      toast.success("Account activated successfully!");

      navigate("/");
    } catch (err) {
      if (err?.status === 200 || err?.status === 201) {
        setStatus("success");
        toast.success("Account activated!");
        navigate("/");
      } else {
        setStatus("error");
        toast.error(getErrorMessage(err) || "Invalid or expired token.");
      }
    }
  };

  const handleResend = async () => {
    const email = prompt("Enter your email to get a new activation link:");
    if (email) {
      try {
        await genericMutation({
          endpoint: endpoints.auth.resendverification,
          method: "POST",
          params: { email },
        }).unwrap();
        toast.success("New token sent to your email!");
      } catch (err) {
        toast.error("Failed to resend. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-info-container">
        <div className="login-heading">
          {status === "success" ? (
            <>
              <p>Account</p> <span>Activated!</span>
            </>
          ) : (
            <>
              <p>NPFCU</p> <span>Verify Account</span>
            </>
          )}
        </div>
        <p className="login-desc">
          {status === "success"
            ? "Your account is now active. Taking you to login page."
            : "Please enter the activation token sent to your email."}
        </p>
      </div>

      <div className="loginForm">
        {status !== "success" && (
          <form onSubmit={handleManualActivation}>
            <InputField
              name="token"
              value={tokenInput}
              heading="Activation Token"
              placeholder="Enter your token here"
              onChange={(e) => setTokenInput(e.target.value)}
              disabled={isLoading}
            />

            <div className="login-btn-container mt-4">
              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <img src={LoginArrow} alt="icon" />
                )}
                {isLoading ? "Processing..." : "Activate Now"}
              </button>
            </div>
          </form>
        )}

        {status === "error" && (
          <div className="dont-have text-center mt-3">
            <p>
              Token expired?{" "}
              <span
                style={{
                  color: "var(--primary)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={handleResend}
              >
                Resend Token
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
