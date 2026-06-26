import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
};

const toggleThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = toggleThemeSlice.actions;
export default toggleThemeSlice.reducer;
