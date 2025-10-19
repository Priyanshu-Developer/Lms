"use client";
import React from "react";
import { Box, Tooltip } from "@mui/material";
import { useColorMode } from "./ThemeProvider";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";

const ThemeSwitch: React.FC = () => {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Tooltip title={`Switch to ${mode === "light" ? "Dark" : "Light"} mode`} arrow>
      <Box
        onClick={toggleColorMode}
        sx={{
          width: 70,
          height: 34,
          borderRadius: 20,
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: mode === "light" ? "flex-start" : "flex-end",
          padding: "0 5px",
          background: mode === "light"
            ? "linear-gradient(145deg, #e0e0e0, #ffffff)"
            : "linear-gradient(145deg, #1e1e1e, #121212)",
          border: "1px solid",
          borderColor: mode === "light" ? "#ccc" : "#444",
          transition: "all 0.4s ease-in-out",
          boxShadow:
            mode === "dark"
              ? "0 0 12px rgba(255, 255, 100, 0.4)"
              : "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: mode === "dark" ? "#ffeb3b" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.4s ease",
            boxShadow:
              mode === "dark"
                ? "0 0 10px rgba(255, 255, 150, 0.7)"
                : "0 2px 5px rgba(0,0,0,0.15)",
          }}
        >
          {mode === "light" ? (
            <WbSunnyIcon sx={{ color: "#fbc02d" }} />
          ) : (
            <NightlightIcon sx={{ color: "#3f51b5" }} />
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default ThemeSwitch;
