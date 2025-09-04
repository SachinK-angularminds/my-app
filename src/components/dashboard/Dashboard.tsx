import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import StockCard from "./StockCard";
type Stock = {
  symbol: string;
  marketCap: string;
  name: string;
  price: number;
  change: number;
};
const Dashboard = () => {
  const [stockDataArr, setStockDataArr] = useState<Stock[]>([]);
  
 

  console.log(stockDataArr)
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* grid with 5 per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {stockDataArr.map((stock, idx) => (
          <StockCard key={idx} {...stock} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
