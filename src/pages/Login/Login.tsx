import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./Login.module.scss";
import logo from "../../assets/FFC-logo.png";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store/store";

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ mode: "onBlur" });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const res = await dispatch(userLogin(data));
      // res.payload is true when login succeeds
      if (res?.payload === true) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
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
            label="Email Id/Mobile No"
            variant="standard"
            fullWidth
            margin="normal"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
            inputProps={{ maxLength: 10, inputMode: "numeric" }}
          />

          <TextField
            label="Password"
            type="password"
            variant="standard"
            fullWidth
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box className={styles.actionRow}>
            <Typography variant="body2" className={styles.forgot}>
              Forgot Password?
            </Typography>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.button}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {isSubmitting ? "Signing In" : "Sign In"}
            </Button>

            <Typography variant="body2" className={styles.orText}>
              OR
            </Typography>

            <Button
              type="button"
              variant="contained"
              color="primary"
              className={styles.secondaryButton}
            >
              Sign In With OTP
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
