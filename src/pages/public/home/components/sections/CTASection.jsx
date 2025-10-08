import { FaCheckCircle } from "react-icons/fa";

const ctaData = {
  title: "Ready to Streamline Your Vehicle Inspections?",
  subtitle:
    "Join thousands of professionals who trust TaxiLog UK for their daily vehicle compliance needs.",
  buttons: [
    {
      text: "Start Free Trial",
      type: "primary",
    },
    {
      text: "Schedule Demo",
      type: "secondary",
    },
  ],
  features: ["7-day free trial", "No credit card required", "Cancel anytime"],
};

const CTASection = () => {
  const { title, subtitle, buttons, features } = ctaData;

  const buttonClasses = (type) =>
    `flex h-14 w-full items-center justify-center rounded-lg p-2.5 transition-colors duration-300 sm:w-40 ${
      type === "primary"
        ? "bg-white text-neutral-700 hover:bg-gray-100"
        : "text-white outline outline-1 outline-white hover:bg-white/10"
    }`;

  const featureItemClasses =
    "flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/40 px-1.5 py-2";

  return (
    <div className="flex font-['Roboto'] w-full flex-col items-center justify-center md:gap-12 sm:gap-4 gap-6 bg-[#1276F9] px-4 md:py-24 sm:py-16 py-10 text-center sm:px-12 md:px-16 lg:px-24">
      {/* Title and Subtitle */}
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-[Inter] font-bold text-white sm:text-3xl md:text-[48px]">
          {title}
        </h2>
        <p className="text-base text-white">{subtitle}</p>
      </div>

      {/* Buttons Container */}
      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        {buttons.map((button, index) => (
         <a href="#pricing" key={index} className={buttonClasses(button.type)}>
            <span className="text-base font-[600]">{button.text}</span>
          </a>
        ))}
      </div>

      {/* Feature List */}
      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 md:gap-8">
        {features.map((feature, index) => (
          <div key={index} className={featureItemClasses}>
            <FaCheckCircle className="h-4 w-4 text-white" />
            <span className="text-base text-white">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTASection;
