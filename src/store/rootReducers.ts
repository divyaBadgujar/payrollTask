import { combineReducers } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";
import taskSlice from "./slices/taskSlice";
import memberSlice from "./slices/memberSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  task: taskSlice,
  member: memberSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
