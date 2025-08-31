import React from "react";
import styles from "./PreLogin.module.scss";
import { Outlet } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

const PreLogin = () => {
  return (
    <Box className={styles.PreLogin}>
      <Box className={styles.leftSection}>
        <Box className={styles.textSection}>
            <Typography variant="h2" align="left" gutterBottom>Daily Employee attendance tracking</Typography>
            <Typography>Application allows you to monitor your employee’s Check-In, Check-Out time and attendance from anywhere and at any time.</Typography>
        </Box>
      </Box>
      <Container className={styles.rightSection}>
        <Outlet/>
      </Container>
    </Box>
  );
};

export default PreLogin;