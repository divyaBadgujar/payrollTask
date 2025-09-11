import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "../utils/utils";
import toast from "../utils/toast";

const privateAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

// Correctly typed request interceptor
const requestHandler = (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = getAccessToken() || "";

  // Ensure headers exist and cast to the strict type Axios expects
  request.headers = request.headers ?? {};
  (request.headers as Record<string, string>)["Authorization"] = `Basic ${token}`;

  return request;
};

const requestErrorHandler = (error: AxiosError): Promise<never> => Promise.reject(error);

const responseHandler = <T = any>(response: AxiosResponse<T>) => response;

const responseErrorHandler = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const { status, data } = error.response as AxiosResponse<{ message?: string }>;
    toast.error(data?.message || error.message);
  } else {
    toast.error(error.message || "Some Error Occurred");
  }
  return Promise.reject(error);
};

// Attach interceptors
privateAPI.interceptors.request.use(requestHandler, requestErrorHandler);
privateAPI.interceptors.response.use(responseHandler, responseErrorHandler);

export default privateAPI;
