import {
  MdOutlineCheckCircle,
  MdOutlineAccessTimeFilled,
  MdNotificationsNone,
} from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";

const VehicleChecksSection = () => {
  const cardsData = [
    {
      title: "Daily Vehicle Checks",
      description:
        "Complete comprehensive vehicle inspections with our 8-point checklist system. Track everything from tyres to brakes.",
      listItems: [
        "8-point inspection checklist ",
        "Council approved format ",
        "Digitally stored",
      ],
      colors: {
        bg: "bg-orange-50",
        border: "border-blue-600/10",
        iconBg: "bg-blue-600",
      },
      icon: <MdOutlineCheckCircle className="h-6 w-6 text-white" />,
    },
    {
      title: "Document Storage",
      description:
        "Securely store and self-manage all your important  documents with automatic expiry reminders.",
      listItems: [
        "Insurance, MOT & licence uploads plus more",
        "Expiry date tracking ",
        "Automated reminders ",
      ],
      colors: {
        bg: "bg-green-400/20",
        border: "border-green-100",
        iconBg: "bg-green-600",
      },
      icon: <IoDocumentTextOutline className="h-6 w-6 text-white" />,
    },
    {
      title: "Complete History",
      description:
        "Access to every vehicle check you’ve completed. Your history is securely stored and ready whenever you need it- perfect if the council asks for proof.",
      listItems: [
        "Unlimited history access",
        "CSV & PDF exports",
        "Advanced search & filters",
      ],
      colors: {
        bg: "bg-violet-500/20",
        border: "border-green-100",
        iconBg: "bg-violet-500",
      },
      icon: <MdOutlineAccessTimeFilled className="h-6 w-6 text-white" />,
    },
    {
      title: "Smart Reminders",
      description:
        "Never miss important deadlines with automated email reminders before your documents expire",
      listItems: [
        "90 & 30 day alerts",
        "Custom notifications",
        "Email & SMS options",
      ],
      colors: {
        bg: "bg-red-700/20",
        border: "border-green-100",
        iconBg: "bg-red-700",
      },
      icon: <MdNotificationsNone className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <div
      id="features"
      className="flex w-full flex-col items-center justify-center gap-6 bg-neutral-600/5 px-4 py-10 font-['Roboto'] sm:gap-4 sm:px-12 sm:py-16 md:gap-10 md:px-14 md:py-24 lg:px-20"
    >
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-semibold text-neutral-800 sm:text-4xl md:text-5xl">
          Everything you need for compliant daily checks
        </h1>
        <p className="text-sm font-normal text-neutral-600 sm:text-base">
          Daily Checks, Document Storage, and Smart Alerts{" "}
        </p>
      </div>
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-5 md:flex-row md:flex-wrap md:justify-center lg:flex-nowrap">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className={`flex h-[400px] w-full max-w-sm flex-shrink-0 flex-col items-start justify-start gap-5 rounded-lg border p-5 sm:w-80 lg:w-72 ${card.colors.bg} ${card.colors.border}`}
          >
            <div
              className={`flex items-center justify-center rounded p-2.5 ${card.colors.iconBg}`}
            >
              {card.icon}
            </div>
            <h3 className="text-xl font-[600] text-neutral-800">
              {card.title}
            </h3>
            <p className="text-base leading-7 font-normal text-neutral-600">
              {card.description}
            </p>
            <div className="flex w-full flex-col items-start justify-start gap-5">
              <div className="flex w-full flex-col items-start justify-start gap-2 pb-5">
                {card.listItems.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="inline-flex w-full items-center gap-1"
                  >
                    <div className="flex h-8 w-8 items-center justify-center">
                      <AiOutlineCheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="font-norma text-base text-neutral-500">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleChecksSection;
