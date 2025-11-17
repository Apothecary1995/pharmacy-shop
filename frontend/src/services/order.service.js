import api from "./api";

const createOrder = (orderData) => {
  // orderData = { items, shippingAddress, paymentMethod, prescriptionId }
  return api.post("/api/orders", orderData);
};

const getMyOrders = () => {
  return api.get("/api/orders/my-orders");
};

// --- Admin ---
const getAllOrders = (status = "") => {
  return api.get(`/api/orders?status=${status}`);
};

const updateOrderStatus = (orderId, status) => {
  return api.put("/api/orders/status", { orderId, status });
};

const orderService = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
export default orderService;