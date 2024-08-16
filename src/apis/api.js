// importing axios
import axios from "axios";

// Creating Axios instance
const Api = axios.create({
    baseURL: "http://localhost:5500",
    withCredentials: true,
})

// configuration for axios
const config = {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
    }
}

// Creating test API
export const testApi = () => Api.get("/test");

// Creating register API
export const registerApi = (data) => Api.post("/api/user/register", data);

// Creating login API
export const loginApi = (data) => Api.post("/api/user/login", data);

export const getUserProfileApi = (userId) => Api.get(`/api/user/profile/${userId}`, config);

export const verifyEmailApi = (token) => Api.get(`/verify-email/${token}`);

// create product API
export const createProductApi = (formData) => Api.post('/api/products/create_product', formData, config)

// get products API
export const getAllProductsApi = () => Api.get('/api/products/get_products')

// get single product API
export const getSingleProductApi = (id) => Api.get(`/api/products/get_product/${id}`)

// update product
export const updateProductApi 
        = (id, formData) => Api.put(`/api/products/update_product/${id}`, formData, config)

// delete product
export const deleteProductApi = (id) => Api.delete(`/api/products/delete_product/${id}`, config)

export const forgetApi = (data) => Api.post("/api/auth/forgot-password", data);

export const resetApi = (data) => Api.post("/api/auth/reset-password",data);


export const getAuditLogsApi = () => Api.get("/api/audit-logs", config);



export default Api;