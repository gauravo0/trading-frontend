import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Chart from "./components/Chart";

function App() {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [symbol, setSymbol] = useState("");
  const [searchedSymbol, setSearchedSymbol] = useState(""); // ✅ FIX
  const [stock, setStock] = useState<any>(null);
  const [compareSymbols, setCompareSymbols] = useState("");
  const [compareData, setCompareData] = useState<any[]>([]);

  const fetchStock = async () => {
    if (!symbol.trim()) return;

    try {
      console.log("🔍 Fetching stock:", symbol);

      const res = await fetch(`${API}/api/stocks/${symbol}`);
      const data = await res.json();

      console.log("📦 Stock API:", data);

      setStock(data);

      // ✅ Lock symbol ONLY after search click
      setSearchedSymbol(symbol);

    } catch (err) {
      console.error("❌ Stock error:", err);
    }
  };

  const fetchComparison = async () => {
    try {
      const symbolsArray = compareSymbols.split(",").map((s) => s.trim());

      const res = await fetch(`${API}/api/stocks/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(symbolsArray),
      });

      const data = await res.json();
      setCompareData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a", color: "white" }}>
      
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#020617", padding: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>📊 TradeX</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "10px 0" }}>Dashboard</li>
          <li style={{ margin: "10px 0" }}>Stocks</li>
          <li style={{ margin: "10px 0" }}>Portfolio</li>
          <li style={{ margin: "10px 0" }}>Watchlist</li>
          <li style={{ margin: "10px 0" }}>News</li>
        </ul>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ fontSize: "28px" }}>📈 Trading Dashboard</h1>

        {/* Search */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <input
            placeholder="Enter stock (AAPL or RELIANCE.NSE)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            style={{ padding: "10px", borderRadius: "8px", border: "none" }}
          />
          <button
            onClick={fetchStock}
            style={{ padding: "10px 20px", background: "#22c55e", borderRadius: "8px" }}
          >
            Search
          </button>
        </div>

        {/* Stock Card */}
        {stock && (
          <div style={{ marginTop: "20px", background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
            <h2>{stock.name}</h2>
            <p style={{ fontSize: "22px" }}>₹{stock.price}</p>
            <p style={{ color: stock.percentChange > 0 ? "#22c55e" : "#ef4444" }}>
              {stock.percentChange}%
            </p>
          </div>
        )}

        {/* ✅ Chart ONLY after search */}
        {stock && searchedSymbol && (
          <div style={{ marginTop: "30px" }}>
            <Chart symbol={searchedSymbol} />
          </div>
        )}

        {/* Compare */}
        <div style={{ marginTop: "30px" }}>
          <h2>Compare Stocks</h2>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              placeholder="AAPL, MSFT"
              value={compareSymbols}
              onChange={(e) => setCompareSymbols(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px" }}
            />
            <button
              onClick={fetchComparison}
              style={{ padding: "10px 20px", background: "#3b82f6", borderRadius: "8px" }}
            >
              Compare
            </button>
          </div>

          {compareData.length > 0 && (
            <div style={{ marginTop: "20px", background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={compareData}>
                  <XAxis dataKey="symbol" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Cards */}
        <div style={{
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          {["AI Alerts", "Market Trends", "Investor Activity", "News & Sentiment"].map((item, i) => (
            <div key={i} style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
              <h3>{item}</h3>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;