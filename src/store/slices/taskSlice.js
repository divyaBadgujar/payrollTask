import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateAPI } from "../../services/privateApi";
import {
  ADD_TASK,
  DELETE_TASK,
  TASK,
  UNDO_TASK,
  UPDATE_TASK_FIELD,
  UPDATE_TASK_STATUS,
} from "../../services/apiUrl";
import { defaultTaskPayload, formatData } from "../../utils/utils";
import toast from "../../utils/toast";

const initialState = {
  pendingTasks: [],
  completedTasks: [],
  totalCount: 0,
  loading: false,
  hasError: null,
};

export const toggleTaskFavourite = createAsyncThunk(
  "task/toggleTaskFavourite",
  async ({ taskId, currentValue, isMyTask }, { rejectWithValue }) => {
    try {
      const response = await privateAPI.put(
        `${UPDATE_TASK_FIELD}?taskId=${taskId}`,
        {
          FieldName: "IsFavourite",
          Value: !currentValue,
          IsMyTask: isMyTask,
        }
      );

      if (response.data?.Status !== 200) {
        throw new Error(response.data?.Message || "Failed to update favourite");
      }

      return { taskId, value: !currentValue };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (payload) => {
    try {
      const response = await privateAPI.post(TASK, payload);

      if (response.data?.Status !== 200) {
        return {
          pendingTasks: [],
          completedTasks: [],
          totalCount: 0,
        };
      }

      const apiData = response.data.data;

      return {
        pendingTasks: apiData?.Pending || [],
        completedTasks: apiData?.Completed || [],
        totalCount: apiData?.TotalRecords || 0,
      };
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  }
);


export const addTask = createAsyncThunk(
  "task/addTask",
  async (payload, { dispatch }) => {
    try {
      const data = await formatData(payload);
      await privateAPI.post(ADD_TASK, data);
      toast.success("Task added successfully");
      dispatch(fetchTasks(defaultTaskPayload));
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId, { dispatch }) => {
    try {
      await privateAPI.get(DELETE_TASK + `?taskId=${taskId}`);

      toast.success("Task Deleted successfully");
      dispatch(fetchTasks(defaultTaskPayload));
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "task/updateTaskStatus",
  async (data, { dispatch }) => {
    try {
      await privateAPI.post(UPDATE_TASK_STATUS, data);
      toast.success("Task Status updated successfully");
      dispatch(fetchTasks(defaultTaskPayload));
    } catch (error) {
      console.log(error);
      throw error.response.data;
    }
  }
);

export const markTaskCompleted = createAsyncThunk(
  "task/markTaskCompleted",
  async ({ taskId, isMyTask }, { dispatch, rejectWithValue }) => {
    try {
      const res = await privateAPI.put(
        `${UPDATE_TASK_FIELD}?taskId=${taskId}`,
        {
          FieldName: "TaskStatus",
          Value: 100,       // ✅ Completed
          IsMyTask: isMyTask,
        }
      );

      if (res?.data?.Status !== 200) {
        throw new Error(res?.data?.Message || "Failed to mark completed");
      }

      toast.success("Task moved to Completed");
      dispatch(fetchTasks(defaultTaskPayload));
      return { taskId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const undoTask = createAsyncThunk(
  "task/undoTask",
  async ({ taskId, isMyTask }, { dispatch }) => {
    try {
      await privateAPI.put(`${UNDO_TASK}?taskId=${taskId}&isMyTask=${isMyTask}`);
      toast.success("Task moved back to Pending");
      dispatch(fetchTasks(defaultTaskPayload));
    } catch (error) {
      console.log(error);
      throw error.response?.data || error.message;
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleTaskFavourite.fulfilled, (state, action) => {
        const { taskId, value } = action.payload;

        // update in pendingTasks
        const pendingTask = state.pendingTasks.find((t) => t.TaskId === taskId);
        if (pendingTask) pendingTask.IsFavourite = value;

        // update in completedTasks
        const completedTask = state.completedTasks.find((t) => t.TaskId === taskId);
        if (completedTask) completedTask.IsFavourite = value;
      })


      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.hasError = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.hasError = null;
        state.pendingTasks = action.payload.pendingTasks;
        state.completedTasks = action.payload.completedTasks;
        state.totalCount = action.payload.totalCount;
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.hasError = action.error.message;
      })


      //--------------------- ADD TASK STATUS ---------------------
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.hasError = null;
      })
      .addCase(addTask.fulfilled, (state) => {
        state.loading = false;
        state.hasError = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.hasError = action.error.message;
      })

      //------------------- DELETE TASK STATUS -----------------
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.hasError = null;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.loading = false;
        state.hasError = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.hasError = action.error.message;
      })

      //---------------- UPDATE TASK STATUS -------------------------
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.hasError = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state) => {
        state.loading = false;
        state.hasError = null;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.hasError = action.error.message;
      })

      // ------------------- UNDO TASK STATUS -----------------
    .addCase(undoTask.pending, (state) => {
        state.loading = true;
        state.hasError = null;
      })
    .addCase(undoTask.fulfilled, (state) => {
      state.loading = false;
      state.hasError = null;
    })
    .addCase(undoTask.rejected, (state, action) => {
      state.loading = false;
      state.hasError = action.error.message;
    });

},
});

export const { setFilterData } = taskSlice.actions;
export default taskSlice.reducer;