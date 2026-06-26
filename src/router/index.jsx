import React from "react";
import AppRouting from "./AppRouting";
import AuthRouting from "./AuthRouting";
import { useSelector } from "react-redux";

function MainRouter() {
  const { user, token } = useSelector((state) => state.auth);
  return user && token ? <AppRouting /> : <AuthRouting />;
}

export default MainRouter;
