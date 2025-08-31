
import axios from "axios";

const publicAPI = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL
})

export const get = (endPoint) => {
    return publicAPI.get(endPoint)
}

export const post = (endPoint, data) => {
    return publicAPI.post(endPoint, data)
}

export const put = (endPoint, id, data) => {
    return publicAPI.put(`${endPoint}/${id}`, data)
}

export const deleteRequest = (endPoint, id) => {
    return publicAPI.delete(`${endPoint}/${id}`)
}

export default publicAPI