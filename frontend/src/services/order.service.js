import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081'; 


const authHeader = () => {
    
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        // Backend'inizde "x-access-token" başlığı bekleniyorsa bu kullanılır.
        // Eğer backend'iniz "Authorization: Bearer <token>" bekliyorsa,
        // bu satırı değiştirmeniz gerekir.
        return { 'x-access-token': user.accessToken };
        
        
        
    } else {
        return {};
    }
};


const createOrder = (orderData) => {
    
    return axios.post(`${API_URL}/api/orders`, orderData, { headers: authHeader() });
};


const getOrders = () => {
    return axios.get(`${API_URL}/api/orders`, { headers: authHeader() });
};



const orderService = {
    createOrder,
    getOrders,
    // ...
};

export default orderService;