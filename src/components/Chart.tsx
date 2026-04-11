import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

function Chart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbol) return;
    if (!chartContainerRef.current) return;

    console.log("🚀 Chart mounted:", symbol);

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
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

    // ✅ THIS IS THE FIX
    const candleSeries = (chart as any).addCandlestickSeries();

    const API = import.meta.env.VITE_API_BASE_URL;

    fetch(`${API}/api/stocks/history?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 History:", data);

        if (!Array.isArray(data) || data.length === 0) return;

        const formattedData = data
          .slice()
          .reverse()
          .map((d: any) => ({
            time: d.datetime, // ✅ correct for your version
            open: parseFloat(d.open),
            high: parseFloat(d.high),
            low: parseFloat(d.low),
            close: parseFloat(d.close),
          }));

        candleSeries.setData(formattedData);
      })
      .catch((err) => console.error("❌ Chart error:", err));

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