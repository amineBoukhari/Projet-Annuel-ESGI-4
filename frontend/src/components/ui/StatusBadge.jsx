export default function StatusBadge({ status }) {
  const styles = {
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    validated: "bg-blue-50 text-blue-700 border-blue-200",
    paid: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  const labels = {
    draft: "Brouillon",
    validated: "Validée",
    paid: "Payée",
    cancelled: "Annulée",
  };

  const badgeStyle = styles[status] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`text-[0.6875rem] font-medium px-2 py-0.5 rounded-sm border ${badgeStyle}`}
    >
      {labels[status] || status}
    </span>
  );
}
