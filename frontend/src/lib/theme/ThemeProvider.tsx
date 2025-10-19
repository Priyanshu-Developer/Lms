"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {ThemeProvider as MuiThemeProvider, Theme, createTheme} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getDesignTokens } from "./theme"; // import your theme.ts

interface ColorModeContextType {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                         children,
                                                                       }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Load saved mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("themeMode") as "light" | "dark" | null;
    if (saved) setMode(saved);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "themeMode" && e.newValue) {
        setMode(e.newValue as "light" | "dark");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
    window.dispatchEvent(new Event("theme-changed"));
  };

  // Sync within same tab
  useEffect(() => {
    const handleThemeChange = () => {
      const stored = localStorage.getItem("themeMode") as "light" | "dark" | null;
      if (stored) setMode(stored);
    };
    window.addEventListener("theme-changed", handleThemeChange);
    return () => window.removeEventListener("theme-changed", handleThemeChange);
  }, []);

  // Create full MUI theme
  const theme: Theme = useMemo(() => {
    const tokens = getDesignTokens(mode);
    return createTheme(tokens); // Make sure you pass the full object returned from getDesignTokens

  }, [mode]);

  return (
      <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline /> {/* Now CssBaseline will correctly see theme.palette.text, background, etc. */}
          {children}
        </MuiThemeProvider>
      </ColorModeContext.Provider>
  );
};
