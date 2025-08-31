import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import logo from "../../assets/FFC-logo.png";
import { useDispatch } from "react-redux";
import  { LOGIN } from "../../services/apiUrl";
import { userLogin } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await dispatch(userLogin(data));
      console.log(res?.payload);
      if(res?.payload === true){
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className={styles.LoginPage}>
      <Box className={styles.headText}>
        <img src={logo} alt="logo" />
        <Typography variant="h6" align="center" gutterBottom>
          Get Started with BETA Field Force
        </Typography>
      </Box>
      <Box className={styles.inputSection}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="username"
            variant="standard"
            fullWidth
            margin="normal"
            {...register("username", {
              required: "username is required",
            })}
            error={!!errors.username}
            size="medium"
            helperText={errors.username ? errors.username.message : ""}
            inputProps={{ maxLength: 10, inputMode: "numeric" }}
          />

          <TextField
            label="Password"
            type="password"
            variant="standard"
            size="medium"
            fullWidth
            {...register("password", { required: "Password is required" })}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.button}
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Signing In" : "Sign In"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;