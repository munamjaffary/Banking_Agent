import { useSelector } from "react-redux";
import { useEffect } from "react";
import NPFCUChatWidget from "./NPFCUChatWidget";

function ThemeWrapper({ children }) {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      {children}
      <NPFCUChatWidget />
    </>
  );
}

export default ThemeWrapper;
