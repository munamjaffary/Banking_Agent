import AuthRouting from "./AuthRouting";
import PortalNPFCURouting from "./PortalNPFCURouting";
import { useSelector } from "react-redux";

function MainRouter() {
  const { user, token } = useSelector((state) => state.auth);

  if (user && token) {
    return <PortalNPFCURouting />;
  }

  return <AuthRouting />;
}

export default MainRouter;
