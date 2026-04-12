import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AIInsights: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "30px",
          borderRadius: "12px",
          width: "500px",
          border: "1px solid #334155",
        }}
      >
        <h2>🤖 AI Insights</h2>

        <ul>
          <li>BUY signal for RELIANCE</li>
          <li>SELL signal for INFY</li>
          <li>High volatility in TCS</li>
        </ul>

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#ef4444",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AIInsights;