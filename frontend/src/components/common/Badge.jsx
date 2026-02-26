export default function Badge({ label, color }) {
  return (
    <span
      className="badge"
      style={{ backgroundColor: color, color: '#fff' }}
    >
      {label}
    </span>
  );
}
