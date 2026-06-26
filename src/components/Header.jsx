import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../api/toggleThemeSlice";
import Light from "../assets/icons/light.svg";
import Dark from "../assets/icons/dark.svg";
import DownArrow from "../assets/icons/leftarrow.svg";

function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  return (
    <header className="chatgpt-header">
      <div className="header-left">
        <h2 className="model-selector">
          Knowledge Base
          <img src={DownArrow} alt="arrow" className="small-arrow" />
        </h2>
      </div>

      <div className="header-right">
        <div className="header-togglebtn">
          <button
            className={`theme-toggle-button ${isDark ? "dark" : "light"}`}
            onClick={() => dispatch(toggleTheme())}
          >
            <div className={`icon-wrapper ${!isDark ? "active" : ""}`}>
              <img src={Light} alt="Light mode" className="light-mode" />
            </div>
            <div className={`icon-wrapper ${isDark ? "active" : ""}`}>
              <img src={Dark} alt="Dark mode" className="dark-mode" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
