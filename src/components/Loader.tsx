import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div>
      <Backdrop open={true}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
};

export default Loader;
