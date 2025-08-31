import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//import { publicR } from "../services/publicAPI";
import publicAPI from "../../services/publicApi";
import { LOGIN } from "../../services/apiUrl";
import toast from "../../utils/toast";
import { setAccessToken } from "../../utils/utils";

const initialState = {
  isLoading: false,
  hasError: false,
  user: null,
};

export const userLogin = createAsyncThunk(
  "auth/user-login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await publicAPI.post(LOGIN, payload);
      if (res?.data?.success) {
        const combined = `${payload.username}:${payload.password}`;
        const base64Encoded = btoa(combined);
        // const referralToken = res?.data?.referralToken;
        setAccessToken(base64Encoded);
        localStorage.setItem("UserId", res?.data?.userDetail?.data?.UserId);
        toast.success(res?.statusText || "Login successful");
        return true;
      } else {
        const msg =
          res?.data?.errormessage || "Login failed, please try again later";
        console.error(msg);
        toast.error(msg);
        return rejectWithValue(msg);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An unknown error occurred. Please try again later.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  exytraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(userLogin.fulfilled, (state) => {
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(userLogin.rejected, (state) => {
        state.hasError = true;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;