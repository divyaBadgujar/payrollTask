import authSlice from "../store/slices/authSlice";
import taskSlice from "../store/slices/memberSlice";
import memberSlice from "../store/slices/taskSlice";

const rootReducer = {
    auth: authSlice,
    task: taskSlice,
    members : memberSlice,
}

export default rootReducer;
