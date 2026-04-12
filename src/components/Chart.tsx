import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

function Chart({
  symbol,
  interval,
  showRSI,
  showEMA,
  showVolume,
}: {
  symbol: string;
  interval: string;
  showRSI: boolean;
  showEMA: boolean;
  showVolume: boolean;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const rsiRef = useRef<HTMLDivElement>(null);

  // ================= RSI CALC =================
  function calculateRSI(data: any[], period = 14) {
    let gains = 0;
    let losses = 0;
    const rsi = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;

      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;

      gains = (gains * (period - 1) + gain) / period;
      losses = (losses * (period - 1) + loss) / period;

      const rs = losses === 0 ? 100 : gains / losses;

      rsi.push({
        time: data[i].time,
        value: 100 - 100 / (1 + rs),
      });
    }

    return rsi;
  }

  useEffect(() => {
    if (!symbol || !chartRef.current) return;

    const container = chartRef.current;

    // ================= MAIN CHART =================
    const chart = createChart(container, {
      width: container.offsetWidth,
      height: 400,
      layout: {
        background: { color: "#020617" },
        textColor: "#e2e8f0",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      rightPriceScale: {
        borderColor: "#334155",
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
      },
    });

    const candleSeries = (chart as any).addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = (chart as any).addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.75, bottom: 0 },
    });

    const emaSeries = (chart as any).addLineSeries({
      color: "#facc15",
      lineWidth: 2,
    });

    // ================= RSI CHART =================
    let rsiChart: any = null;
    let rsiSeries: any = null;

    if (showRSI && rsiRef.current) {
      rsiChart = createChart(rsiRef.current, {
        width: rsiRef.current.offsetWidth,
        height: 180,
        layout: {
          background: { color: "#020617" },
          textColor: "#94a3b8",
        },
        grid: {
          vertLines: { color: "#1e293b" },
          horzLines: { color: "#1e293b" },
        },
      });

      rsiSeries = (rsiChart as any).addLineSeries({
        color: "#60a5fa",
        lineWidth: 2,
        priceLineVisible: false,
      });
    }

    const API = import.meta.env.VITE_API_BASE_URL;

    fetch(`${API}/api/stocks/history?symbol=${symbol}&interval=${interval}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;

        const formatted = data
          .slice()
          .reverse()
          .map((d: any) => ({
            time: Math.floor(new Date(d.datetime).getTime() / 1000),
            open: +d.open,
            high: +d.high,
            low: +d.low,
            close: +d.close,
            volume: +d.volume,
          }));

        // ===== CANDLES =====
        candleSeries.setData(formatted);

        // ===== VOLUME =====
        if (showVolume) {
          volumeSeries.setData(
            formatted.map((d) => ({
              time: d.time,
              value: d.volume,
              color: d.close > d.open ? "#22c55e" : "#ef4444",
            })),
          );
        } else {
          volumeSeries.setData([]);
        }

        // ===== EMA =====
        if (showEMA) {
          const multiplier = 2 / (20 + 1);
          let prev = formatted[0].close;

          const ema = formatted.map((d, i) => {
            if (i === 0) return { time: d.time, value: d.close };
            const val = (d.close - prev) * multiplier + prev;
            prev = val;
            return { time: d.time, value: val };
          });

          emaSeries.setData(ema);
        } else {
          emaSeries.setData([]);
        }

        // ===== RSI =====
        if (showRSI && rsiSeries) {
          const rsiData = calculateRSI(formatted);
          rsiSeries.setData(rsiData);

          rsiSeries.createPriceLine({ price: 70, color: "#ef4444" });
          rsiSeries.createPriceLine({ price: 30, color: "#22c55e" });
        }

        chart.timeScale().fitContent();
      });

    // ===== RESIZE =====
    const handleResize = () => {
      const width = container.offsetWidth;
      chart.applyOptions({ width });
      if (rsiChart) rsiChart.applyOptions({ width });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      if (rsiChart) rsiChart.remove();
    };
  }, [symbol, interval, showRSI, showEMA, showVolume]);

  return (
    <>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "400px",
          background: "#020617",
          borderRadius: "12px",
          padding: "8px",
          border: "1px solid #1e293b",
        }}
      />

      {showRSI && (
        <div style={{ marginTop: "10px" }}>
          <div ref={rsiRef} style={{ height: "180px" }} />
        </div>
      )}
    </>
  );
}

export default Chart;
