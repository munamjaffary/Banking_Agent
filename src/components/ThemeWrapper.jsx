import { useSelector } from "react-redux";
import { useEffect } from "react";

function ThemeWrapper({ children }) {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

export default ThemeWrapper;
