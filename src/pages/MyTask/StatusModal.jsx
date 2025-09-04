import { Modal, Box, Typography, Grid, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const StatusModal = ({ open, onClose, task, onStatusChange }) => {
    if (!task) return null;

    // Generate percentages in rows of 5
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
                    outline: "none"
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Current status</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Grid container spacing={0.7} columns={5}>
                    {percentages.map((value, index) => (
                        <Grid item xs={1} key={value}>
                            <Button
                                sx={{ borderColor: "#d8dce6", color: "black" }}
                                fullWidth
                                variant={task.CompletionPercentage === value ? "contained" : "outlined"}
                                onClick={() => onStatusChange(task, value)}
                            >
                                {value}%
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Modal>
    );
};
export default StatusModal;