import React, { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import StockCard from "./StockCard";
import "./dashboard.css";
import { useSocket } from "../../context/SocketContext";

type Stock = {
  symbol: string;
  marketCap: string;
  name: string;
  price: number;
  change: number;
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose} // Close modal on backdrop click
    >
      {/* Stop propagation to avoid closing when clicking inside modal */}
      <div 
        className="bg-white rounded-lg p-6 w-2/5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        {/* Modal content */}
        {children}
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [stockDataArr, setStockDataArr] = useState<Stock[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);


  //chatbot variable
  const {message,setMessage,handleSubmit} = useSocket()

// useEffect(() => {
//       socketRef.current = io("http://localhost:5000");

//     socketRef.current.on("connect", () => {
//       console.log("Connected to server:", socketRef.current?.id); // Unique socket identifier
//     });
//     socketRef.current.on("chat message", (msg: string) => {
//       console.log(msg);
//     });

//     return () => {
//     socketRef.current?.disconnect();
//     socketRef.current = null;
//   };
//   }, []);
  const limit = 20;

  //implementing infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);

  const options = {
    root: null,
    rootMargin: "-90px",
    threshold: 0.01,
  };
  const fetchData = async (pageNum: number) => {
    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");
      // debugger
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await axiosInstance.get(
        `/api/dashboard/stocks?page=${pageNum}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log(response);
      const stockDataList = response?.data;
      setStockDataArr((prev) => {
        const updated = [...prev];

        // Append each new stock
        for (let i = 0; i < stockDataList.length; i++) {
          updated.push({
            symbol: stockDataList[i]?.symbol,
            name: stockDataList[i]?.name,
            price: stockDataList[i]?.price,
            marketCap: stockDataList[i]?.marketCap,
            change: stockDataList[i]?.change,
          });
        }

        // Return the new array
        return updated;
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      // debugger;
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); // trigger loading of new posts by chaging page no
        }
      }, options);

      if (node) observer.current.observe(node);
    },
    [loading],
  );
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(message);
    
  //     socketRef.current?.emit("chat message", message);
  //     setMessage("");
   
  // };
  useEffect(() => {
    fetchData(page);
    // debugger;
  }, [page]);

  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* grid with 5 per row */}
     
      <button 
        onClick={() => setModalOpen(true)} 
        className="btn"
      >
        Open Modal
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
         <form id="message-form" onSubmit={handleSubmit}>
              <input
                type="text"
                id="message-input"
                value={message}
                placeholder="Type your message here..."
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {stockDataArr.map((stock, idx) => (
          <StockCard key={idx} {...stock} /> //stock card rendering
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
