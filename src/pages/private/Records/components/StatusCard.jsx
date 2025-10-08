export const StatusCard = ({ stats }) => {
  return (
    <div className="grid gap-3 grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 xl:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md sm:p-5 lg:p-6"
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2 transition-all duration-200 group-hover:scale-105 ${stat.bgColor}`}
            >
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <div
                className={`text-[32px] font-[700] sm:text-3xl ${stat.textColor || "text-gray-900"}`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 sm:text-base">
                {stat.title}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
