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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Access token is missing");
        }

        const response = await axiosInstance.get("/api/dashboard/stocks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(response);
        const stockDataList = response?.data;
        setStockDataArr((prev) => {
          const updated = [...prev];

          // Append each new stock
          for (let i = 0; i < stockDataList.length; i++) {
            updated.push({
              symbol:stockDataList[i]?.symbol,
              name:stockDataList[i]?.name,
              price:stockDataList[i]?.price,
              marketCap:stockDataList[i]?.marketCap,
              change:stockDataList[i]?.change
            })
          }

          // Return the new array
          return updated;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
