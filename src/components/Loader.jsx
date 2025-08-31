import { Backdrop, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div>
      <Backdrop open={true} >
        <CircularProgress />
      </Backdrop>
    </div>
  );
};

export default Loader;