import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import privateAPI from "../../services/privateApi";
import { CC_Members, GET_ALL_LEADS } from "../../services/apiUrl";

interface Lead {
  id: number | string;
  label: string;
}

interface Member {
  Id: number | string;
  Name: string;
  [key: string]: any;
}

interface MemberState {
  leads: Lead[];
  members: Member[];
  hasError: boolean;
  isLoading: boolean;
}

const initialState: MemberState = {
  leads: [],
  members: [],
  hasError: false,
  isLoading: false,
};

// ------------------ GET LEADS --------------------
export const getAllLeads = createAsyncThunk<Lead[], any>(
  "allLeads",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await privateAPI.post(GET_ALL_LEADS, payload);
      const leads = res?.data?.data?.Leads || [];
      return leads.map((lead: any) => ({
        id: lead.Id,
        label: lead.LeadName,
      }));
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error?.response?.data || "Failed to fetch leads");
    }
  }
);

// ------------------ GET CC MEMBERS --------------------
export const getCCMembers = createAsyncThunk<Member[], { from: number; text?: string }>(
  "allCCMembers",
  async ({ from, text = "" }, { rejectWithValue }) => {
    try {
      const URL = CC_Members(from, text);
      const res = await privateAPI.get(URL);
      return res?.data?.data?.Members || [];
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error?.response?.data || "Failed to fetch members");
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ------------------ GET LEADS --------------------
      .addCase(getAllLeads.pending, (state) => {
        state.isLoading = true;
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

      // ------------------ GET CC MEMBERS --------------------
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
