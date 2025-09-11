import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";

interface Task {
  TaskId: number;
  Title: string;
  CompletionPercentage?: number;
}

interface StatusModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onStatusChange: (task: Task, value: number) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  open,
  onClose,
  task,
  onStatusChange,
}) => {
  if (!task) return null;

  const percentages = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: "20px",
          borderRadius: 1,
          border: "1px solid #fff",
          boxShadow: 24,
          outline: "none",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Current status</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7 }}>
          {percentages.map((value) => (
            <Box key={value} sx={{ width: "4.76%" }}>
              {" "}
              {/* 100% / 21 items ≈ 4.76% */}
              <Button
                sx={{
                  borderColor: "#d8dce6",
                  color: "black",
                  minWidth: "auto",
                  width: "100%",
                  fontSize: "0.75rem",
                  padding: "4px 2px",
                }}
                variant={
                  task.CompletionPercentage === value ? "contained" : "outlined"
                }
                onClick={() => onStatusChange(task, value)}
              >
                {value}%
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default StatusModal;
