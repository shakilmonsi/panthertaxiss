const SummaryCard = ({ icon, value, title, change, bgColor, textColor }) => {
  return (
    <div
      className={`flex w-full flex-col gap-3 rounded-xl px-5 py-6 ${bgColor} shadow-sm`}
    >
      {/* Icon */}
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white`}
        >
          {icon}
        </div>
      </div>
      {/* Value */}
      <h3 className={`${textColor} text-3xl font-bold`}>{value}</h3>
      {/* Title */}
      <h5 className={`${textColor} "text-sm font-medium"`}>{title}</h5>
      {/* Change */}
      <p className={`${textColor} text-xs`}>{change}</p>
    </div>
  );
};

export default SummaryCard;
