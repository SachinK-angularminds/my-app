<<<<<<< HEAD
import React, { forwardRef } from "react";

type StockProps = {
  name: string;
  symbol: string;
  marketCap: string;
  price: number;
  change: number;
};

const StockCard = forwardRef<HTMLDivElement, StockProps>(
  ({ name, symbol, marketCap, price, change }, ref) => {
    return (
      <div ref={ref} className="bg-white rounded-2xl shadow-md flex flex-col">
        <div className="h-40 bg-gray-100 flex items-center justify-center">
          <span className="text-sm text-gray-400">{name}</span>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <p className="text-sm text-gray-500 mb-4">{marketCap}</p>
          <div className="mt-auto flex items-center justify-between">
            <div>
              <div className="text-xl font-bold">₹{price}</div>
              <div
                className={`text-sm ${
                  change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {change >= 0 ? `+${change}%` : `${change}%`}
              </div>
            </div>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">
              View
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default StockCard;
=======
export default function StockCard({ name, symbol, marketcap, price, change }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        <span className="text-sm text-gray-400">{name}</span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">{marketcap}</p>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">₹{price}</div>
            <div
              className={`text-sm ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? `+${change}%` : `${change}%`}
            </div>
          </div>
          <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 1d6c740... first commit
