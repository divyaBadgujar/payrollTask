import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
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
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Chip } from "@mui/material";


import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  markTaskCompleted,
  toggleTaskFavourite,
  undoTask,
  updateTaskPercentage,
} from "../../store/slices/taskSlice";

import styles from "./MyTask.module.scss";
import StatusModal from "./StatusModal";
import FilterPopover from "./FilterModal";
import AddTaskModal from "./AddTaskModal";
import dayjs from "dayjs";
import { RootState } from "../../store/store";
import { useAppDispatch } from "../../Hooks/hooks";

import CommentIcon from "@mui/icons-material/Comment";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import ProgressReportModal from "./ProgreeReportModal";

// ------------------ Types ------------------
interface AssignedUser {
  Id: number;
  Name: string;
  EmployeeNo: string;
  Target: number;
  TargetAchieved: number;
}

interface Task {
  TaskId: number;
  Title: string;
  Description?: string;
  TaskEndDate?: string;
  CompletionPercentage?: number;
  IsFavourite?: boolean;
  AssignedByUserId?: number;
  AssignedByUserName?: string;
  AssignedToUsers?: AssignedUser[];
  TaskStatus?: string;
  Priority?: string;
  TaskCommentCount?: number;
  TaskStartDate?: string;
  CreateDate?: string;
}

interface StatusModalState {
  open: boolean;
  task: Task | null;
}

interface Filters {
  taskType?: string;
  dueDate?: string;
  dateField?: "Created Date" | "Modified Date" | "";
  fromDate?: string;
  toDate?: string;
}

