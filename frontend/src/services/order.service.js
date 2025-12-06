import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081';

const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
};



const createOrder = (orderData) => {
    
    return axios.post(`${API_URL}/api/orders`, orderData, { headers: authHeader() });
};

const getMyOrders = () => {
    // Route: GET /api/orders/user
    return axios.get(`${API_URL}/api/orders/user`, { headers: authHeader() });
};



const getAllOrders = (status) => {
    
    const url = status ? `${API_URL}/api/orders?status=${status}` : `${API_URL}/api/orders`;
    return axios.get(url, { headers: authHeader() });
};

const updateOrderStatus = (orderId, status) => {
    
    return axios.put(
        `${API_URL}/api/orders/status`, 
        { orderId: orderId, status: status }, 
        { headers: authHeader() }
    );
};

const orderService = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};

export default orderService;
