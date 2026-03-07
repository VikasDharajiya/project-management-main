import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "light";

const initialState = {
  theme: savedTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {

    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";

      state.theme = newTheme;

      localStorage.setItem("theme", newTheme);
    },

    setTheme: (state, action) => {
      state.theme = action.payload;

      localStorage.setItem("theme", action.payload);
    },

    loadTheme: (state) => {
      const theme = localStorage.getItem("theme") || "light";

      state.theme = theme;
    },

  },
});

export const { toggleTheme, setTheme, loadTheme } = themeSlice.actions;

export default themeSlice.reducer;