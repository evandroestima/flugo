import { useState } from "react";
import "./App.css";
import Drawer from "@mui/material/Drawer";
import flugopng from "./assets/flugopng.png";
import Colaboradores from "./components/colaboradores";
import Demo from "./components/demo";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
function App() {
  const [shownComponent, setShownComponent] = useState<
    "Colaboradores" | "Demo"
  >("Colaboradores");

  console.log("App component rendered", shownComponent);

  return (
    <div className="app-container">
      <Drawer
        anchor="left"
        open={true}
        onClose={() => {}}
        variant="persistent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <div className="drawer-header">
          <img src={flugopng} alt="Flugo Logo" className="logo" />
        </div>

        <div className="drawer-content">
          <Stack direction="column" spacing={2} className="avatar-stack">
            <button
              className="avatar-item"
              onClick={() => setShownComponent("Colaboradores")}
            >
              <Avatar alt="Colaboradores" src="/static/images/avatar/1.jpg" />{" "}
              Colaboradores
            </button>
            <button
              className="avatar-item"
              onClick={() => setShownComponent("Demo")}
            >
              <Avatar alt="Demo" src="/static/images/avatar/2.jpg" /> Demo
            </button>
          </Stack>
        </div>
      </Drawer>

      <div className="main-content">
        {shownComponent === "Colaboradores" && <Colaboradores />}
        {shownComponent === "Demo" && <Demo />}
      </div>
    </div>
  );
}

export default App;
