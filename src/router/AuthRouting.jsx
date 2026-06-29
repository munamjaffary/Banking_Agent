import React from "react";
import LoginBackground from "../assets/icons/login.svg";
import SignupBackground from "../assets/icons/login-bg.svg";
import ActiveBackground from "../assets/icons/sign-up.svg";
import ForgetBackground from "../assets/icons/forgot-password.svg";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "../pages/authPages/Login";
import Signup from "../pages/authPages/Signup";

import CheckEmail from "../pages/authPages/CheckEmail";
import ActivateAccount from "../pages/authPages/ActivateAccount";

const AuthRouting = () => {
  const location = useLocation();

  const currentPath = location.pathname;
  const getBackground = (path) => {
    if (path === "/" || path === "/login") return LoginBackground;
    if (path.startsWith("/signup")) return SignupBackground;
    if (path.startsWith("/checkemail")) return ForgetBackground;
    if (path.startsWith("/activate")) return ActiveBackground;
    return LoginBackground;
  };

  return (
    <div className="row auth-container-row g-0">
      <div className="col-md-6 ">
        <div className=" auth-left-container">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/checkemail" element={<CheckEmail />} />
            <Route path="/activate" element={<ActivateAccount />} />
            <Route exact path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <div className="col-md-6  ">
        <div className="auth-right-container">
          <img
            src={getBackground(currentPath)}
            alt="Background image"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthRouting;
