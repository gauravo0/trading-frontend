import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

function Chart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("🚀 Chart mounted with:", symbol);

    if (!symbol) return;
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
  width: 800,
  height: 400,
  layout: {
    background: { color: "#0f172a" },
    textColor: "#ffffff",
  },
  grid: {
    vertLines: { color: "#334155" },
    horzLines: { color: "#334155" },
  },
});

    const candleSeries = (chart as any).addCandlestickSeries();

    const API = import.meta.env.VITE_API_BASE_URL;

    console.log("📡 Fetching history for:", symbol);

    fetch(`${API}/api/stocks/history?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 History API:", data);

        if (!data || !Array.isArray(data)) return;
        if (data.length === 0) return;

        const formattedData = data
  .slice() // copy
  .reverse() // ✅ IMPORTANT FIX
  .map((d: any) => ({
    time: d.datetime,
    open: parseFloat(d.open),
    high: parseFloat(d.high),
    low: parseFloat(d.low),
    close: parseFloat(d.close),
  }));

        candleSeries.setData(formattedData);
      })
      .catch((err) => {
        console.error("❌ Chart error:", err);
      });

    return () => {
      chart.remove();
    };
  }, [symbol]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "400px",
        marginTop: "20px",
      }}
    />
  );
}

export default Chart;