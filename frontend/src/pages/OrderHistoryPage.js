import React, { useState, useEffect } from 'react';
import orderService from '../services/order.service';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="center-content" style={{maxWidth: '900px', margin: '20px auto'}}><p>Loading your orders</p></div>;
  }

  return (
    <div className="center-content" style={{maxWidth: '900px', margin: '20px auto'}}>
      <h2>My Order History</h2>
      {orders.length === 0 ? <p> not placed any orders yet.</p> : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <p><strong>Order ID:</strong> {order.id} | <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.totalPrice} | <strong>Status:</strong> <span className={`status-${order.status}`}>{order.status.replace('_', ' ')}</span></p>
              <p><strong>Payment:</strong> {order.paymentStatus}</p>
              <ul style={{marginLeft: '20px', listStyle: 'square'}}>
                {order.orderItems.map(item => (
                  <li key={item.id}>
                    {item.drug.name} (x{item.quantity}) - ${item.pricePerUnit} each
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;