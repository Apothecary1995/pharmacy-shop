import React, { useState } from 'react';
import LeftSidebar from '../components/Layout/LeftSidebar';
import RightSidebar from '../components/Layout/RightSidebar';
import DrugList from '../components/Common/DrugList';

const HomePage = () => {
  const [selectedDrug, setSelectedDrug] = useState(null);

  return (
    <div className="main-layout">
      <LeftSidebar drug={selectedDrug} />
      
      <div className="center-content">
        <h2>All Products</h2>
        <DrugList onDrugSelect={setSelectedDrug} />
      </div>

      <RightSidebar />
    </div>
  );
};

export default HomePage;