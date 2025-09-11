import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

const publicAPI: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

// Generic API response type
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

// ------------------- TYPED REQUEST FUNCTIONS -------------------
export async function getRequest<T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return publicAPI.get<T>(endpoint, config);
}

export async function postRequest<T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return publicAPI.post<T>(endpoint, data, config);
}

export async function putRequest<T = any>(
  endpoint: string,
  id: string | number,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return publicAPI.put<T>(`${endpoint}/${id}`, data, config);
}

export async function deleteRequest<T = any>(
  endpoint: string,
  id: string | number,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return publicAPI.delete<T>(`${endpoint}/${id}`, config);
}

export default publicAPI;
