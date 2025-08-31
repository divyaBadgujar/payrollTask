// export const LOGINAPI = "referral/ReferralRedirect/SignUp";
export const LOGIN = "account/authenticate";
export const TASK = "Task/UserTasksAssignedToMe"
export const ADD_TASK = "Task/AssignTask"
export const DELETE_TASK = "/Task/DeleteTask"
export const UPDATE_TASK_STATUS = "/Task/UpdateTaskStatus"
export const GET_ALL_LEADS = "/CRM/Leads";
export const CC_Members = (start, search) => {
    return `/CompanyMembers?from=${start}&text=${search}&to=${start + 70}`;
};