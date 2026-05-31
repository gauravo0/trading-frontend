import React from "react";

interface NewsItem {
  headline: string;
  source: string;
  sentiment: string;
  time: string;
  summary: string;
}

interface Props {
  data: {
    overallSentiment: string;
    confidence: number;
    insight: string;
    news: NewsItem[];
  };
}

const getColor = (sentiment: string) => {
  if (sentiment === "Positive") return "#22c55e";
  if (sentiment === "Negative") return "#ef4444";
  return "#eab308";
};

const NewsPanel: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ padding: "20px" }}>
      
      {/* 🔥 TOP SUMMARY */}
      <div
        style={{
          background: "#020617",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #334155",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {data.overallSentiment === "Bullish" ? "🟢" : "🔴"}{" "}
          {data.overallSentiment} ({data.confidence}%)
        </h2>

        <p style={{ color: "#94a3b8", marginTop: "10px" }}>
          {data.insight}
        </p>
      </div>

      {/* 🔥 NEWS LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {data.news.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#020617",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #334155",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  color: getColor(item.sentiment),
                  fontWeight: "600",
                }}
              >
                {item.sentiment}
              </span>

              <span style={{ color: "#64748b", fontSize: "12px" }}>
                {item.time}
              </span>
            </div>

            {/* Headline */}
            <h3 style={{ margin: "5px 0", fontSize: "16px" }}>
              {item.headline}
            </h3>

            {/* Source */}
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>
              {item.source}
            </p>

            {/* Summary */}
            <p style={{ color: "#cbd5f5", fontSize: "13px" }}>
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPanel;