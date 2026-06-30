import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/authPages/Login";
import Signup from "../pages/authPages/Signup";

import CheckEmail from "../pages/authPages/CheckEmail";
import ActivateAccount from "../pages/authPages/ActivateAccount";

const AuthRouting = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/checkemail" element={<CheckEmail />} />
      <Route path="/activate" element={<ActivateAccount />} />
      <Route exact path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AuthRouting;
