import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Button,
    Tab,
    Tabs,
    Typography,
    TextField,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Radio,
    TablePagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./MyTask.module.scss";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchTasks,
    addTask,
    deleteTask,
    updateTaskStatus,
    toggleTaskFavourite,
    undoTask,
    markTaskCompleted,
} from "../../store/slices/taskSlice";
import { defaultTaskPayload } from "../../utils/utils";
import { differenceInCalendarDays, format, isToday, isYesterday } from "date-fns";
import dayjs from "dayjs";

const MyTask = () => {
    const [tab, setTab] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    const dispatch = useDispatch();
    const { pendingTasks, completedTasks, totalCount } = useSelector((state) => state.task);

    // ✅ format date function
    const formatDueDate = (dateString) => {
        if (!dateString) return { label: "", time: "", type: "default" };

        const today = dayjs().startOf("day");
        const tomorrow = today.add(1, "day");
        const dueDate = dayjs(dateString);

        if (dueDate.isSame(today, "day")) {
            return { label: "Today", time: dueDate.format("h:mm A"), type: "today" };
        }
        if (dueDate.isSame(tomorrow, "day")) {
            return { label: "Tomorrow", time: dueDate.format("h:mm A"), type: "tomorrow" };
        }
        if (dueDate.isBefore(today, "day")) {
            const diff = today.diff(dueDate, "day");
            return { label: `${diff} day${diff > 1 ? "s" : ""} ago`, time: dueDate.format("h:mm A"), type: "past" };
        }
        return { label: dueDate.format("DD MMM"), time: dueDate.format("h:mm A"), type: "future" };
    };

    const getDueDateStyle = (type) => {
        switch (type) {
            case "today":
                return {
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    backgroundColor: "#fff",
                };
            case "tomorrow":
                return {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "1px solid #1976d2",
                };
            case "past":
                return {
                    border: "1px solid #d32f2f",
                    color: "#d32f2f",
                    backgroundColor: "#fff",
                };
            default:
                return {
                    border: "1px solid #9e9e9e",
                    color: "#424242",
                    backgroundColor: "#fff",
                };
        }
    };

    const handleTabChange = (e, newValue) => setTab(newValue);

    // ✅ Debounce search to avoid spamming API
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const fetchTaskData = useCallback(
        (pageNum = page, limit = rowsPerPage, searchText = search) => {
            const payload = {
                ...defaultTaskPayload,
                From: pageNum * limit + 1,
                To: (pageNum + 1) * limit,
                Search: searchText,
            };
            dispatch(fetchTasks(payload));
        },
        [dispatch, page, rowsPerPage, search]
    );

    // ✅ Initial load & reload when pagination changes
    useEffect(() => {
        fetchTaskData();
    }, [page, rowsPerPage]);

    // ✅ Debounced search
    const handleSearchChange = debounce((value) => {
        setPage(0); // reset to first page when searching
        fetchTaskData(0, rowsPerPage, value);
    }, 500);

    return (
        <Box className={styles.myTaskPage} sx={{ overflowX: "hidden" }}>
            {/* Filter + Search + Add Task */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                {/* Left side */}
                <Button variant="contained" size="small">Filter</Button>

                {/* Right side */}
                <Box display="flex" alignItems="center" gap={2}>
                    <TextField
                        placeholder="Search"
                        variant="standard"
                        size="small"
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleSearchChange(e.target.value);
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                            const newTask = { title: "New Task", description: "demo" };
                            dispatch(addTask(newTask));
                        }}
                    >
                        Add Task
                    </Button>
                </Box>
            </Box>

            {/* Tabs */}
            <Tabs value={tab} onChange={handleTabChange}>
                <Tab label="My Task" />
                <Tab label="Assigned By Me" />
                <Tab label="Starred" />
            </Tabs>

            {/* ✅ Show accordions only when tab === 0 */}
            {tab === 0 && (
                <>
                    {/* Accordion for pending tasks */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                                Pending Tasks ({pendingTasks.length})
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {pendingTasks.map((task) => (
                                    <ListItem key={task.taskId} divider>
                                        <ListItemIcon>
                                            <Radio
                                                checked={false}
                                                onClick={() =>
                                                    dispatch(
                                                        markTaskCompleted({
                                                            taskId: task.TaskId,
                                                            isMyTask: true,
                                                        })
                                                    )
                                                }
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography component="span" fontWeight="500" >
                                                    {task.Title}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        {task.Description}
                                                    </Typography>
                                                    <br />
                                                    {(() => {
                                                        const { label, time, type } = formatDueDate(task.TaskEndDate);
                                                        const style = getDueDateStyle(type);
                                                        return (
                                                            <span
                                                                style={{
                                                                    ...style,
                                                                    padding: "2px 8px",
                                                                    borderRadius: "12px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 500,
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                {label} at {time}
                                                            </span>
                                                        );
                                                    })()}
                                                </>
                                            }
                                        />
                                        <IconButton
                                            onClick={() =>
                                                dispatch(
                                                    toggleTaskFavourite({
                                                        taskId: task.TaskId,
                                                        currentValue: task.IsFavourite,
                                                        isMyTask: true,
                                                    })
                                                )
                                            }
                                        >
                                            {task.IsFavourite ? (
                                                <StarIcon sx={{ color: "#646C9A" }} /> // filled star
                                            ) : (
                                                <StarBorderIcon /> // outline
                                            )}
                                        </IconButton>

                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    {/* Accordion for completed tasks */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" color="green">
                                Completed Tasks ({completedTasks.length})
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {completedTasks.map((task) => (
                                    <ListItem key={task.taskId} divider>
                                        <ListItemIcon>
                                            <IconButton
                                                onClick={() =>
                                                    dispatch(
                                                        undoTask({
                                                            taskId: task.TaskId,
                                                            isMyTask: true,
                                                        })
                                                    )
                                                }
                                            >
                                                <CheckCircleIcon color="primary" />
                                            </IconButton>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    fontWeight="500"
                                                    sx={{ textDecoration: "line-through" }}
                                                >
                                                    {task.Title}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        {task.Description}
                                                    </Typography>
                                                    <br />
                                                    {(() => {
                                                        const { label, time, type } = formatDueDate(task.TaskEndDate);
                                                        const style = getDueDateStyle(type);
                                                        return (
                                                            <span
                                                                style={{
                                                                    ...style,
                                                                    padding: "2px 8px",
                                                                    borderRadius: "12px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 500,
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                {label} at {time}
                                                            </span>
                                                        );
                                                    })()}
                                                </>
                                            }
                                        />
                                        <IconButton>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </>
            )}

            {/* ✅ Pagination at the bottom */}
            {tab === 0 && (
                <TablePagination
                    component="div"
                    count={totalCount || 0} // API should return total count
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            )}
        </Box>
    );
};

export default MyTask;
