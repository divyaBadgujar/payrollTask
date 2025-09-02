import authSlice from "../store/slices/authSlice";
import taskSlice from "../store/slices/taskSlice";
import memberSlice from "../store/slices/memberSlice";

const rootReducer = {
    auth: authSlice,
    task: taskSlice,
    members : memberSlice,
}

export default rootReducer;
