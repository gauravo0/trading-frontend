import React, { useEffect, useState } from "react";
import { fetchStockData } from "../services/stockService";

const StockComponent = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStockData = async () => {
      try {
        const data = await fetchStockData(symbol);
        setStockData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    getStockData();
  }, [symbol]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stockData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Stock Data for {symbol}</h1>
      <pre>{JSON.stringify(stockData, null, 2)}</pre>
    </div>
  );
};

export default StockComponent;
