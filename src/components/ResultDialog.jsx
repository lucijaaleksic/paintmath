import React from "react";

import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { Clear, HighlightAlt } from "@mui/icons-material";

import { evaluate } from "../util/Utils";
import { resultStyle } from "../style/Styles";

export default function ResultDialog({
  open,
  setOpen,
  input,
  setBoundingBoxes,
}) {
  const [toggled, setToggled] = React.useState(false);

  return (
    <Dialog
      open={open}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "rgba(0,0,0,0.45)",
          color: "white",
          minHeight: "20%",
        },
      }}
    >
      {input === "" ? (
        <CircularProgress
          color="secondary"
          size={50}
          style={{ margin: "auto" }}
        />
      ) : (
        <>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography style={resultStyle} variant="h5" color="lightgray">
                {input} =
                <Clear
                  sx={{ cursor: "pointer" }}
                  onClick={() => setOpen(false)}
                />
              </Typography>
              <Divider color="gray" />
              <Typography variant="h2" color="white" style={resultStyle}>
                {open && evaluate(input)}
                <Tooltip
                  title={
                    toggled
                      ? "Already toggled bounding boxes"
                      : "Toggle bounding boxes"
                  }
                >
                  <ToggleButtonGroup value="">
                    <ToggleButton
                      value={""}
                      color={toggled ? "success" : "primary"}
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setBoundingBoxes(true);
                        setToggled(true);
                      }}
                      disabled={toggled}
                    >
                      <HighlightAlt color={toggled ? "success" : "secondary"} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Tooltip>
              </Typography>
            </DialogContentText>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
