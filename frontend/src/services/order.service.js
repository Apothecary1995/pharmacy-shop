import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081'; 


const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        // Backend'inizde "x-access-token" başlığı bekleniyor.
        return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
};


const createOrder = (orderData) => {
    return axios.post(`${API_URL}/api/orders`, orderData, { headers: authHeader() });
};


const getMyOrders = () => {
    
    return axios.get(`${API_URL}/api/orders/user`, { headers: authHeader() }); 
};


const orderService = {
    createOrder,
    getMyOrders, 
};

export default orderService;