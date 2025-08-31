import axios from "axios";
import {  getAccessToken } from "../utils/utils";
import toast from "../utils/toast";

export const privateAPI = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

//API Request handler
const requestHandler = (request) => {
  const token = getAccessToken() || "";
  request.headers.Authorization = `Basic ${token}`;
  return request;
};

const requestErrorHandler = (error) => {
  return Promise.reject(error);
};


//API Response handler
const responseHandler = (response) => {
  return response;
};

const responseErrorHandler = (error) => {
  if (error.response) {
    const { status, data, message } = error.response;

    switch (status) {
      case 400:
        toast.error(data.message ? data.message : message || "Bad Credentials");
        break;

      case 403:
        toast.error(
          data.message ? data.message : message || "Access Denied/ Forbidden"
        );
        break;

      case 404:
        toast.error(
          data.message ? data.message : message || "Resource Not Found"
        );
        break;

      case 405:
        toast.error(data.message ? data.message : message || "Invalid Request");
        break;

      case 409:
        toast.error(
          data.message ? data.message : message || "Resource already exists."
        );
        break;

      case 422:
        toast.error(data.message ? data.message : message || "Already Exists");
        break;

      case 500:
        toast.error(
          data.message ? data.message : message || "Internal Server Error"
        );
        break;

      case 501:
        toast.error(data.message ? data.message : message || "Session Expired");
        break;

      case 504:
        toast.error(data.message ? data.message : message || "Network Error");
        break;

      default:
        toast.error(
          data.message ? data.message : message || "Some Error Occurred"
        );
        break;
    }
  } else {
    toast.error(error?.message || "Some Error Occurred");
  }

  return Promise.reject(error);
};

privateAPI.interceptors.request.use(requestHandler, requestErrorHandler);
privateAPI.interceptors.response.use(responseHandler, responseErrorHandler);