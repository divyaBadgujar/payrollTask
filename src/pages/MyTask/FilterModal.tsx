import React, { useState } from "react";
import {
  Popover,
  Typography,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";

const taskTypes = ["Recurring", "Non-Recurring", "Target"] as const;
const dateFields = ["Created Date", "Modified Date"] as const;
const dueDateOptions = ["Today", "Tomorrow", "This Week", "Overdue", "No Due Date"] as const;

type DateField = "Created Date" | "Modified Date";

// ---------- Types ----------
interface FilterState {
  taskType: string;
  dateField: DateField | "";
  fromDate: string;
  toDate: string;
  dueDate: string;
}

const initialFilters: FilterState = {
  taskType: "",
  dateField: "Created Date",
  fromDate: "",
  toDate: "",
  dueDate: "",
};

interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

// ---------- Component ----------
const FilterPopover: React.FC<FilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleChange = (field: keyof FilterState, value: string) => {
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
        {/* Task Type */}
        <Typography fontSize="13px" fontWeight="500">
          By Task Type
        </Typography>
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
        
        {/* Date */}
        <Typography variant="body2" fontSize="13px" fontWeight="500" mt={2}>
          By Date
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
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
        </Box>
        
        <Box display="flex" gap={1.5} mb={2}>
          <TextField
            variant="standard"
            type="date"
            fullWidth
            size="small"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={filters.fromDate}
            onChange={(e) => handleChange("fromDate", e.target.value)}
          />
          <TextField
            variant="standard"
            type="date"
            fullWidth
            size="small"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={filters.toDate}
            onChange={(e) => handleChange("toDate", e.target.value)}
          />
        </Box>


        {/* Due Date */}
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
