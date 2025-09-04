import React, { useState } from "react";
import {
    Popover,
    Typography,
    MenuItem,
    TextField,
    Grid,
    Button,
    IconButton,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const taskTypes = ["Recurring", "Non-Recurring", "Target"];
const dateFields = ["Created Date", "Modified Date"];
const dueDateOptions = ["Today", "Tomorrow", "This Week", "Overdue", "No Due Date"];

const initialFilters = {
    taskType: "",
    dateField: "Created Date",
    fromDate: "",
    toDate: "",
    dueDate: "",
};

const FilterPopover = ({ anchorEl, open, onClose, onApply }) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleClear = () => {
        setFilters(initialFilters);
    };

    const handleApply = () => {
        onApply(filters);
        setFilters(initialFilters);
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            PaperProps={{
                sx: {
                    width: 480,
                    borderRadius: 2,
                    boxShadow: 3,
                    fontSize: "14px",
                    "& .MuiTextField-root": {
                        fontSize: "12px",
                    },
                    "& .MuiInputBase-root": {
                        fontSize: "12px",
                        height: "38px",
                        marginTop: "10px !important",
                    },
                    "& .MuiInputBase-root": {
                        marginTop: "10px !important",  // remove the gap
                    },
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                    fontWeight: 600,
                }}
            >
                <Typography fontSize="14px" fontWeight={600}>
                    Filter
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ px: 2, py: 2 }}>
                <Typography fontSize="13px" fontWeight="500">
                    By Task Type
                </Typography>
                {/* By Task Type */}
                <TextField
                    variant="standard"
                    label="Task Type"
                    fullWidth
                    select
                    size="small"
                    value={filters.taskType}
                    onChange={(e) => handleChange("taskType", e.target.value)}
                    InputLabelProps={{
                        sx: {
                            fontSize: "12px",
                        },
                    }}
                >
                    {taskTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>

                {/* By Date */}
                <Typography fontSize="13px" fontWeight="500" mt={2}>
                    By Date
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <TextField
                            label=""
                            variant="standard"
                            fullWidth
                            select
                            size="small"
                            value={filters.dateField}
                            onChange={(e) => handleChange("dateField", e.target.value)}
                        >
                            {dateFields.map((df) => (
                                <MenuItem key={df} value={df}>
                                    {df}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            type="date"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={filters.fromDate}
                            onChange={(e) => handleChange("fromDate", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="standard"
                            type="date"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={filters.toDate}
                            onChange={(e) => handleChange("toDate", e.target.value)}
                        />
                    </Grid>
                </Grid>

                {/* By Due Date */}
                <Typography fontSize="13px" fontWeight="500" mt={2}>
                    By Due Date
                </Typography>
                <TextField
                    label="Due Date"
                    variant="standard"
                    fullWidth
                    select
                    size="small"
                    value={filters.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    InputLabelProps={{
                        sx: {
                            fontSize: "12px",
                        },
                    }}
                >
                    {dueDateOptions.map((dd) => (
                        <MenuItem key={dd} value={dd}>
                            {dd}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    borderTop: "1px solid #eee",
                }}
            >
                <Button
                    onClick={handleClear}
                    sx={{ fontSize: "13px", textTransform: "none" }}
                >
                    Clear
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApply}
                    sx={{ fontSize: "13px", textTransform: "none", px: 3 }}
                >
                    Apply
                </Button>
            </Box>
        </Popover>
    );
};

export default FilterPopover;
