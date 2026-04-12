import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Chart from "./components/Chart";
import IndicatorPanel from "./components/IndicatorPanel";
function App() {
  const API = import.meta.env.VITE_API_BASE_URL;

  // ✅ 1. NAVIGATION STATE
  const [activeTab, setActiveTab] = useState("Dashboard");

  // ✅ EXISTING STATES
  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState<any | null>(null);
  const [interval, setInterval] = useState("1day");
  const [compareSymbols, setCompareSymbols] = useState("");
  const [compareData, setCompareData] = useState<any[]>([]);
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [premiumWatchlist, setPremiumWatchlist] = useState<string[]>([]);
  const [watchInput, setWatchInput] = useState("");
  const [showAI, setShowAI] = useState(false);

  // ✅ LOGIC FUNCTIONS
  const fetchStock = async () => {
    if (!symbol) return alert("Enter stock symbol");
    try {
      const res = await fetch(`${API}/api/stocks/${symbol}`);
      const data = await res.json();
      setStock(data);
      setActiveTab("Stocks"); // Switch to Stocks view when searchingß
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComparison = async () => {
    if (!compareSymbols) return alert("Enter symbols");
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

  const addToWatchlist = () => {
    if (!watchInput) return;
    const stockName = watchInput.toUpperCase();
    setWatchlist((prev) =>
      prev.includes(stockName) ? prev : [...prev, stockName],
    );
    setWatchInput("");
  };

  const addStockFromCard = (s: string) => {
    setWatchlist((prev) => (prev.includes(s) ? prev : [...prev, s]));
  };

  const addToPremium = (item: string) => {
    setPremiumWatchlist((prev) => [...prev, item]);
    setWatchlist((prev) => prev.filter((s) => s !== item));
  };

  const removeFromWatchlist = (item: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== item));
  };

  // ✅ 2. DYNAMIC CONTENT RENDERER
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div style={{ animation: "fadeIn 0.5s" }}>
            <h2>🏠 Market Overview</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {[
                "AI Alerts",
                "Market Trends",
                "Investor Activity",
                "News & Sentiment",
              ].map((card) => (
                <div
                  key={card}
                  style={{
                    background: "#1e293b",
                    padding: "30px 20px",
                    borderRadius: "12px",
                    border: "1px solid #334155",
                  }}
                >
                  <h3 style={{ fontSize: "16px", margin: 0 }}>{card}</h3>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "12px",
                      marginTop: "10px",
                    }}
                  >
                    Live updates active
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

case "Stocks":
        return (
          <div style={{ animation: "fadeIn 0.5s" }}>
            <h2>🔍 Stock Analysis</h2>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              {["1day", "1week", "1month"].map((int) => (
                <button
                  key={int}
                  onClick={() => setInterval(int)}
                  style={{
                    padding: "6px 10px",
                    background: interval === int ? "#22c55e" : "#334155",
                    borderRadius: "6px",
                    border: "none",
                    color: "white",
                    // cursor: "pointer",
                  }}
                >
                  {int}
                </button>
              ))}
              {/* ✅ ADD RSI BUTTON HERE */}
              <button
                onClick={() => setShowRSI(!showRSI)}
                style={{
                  padding: "6px 10px",
                  background: showRSI ? "#22c55e" : "#334155",
                  borderRadius: "6px",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                RSI
              </button>
            </div>
            {/* 📊 Indicator Panel */}
            <IndicatorPanel
              showEMA={showEMA}
              setShowEMA={setShowEMA}
              showRSI={showRSI}
              setShowRSI={setShowRSI}
              showVolume={showVolume}
              setShowVolume={setShowVolume}
            />

            {/* STOCK + CHART */}
            {stock && (
              <>
                <div
                  style={{
                    marginTop: "20px",
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <h2>
                    {stock.name} ({stock.symbol})
                  </h2>
                  <h3>₹ {Number(stock.price)}</h3>
                  <p
                    style={{
                      color:
                        Number(stock.percentChange) > 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {Number(stock.percentChange)}%
                  </p>
                </div>

                <div style={{ marginTop: "30px" }}>
                  <Chart
                    symbol={stock.symbol}
                    interval={interval}
                    showRSI={showRSI}
                    showEMA={showEMA}
                    showVolume={showVolume}
                  />
                </div>
              </>
            )}

            <div
              style={{
                marginTop: "40px",
                background: "#1e293b",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <h3>📈 Compare Stocks</h3>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                <input
                  placeholder="TCS.NS, INFY.NS"
                  value={compareSymbols}
                  onChange={(e) => setCompareSymbols(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "white",
                    flex: 1,
                  }}
                />
                <button
                  onClick={fetchComparison}
                  style={{
                    padding: "10px 20px",
                    background: "#3b82f6",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Compare
                </button>
              </div>
              {compareData.length > 0 && (
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={compareData}>
                      <XAxis dataKey="symbol" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ background: "#020617", border: "none" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#22c55e"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        );

      case "Watchlist":
        return (
          <div style={{ animation: "fadeIn 0.5s" }}>
            <h2>⭐ My Watchlists</h2>
            <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
              <input
                placeholder="Quick Add Symbol"
                value={watchInput}
                onChange={(e) => setWatchInput(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "white",
                }}
              />
              <button
                onClick={addToWatchlist}
                style={{
                  padding: "10px 20px",
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "#1e293b",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h3>📌 Standard</h3>
                {watchlist.length === 0 ? (
                  <p style={{ color: "#64748b" }}>Empty</p>
                ) : (
                  watchlist.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid #334155",
                      }}
                    >
                      <span>{item}</span>
                      <div>
                        <button
                          onClick={() => addToPremium(item)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "gold",
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => removeFromWatchlist(item)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                style={{
                  background: "#1e293b",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid gold",
                }}
              >
                <h3 style={{ color: "gold" }}>💎 Premium</h3>
                {premiumWatchlist.length === 0 ? (
                  <p style={{ color: "#64748b" }}>Empty</p>
                ) : (
                  premiumWatchlist.map((item, i) => (
                    <div key={i} style={{ padding: "10px 0", color: "gold" }}>
                      {item}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
              color: "#64748b",
            }}
          >
            <h2>{activeTab}</h2>
            <p>This module is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b0e14",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ✅ SIDEBAR */}
      <div
        style={{
          width: "240px",
          background: "#020617",
          padding: "25px 15px",
          borderRight: "1px solid #1e293b",
        }}
      >
        <h2
          style={{
            color: "#3b82f6",
            marginBottom: "40px",
            paddingLeft: "10px",
          }}
        >
          📊 TradeX
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["Dashboard", "Stocks", "Portfolio", "Watchlist", "News"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  textAlign: "left",
                  padding: "12px 20px",
                  background: activeTab === tab ? "#1e293b" : "transparent",
                  color: activeTab === tab ? "#3b82f6" : "#94a3b8",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: activeTab === tab ? "600" : "400",
                  transition: "all 0.3s ease",
                }}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* ✅ MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Persistent Header */}
        <div
          style={{
            padding: "20px 40px",
            background: "#020617",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <h1 style={{ fontSize: "22px", margin: 0 }}>{activeTab}</h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              placeholder="Search Symbol (e.g. RELIANCE.NS)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                background: "#0f172a",
                border: "1px solid #334155",
                color: "white",
                width: "250px",
              }}
            />
            <button
              onClick={fetchStock}
              style={{
                padding: "10px 25px",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div style={{ padding: "30px 40px", overflowY: "auto", flex: 1 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
export default App;
