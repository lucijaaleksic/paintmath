import React from "react";

import { ThemeProvider } from "@mui/material";

import { theme } from "./style/Theme";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <TopBar />
        <Dashboard />
      </ThemeProvider>
    </div>
  );
}

export default App;
