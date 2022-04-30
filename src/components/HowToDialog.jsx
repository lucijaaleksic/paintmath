import React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  Clear,
  Looks3Rounded,
  Looks4Rounded,
  Looks5Rounded,
  LooksOneRounded,
  LooksTwoRounded,
} from "@mui/icons-material";
import { dialogStyle } from "../style/Styles";

const rules = [
  "Write your expression as neat as possible.",
  "Leave enough space between operators and operands.",
  "Once finished press CALCULATE to get the operation result.",
  "To get a blank canvas press CLEAR.",
  "Enjoy :)",
];
const rulesIcons = [
  <LooksOneRounded style={{ color: "lightgray" }} />,
  <LooksTwoRounded style={{ color: "lightgray" }} />,
  <Looks3Rounded style={{ color: "lightgray" }} />,
  <Looks4Rounded style={{ color: "lightgray" }} />,
  <Looks5Rounded style={{ color: "lightgray" }} />,
];

export default function HowToDialog({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      PaperProps={{
        style: dialogStyle,
      }}
    >
      <DialogContent>
        <DialogContentText color="white" id="alert-dialog-slide-description">
          <Typography
            style={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            variant="button"
            fontSize={25}
            color="lightgray"
          >
            How to use
            <Clear sx={{ cursor: "pointer" }} onClick={() => setOpen(false)} />
          </Typography>
          <Divider color="gray" />
          <List>
            {rules.map((rule, index) => (
              <ListItem>
                <ListItemIcon>{rulesIcons[index]}</ListItemIcon>
                <ListItemText primary={rule} />
              </ListItem>
            ))}
          </List>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
