import axiosInstance from "../axios/axiosInstance"

export async function refreshToken(){
const response = await axiosInstance.post("http://localhost:4000/auth/refresh")
return response
}