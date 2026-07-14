import "./CalendarLegend.css";

const LEGEND_ITEMS = [
  { label: "Available", status: "available" },
  { label: "Pending", status: "pending" },
  { label: "Accepted", status: "accepted" },
  { label: "Completed", status: "completed" },
  { label: "Cancelled", status: "cancelled" },
  { label: "Declined", status: "declined" },
];

function CalendarLegend() {
  return (
    <div className="calendar-legend" aria-label="Calendar event legend">
      {LEGEND_ITEMS.map((item) => (
        <div className="calendar-legend__item" key={item.status}>
          <span
            className={`calendar-legend__swatch calendar-legend__swatch--${item.status}`}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default CalendarLegend;