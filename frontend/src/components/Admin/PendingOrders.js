import React, { useState, useEffect } from 'react';
import orderService from '../../services/order.service';

const PendingOrders = ({ refreshKey }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders('pending_approval');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingOrders();
  }, [refreshKey]); 

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      fetchPendingOrders(); 
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <p>Loading pending orders</p>;

  return (
    <div className="admin-section">
      <h3>Pending Orders (Awaiting Approval)</h3>
      <div className="order-list">
        {orders.length === 0 ? <p>No pending orders.</p> : (
          orders.map(o => (
            <div key={o.id} className="order-item">
              <p><strong>Order ID:</strong> {o.id} | <strong>User:</strong> {o.user.email}</p>
              <p><strong>Total:</strong> ${o.totalPrice} | <strong>Status:</strong> <span className="status-pending_approval">{o.status}</span></p>
              <p><strong>Prescription ID:</strong> {o.prescriptionId} 
                (<span className={`status-${o.prescription?.status}`}>{o.prescription?.status}</span>)
              </p>
              <ul>
                {o.orderItems.map(item => (
                  <li key={item.id}>{item.drug.name} (x{item.quantity})</li>
                ))}
              </ul>
              <div style={{marginTop: '10px'}}>
                <button 
                  onClick={() => handleStatusUpdate(o.id, 'verified')} 
                  className="btn btn-success"
                  disabled={o.prescription?.status !== 'approved'}
                >
                  Verify Order
                </button>
                <button onClick={() => handleStatusUpdate(o.id, 'cancelled')} className="btn btn-danger" style={{marginLeft: '10px'}}>
                  Cancel Order
                </button>
              </div>
              {o.prescription?.status !== 'approved' && 
                <p style={{color: 'red', fontSize: '0.9em', marginTop: '5px'}}>
                  Cannot verify order: Prescription is not approved yet.
                </p>
              }
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingOrders;