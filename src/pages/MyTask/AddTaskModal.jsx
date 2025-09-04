import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TodayIcon from "@mui/icons-material/Today";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../../store/slices/taskSlice";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";


const AddTaskModal = ({ open, onClose, currentUserId }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.task);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateChoice, setDateChoice] = useState("today");
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState("5:30 PM");
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [titleError, setTitleError] = useState(false);

    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        timeSlots.push(`${displayHour}:00 ${period}`);
        timeSlots.push(`${displayHour}:30 ${period}`);
    }

    const handleSave = () => {
        if (!title.trim()) {
            setTitleError(true);
            return;
        }
        setTitleError(false);

        let startDate, endDate;

        if (dateChoice === "today") {
            startDate = dayjs();
            endDate = dayjs().endOf("day");
        } else if (dateChoice === "tomorrow") {
            startDate = dayjs().add(1, "day").startOf("day");
            endDate = dayjs().add(1, "day").endOf("day");
        } else {
            // custom → use calendar + dropdown
            const [time, period] = selectedTime.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            startDate = selectedDate.hour(hours).minute(minutes).second(0);
            endDate = startDate.add(1, "hour");
        }
        const payload = {
            Title: title,
            Description: description,
            IntercomGroupIds: [],
            AssignedBy: currentUserId,
            AssignedDate: startDate.format("YYYY-MM-DD"),
            AssignedToUserId: 0,
            CompletedDate: "",
            CompletionPercentage: 0,
            IsActive: true,
            IsFavourite: false,
            Latitude: 0,
            LeadId: null,
            Location: "NA",
            Longitude: 0,
            Priority: "Low",
            Target: 0,
            TaskOwners: [],
            TaskStartDate: startDate.format("YYYY-MM-DD hh:mm:ss A"),
            TaskEndDate: endDate.format("YYYY-MM-DD hh:mm:ss A"),
            TaskStatus: "",
            TaskType: "",
            UserIds: [
                {
                    UserId: currentUserId,
                    Target: 0,
                    TargetAchieved: 0,
                    IsActive: true,
                },
            ],
        };

        dispatch(addTask(payload)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                handleClose();
            }
        });
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        setDateChoice("today");
        setSelectedDateTime(dayjs());
        onClose();
    };

    const handleQuickDateSelect = (choice) => {
        setDateChoice(choice);
        if (choice === "today") {
            setSelectedDateTime(dayjs().hour(17).minute(30)); // 5:30 PM
        } else if (choice === "tomorrow") {
            setSelectedDateTime(dayjs().add(1, 'day').hour(2).minute(50)); // 2:50 AM
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1, width: 500, maxWidth: '90vw' },
                }}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight={500}>
                        New Task
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ px: 3, py: 2 }}>
                    <TextField
                        label="Title"
                        fullWidth
                        required
                        variant="outlined"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (titleError && e.target.value.trim()) {
                                setTitleError(false);
                            }
                        }}
                        onBlur={() => {
                            if (!title.trim()) setTitleError(true);
                        }}
                        error={titleError}
                        helperText={titleError ? "Title is required" : `${title.length}/200`}
                        inputProps={{ maxLength: 200 }}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        minRows={3}
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        inputProps={{ maxLength: 500 }}
                        helperText={`${description.length}/500`}
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <Button
                            variant={dateChoice === "today" ? "contained" : "outlined"}
                            size="small"
                            onClick={() => {
                                setDateChoice("today");
                                setSelectedDate(dayjs());
                                setSelectedTime("5:30 PM");
                            }}
                            sx={{ borderRadius: "20px", textTransform: "none" }}
                        >
                            Today
                        </Button>
                        <Button
                            variant={dateChoice === "tomorrow" ? "contained" : "outlined"}
                            size="small"
                            onClick={() => {
                                setDateChoice("tomorrow");
                                setSelectedDate(dayjs().add(1, "day"));
                                setSelectedTime("2:50 AM");
                            }}
                            sx={{ borderRadius: "20px", textTransform: "none" }}
                        >
                            Tomorrow
                        </Button>
                        <Button
                            variant={dateChoice === "custom" ? "contained" : "outlined"}
                            size="small"
                            onClick={() => setShowDatePicker(true)}
                            sx={{ borderRadius: "20px", textTransform: "none",border:"none" }}
                        >
                            <TodayIcon />
                        </Button>
                    </Box>

                    {dateChoice && (
                        <Typography variant="body2" color="text.secondary">
                            Selected: {selectedDate.format("ddd, MMM D")} at {selectedTime}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!title.trim() || loading}
                        sx={{ textTransform: "none" }}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Date + Time Dropdown Modal */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog open={showDatePicker} onClose={() => setShowDatePicker(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Select Date & Time</DialogTitle>
                    <DialogContent>
                        {/* Date Picker */}
                        <MobileDatePicker
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                                setDateChoice("custom");
                            }}
                            slotProps={{ textField: { fullWidth: true, size: "small", sx: { mb: 2 } } }}
                        />

                        {/* Time Dropdown */}
                        <FormControl fullWidth size="small">
                            <Select
                                value={selectedTime}
                                onChange={(e) => {
                                    setSelectedTime(e.target.value);
                                    setDateChoice("custom");
                                }}
                            >
                                {timeSlots.map((time, index) => (
                                    <MenuItem key={index} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDatePicker(false)}>Cancel</Button>
                        <Button variant="contained" onClick={() => setShowDatePicker(false)}>
                            Select
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </>
    );
};

export default AddTaskModal;