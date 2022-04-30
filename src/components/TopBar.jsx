import React from "react";

import { AppBar, Typography } from "@mui/material";

import logo from "../assets/PaintMathLogo.png";

export default function TopBar() {
  return (
    <AppBar style={{ height: "10vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "50px",
            height: "50px",
            margin: "auto",
            marginInline: "10px",
          }}
        />
        <Typography
          sx={{
            padding: "1rem",
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          PaintMath
        </Typography>
      </div>
    </AppBar>
  );
}
