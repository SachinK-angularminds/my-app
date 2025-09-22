type StockCardProps = {
  name: string;
  symbol: string;
  marketCap: string;  // <-- use capital C
  price: number;
  change: number;
};


export default function StockCard({ name, marketCap, price, change }:StockCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
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
