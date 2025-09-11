import React from "react";
import { IconButton, SxProps, Theme } from "@mui/material";

interface RoundIconButtonProps {
  icon: React.ReactNode;
  title?: string;
  onClick?: () => void;
  size?: number; // for width & height, default 36
  sx?: SxProps<Theme>;
}

const RoundIconButton: React.FC<RoundIconButtonProps> = ({
  icon,
  title,
  onClick,
  size = 36,
  sx = {},
}) => {
  return (
    <IconButton
      onClick={onClick}
      size="small"
      title={title}
      sx={{
        bgcolor: "#1976d2",
        color: "white",
        borderRadius: "50%",
        width: size,
        height: size,
        "&:hover": { bgcolor: "#1565c0" },
        ...sx,
      }}
    >
      {icon}
    </IconButton>
  );
};

export default RoundIconButton;
