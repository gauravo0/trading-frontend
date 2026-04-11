type Props = {
  showEMA: boolean;
  setShowEMA: (v: boolean) => void;
  showRSI: boolean;
  setShowRSI: (v: boolean) => void;
  showVolume: boolean;
  setShowVolume: (v: boolean) => void;
};

function IndicatorPanel({
  showEMA,
  setShowEMA,
  showRSI,
  setShowRSI,
  showVolume,
  setShowVolume,
}: Props) {
  const btn = (active: boolean) => ({
    padding: "6px 10px",
    background: active ? "#22c55e" : "#334155",
    borderRadius: "6px",
    border: "none",
    color: "white",
    cursor: "pointer",
  });

  return (
    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      <button onClick={() => setShowEMA(!showEMA)} style={btn(showEMA)}>
        EMA
      </button>

      <button onClick={() => setShowRSI(!showRSI)} style={btn(showRSI)}>
        RSI
      </button>

      <button
        onClick={() => setShowVolume(!showVolume)}
        style={btn(showVolume)}
      >
        Volume
      </button>
    </div>
  );
}

export default IndicatorPanel;
