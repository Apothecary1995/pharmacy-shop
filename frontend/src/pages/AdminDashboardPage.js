import React, { useState } from 'react';
import PendingPrescriptions from '../components/Admin/PendingPrescriptions';
import PendingOrders from '../components/Admin/PendingOrders';

const AdminDashboardPage = () => {
  
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      <PendingPrescriptions onUpdate={handleUpdate} />
      <PendingOrders refreshKey={refreshKey} />
    </div>
  );
};

export default AdminDashboardPage;