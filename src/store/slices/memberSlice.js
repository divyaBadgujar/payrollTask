import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateAPI } from "../../services/privateApi";
import { CC_Members, GET_ALL_LEADS } from "../../services/apiUrl";

const initialState = {
  leads: [],
  members: [],
  hasError: false,
  isLoading: false,
};

export const getAllLeads = createAsyncThunk("allLeads", async (payload) => {
  try {
    const res = await privateAPI.post(GET_ALL_LEADS, payload);
    if (res?.data?.data?.Leads?.length > 0) {
      const simplifiedLeads = res?.data?.data?.Leads?.map((lead) => {
        return {
          id: lead.Id,
          label: lead.LeadName,
        };
      });
      return simplifiedLeads || [];
    }
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
});

export const getCCMembers = createAsyncThunk("allCCMembers", async (params) => {
  const { from, text = "" } = params;
  const URL = CC_Members(from, text);
  try {
    const res = await privateAPI.get(URL);
    if (res?.data?.data?.Members?.length > 0) {
      return res?.data?.data?.Members || [];
    }
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
});

const memberSlice = createSlice({
  name: "member",
  initialState,
  extraReducers: (builder) => {
    builder

      //------------------ GET LEADS --------------------
      .addCase(getAllLeads.pending, (state) => {
        state.isLoadingoading = true;
        state.hasError = false;
      })
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.leads = action.payload;

      })
      .addCase(getAllLeads.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      //------------------ GET CC Members --------------------
      .addCase(getCCMembers.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getCCMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.members = action.payload;
      })
      .addCase(getCCMembers.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export default memberSlice.reducer;