// ------------------ Component ------------------
const MyTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pendingTasks, completedTasks, totalCount } = useSelector(
    (state: RootState) => state.task
  );

  // Tabs & Pagination
  const [tab, setTab] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  // Modals
  const [statusModal, setStatusModal] = useState<StatusModalState>({
    open: false,
    task: null,
  });
  const [openAddTask, setOpenAddTask] = useState(false);

  // Filters
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  // menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTask, setMenuTask] = useState<Task | null>(null);

  const [openProgressReport, setOpenProgressReport] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuTask(task);
  };

  const handleMenuClose = (resetTask: boolean = true) => {
    setMenuAnchorEl(null);
    if (resetTask) {
      setMenuTask(null);
    }
  };
  // ------------------ Date Utilities ------------------
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return { label: "", time: "", type: "default" };

    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");
    const yesterday = today.subtract(1, "day");
    const dueDate = dayjs(dateString);

    if (dueDate.isSame(today, "day"))
      return { label: "Today", time: dueDate.format("h:mm A"), type: "today" };
    if (dueDate.isSame(tomorrow, "day"))
      return {
        label: "Tomorrow",
        time: dueDate.format("h:mm A"),
        type: "tomorrow",
      };
    if (dueDate.isSame(yesterday, "day"))
      return {
        label: "Yesterday",
        time: dueDate.format("h:mm A"),
        type: "past",
      };
    if (dueDate.isBefore(today, "day")) {
      const monthsDiff = today.diff(dueDate, "month");
      if (monthsDiff >= 1) {
        return {
          label: `${monthsDiff} month${monthsDiff > 1 ? "s" : ""} ago`,
          time: dueDate.format("h:mm A"),
          type: "monthsAgo",
        };
      }
      const daysDiff = today.diff(dueDate, "day");
      return {
        label: `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`,
        time: dueDate.format("h:mm A"),
        type: "past",
      };
    }
    return {
      label: dueDate.format("DD MMM"),
      time: dueDate.format("h:mm A"),
      type: "future",
    };
  };

  const getDueDateStyle = (type: string) => {
    switch (type) {
      case "today":
        return {
          border: "1px solid #1976d2",
          color: "#1976d2",
          backgroundColor: "#fff",
        };
      case "monthsAgo":
        return {
          border: "1px solid #fd7e14",
          color: "#fd7e14",
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

  // ------------------ Handlers ------------------
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchTaskData = useCallback(
    (
      pageNum = page,
      limit = rowsPerPage,
      searchText = search,
      filterValues = filters
    ) => {
      const payload = {
        From: pageNum * limit + 1,
        To: (pageNum + 1) * limit,
        Search: searchText || "",
        TaskType: filterValues.taskType || "",
        DueDate: filterValues.dueDate || "",
        DateType:
          filterValues.dateField === "Created Date"
            ? "CreatedDate"
            : filterValues.dateField === "Modified Date"
            ? "ModifiedDate"
            : "",
        FromCreatedDate:
          filterValues.dateField === "Created Date" && filterValues.fromDate
            ? dayjs(filterValues.fromDate).format("MM/DD/YYYY")
            : "",
        ToCreatedDate:
          filterValues.dateField === "Created Date" && filterValues.toDate
            ? dayjs(filterValues.toDate).format("MM/DD/YYYY")
            : "",
        FromModifiedDate:
          filterValues.dateField === "Modified Date" && filterValues.fromDate
            ? dayjs(filterValues.fromDate).format("MM/DD/YYYY")
            : "",
        ToModifiedDate:
          filterValues.dateField === "Modified Date" && filterValues.toDate
            ? dayjs(filterValues.toDate).format("MM/DD/YYYY")
            : "",
        IsFavourite: false,
        IsTarget: null,
        UserId: "",
      };
      dispatch(fetchTasks(payload));
    },
    [dispatch, page, rowsPerPage, search, filters]
  );

  useEffect(() => {
    fetchTaskData();
  }, [page, rowsPerPage]);

  const handleSearchChange = debounce((value: string) => {
    setPage(0);
    fetchTaskData(0, rowsPerPage, value);
  }, 500);

  const handleStatusChange = async (task: Task, newValue: number) => {
    await dispatch(
      updateTaskPercentage({
        taskId: task.TaskId,
        value: newValue,
        isMyTask: true,
      })
    );
    setStatusModal({ open: false, task: null });
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleApply = (appliedFilters: Filters) => {
    setFilters(appliedFilters);
    setPage(0);
    fetchTaskData(0, rowsPerPage, search, appliedFilters);
    handleClose();
  };

  const renderActiveFilters = () => {
  const chips: { key: keyof Filters; label: string }[] = [];

  if (filters.taskType) chips.push({ key: "taskType", label: `By Task Type: ${filters.taskType}` });
  if (filters.dueDate) chips.push({ key: "dueDate", label: `By Due Date: ${filters.dueDate}` });
  if (filters.dateField && (filters.fromDate || filters.toDate)) {
    chips.push({
      key: "dateField",
      label: `By ${filters.dateField}: ${filters.fromDate || "?"} → ${filters.toDate || "?"}`,
    });
  }

  return (
    <Box display="flex" flexWrap="wrap" gap={1} mt={1} px={4}>
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          onDelete={() => {
            // remove only that filter
            const newFilters = { ...filters, [chip.key]: "" };
            setFilters(newFilters);
            fetchTaskData(0, rowsPerPage, search, newFilters);
          }}
          sx={{ fontSize: "12px" }}
        />
      ))}

      {chips.length > 0 && (
        <Chip
          label="Clear Filter"
          color="error"
          onClick={() => {
            setFilters({});
            fetchTaskData(0, rowsPerPage, search, {});
          }}
          sx={{ fontSize: "12px" }}
        />
      )}
    </Box>
  );
};

  // ------------------ Render ------------------
  return (
    <Box className={styles.myTaskPage} sx={{ overflowX: "hidden" }}>
      {/* Filter + Search + Add Task */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingX={4}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleOpen}
          sx={{ textTransform: "none", px: 3 }}
          title="Filter"
        >
          Filter
        </Button>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            placeholder="Search"
            variant="standard"
            size="small"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              handleSearchChange(e.target.value);
            }}
          />
          <Button
            onClick={() => setOpenAddTask(true)}
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: "none" }}
            title="Add Task"
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {renderActiveFilters()}

      {/* Tabs */}
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab sx={{ textTransform: "none" }} label="My Task" />
        <Tab sx={{ textTransform: "none" }} label="Assigned By Me" />
        <Tab sx={{ textTransform: "none" }} label="Starred" />
      </Tabs>

      {/* Pending & Completed Tasks */}
      {tab === 0 && (
        <>
          {/* Pending Tasks Accordion */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Pending Tasks ({pendingTasks.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {pendingTasks.map((task) => (
                  <ListItem key={task.TaskId} divider>
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
                        <Typography fontWeight={600} color="#646c9a">
                          {task.Title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {task.Description}
                          </Typography>
                          <br />
                          {(() => {
                            const { label, time } = formatDueDate(
                              task.TaskEndDate
                            );
                            // Always show completed task due date in green border with green text
                            const completedStyle = {
                              border: "1px solid #2e7d32",
                              color: "#2e7d32",
                              backgroundColor: "#fff",
                            } as const;
                            return (
                              <span
                                style={{
                                  ...completedStyle,
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
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-flex",
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                      onClick={() => setStatusModal({ open: true, task })}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={task.CompletionPercentage || 0}
                        size={40}
                        thickness={5}
                        sx={{
                          color:
                            task.CompletionPercentage === 100
                              ? "#2e7d32"
                              : "#1976d2",
                        }}
                        title="Task Progress"
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      
                      >
                        <Typography variant="caption" color="textSecondary">
                          {task.CompletionPercentage ?? 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          toggleTaskFavourite({
                            taskId: task.TaskId,
                            currentValue: task.IsFavourite || false,
                            isMyTask: true,
                          })
                        )
                      }
                      title="Star"
                    >
                      {task.IsFavourite ? (
                        <StarIcon sx={{ color: "#646C9A" }} />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                    <IconButton onClick={(e) => handleMenuOpen(e, task)}>
                      <MoreVertIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Completed Tasks Accordion */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" color="green">
                Completed Tasks ({completedTasks.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {completedTasks.map((task) => (
                  <ListItem key={task.TaskId} divider>
                    <ListItemIcon>
                      <IconButton
                        onClick={() =>
                          dispatch(
                            undoTask({ taskId: task.TaskId, isMyTask: true })
                          )
                        }
                      >
                        <CheckCircleIcon color="primary" />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          fontWeight={500}
                          sx={{ textDecoration: "line-through" }}
                        >
                          {task.Title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {task.Description}
                          </Typography>
                          <br />
                          {(() => {
                            const { label, time, type } = formatDueDate(
                              task.TaskEndDate
                            );
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
                    <IconButton onClick={(e) => handleMenuOpen(e, task)}>
                      <MoreVertIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalCount || 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </>
      )}

      {/* Modals */}
      <StatusModal
        open={statusModal.open}
        onClose={() => setStatusModal({ open: false, task: null })}
        task={statusModal.task}
        onStatusChange={handleStatusChange}
      />

      <FilterPopover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onApply={handleApply}
      />

      <AddTaskModal
        open={openAddTask}
        onClose={() => setOpenAddTask(false)}
        currentUserId={1248} // Ideally from Redux
        onSuccess={() => fetchTaskData(page, rowsPerPage, search, filters)}
      />
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => handleMenuClose()}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <CommentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Comment" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenProgressReport(true);
            handleMenuClose(false);
          }}
        >
          <ListItemIcon>
            <LinearScaleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Progress" />
        </MenuItem>
      </Menu>
      <ProgressReportModal
        open={openProgressReport}
        onClose={() => setOpenProgressReport(false)}
        userName={menuTask?.AssignedToUsers?.[0]?.Name ?? "Unknown"}
        employeeNo={menuTask?.AssignedToUsers?.[0]?.EmployeeNo ?? "N/A"}
        progress={menuTask?.CompletionPercentage ?? 0}
      />
    </Box>
  );
};

export default MyTask;
