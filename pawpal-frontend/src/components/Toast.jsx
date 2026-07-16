function Toast({ message, type, onClose }) {
  if (!message) {
    return null;
  }

  const backgroundColor = type === "error" ? "#dc3545" : "#28a745";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: backgroundColor,
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: "12px",
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
