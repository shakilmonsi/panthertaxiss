import { FaCheckCircle, FaPlay } from "react-icons/fa";
import "./heroSection.css";

// Reusable Button Component
const CustomButton = ({ text, type }) => {
  const baseStyles = "rounded-lg transition-colors duration-300 font-semibold";
  const primaryStyles = "bg-blue-600 text-white hover:bg-blue-700";
  const secondaryStyles =
    "text-blue-600 outline outline-1 outline-blue-600 hover:bg-blue-50";

  return (
<a href="#pricing">
      <button
     
      aria-label={text}
      className={`${baseStyles} ${
        type === "primary" ? primaryStyles : secondaryStyles
      } h-12 w-36 text-sm sm:h-12 sm:w-36 sm:text-sm lg:h-14 lg:w-40 lg:text-base`}
    >
      {text}
    </button>
    </a>
  );
};

const heroData = {
  mainTitle: "TaxiLog UK – Daily Vehicle Compliance",
  coloredTitle: "Made Simple",
  subtitle:
    "Everything you need for vehicle compliance at a touch of a button.",
  buttons: [
    { text: "Subscribe", type: "primary" },
    { text: "Free demo", type: "secondary" },
  ],
  features: ["7-day free trial", "No credit card required", "Cancel anytime"],
  videoPlaceholder: {
    src: "/image/hero-image2.png",
    alt: "Video Placeholder",
  },
};

const HeroSection = () => {
  return (
    <section
      className={`flex w-full flex-col items-center justify-center gap-20 px-4 pt-[45px] pb-[45px] sm:px-8 md:px-34 lg:px-24 lg:pt-[80px] lg:pb-[80px]`}
    >
      <div className="flex w-full max-w-7xl flex-col gap-10 pb-6 sm:gap-16 sm:px-[24px] sm:pb-0 lg:flex-row lg:items-start lg:justify-between">
        {/* Left Section (Text) */}
        <div className="order-2 flex flex-1 flex-col items-center justify-center gap-10 text-center lg:order-1 lg:items-start lg:text-left">
          {/* Heading */}
          <div className="flex w-full flex-col items-center justify-center gap-4 lg:items-start">
            <h1 className="pl-3 text-3xl leading-tight font-bold sm:text-5xl md:text-[48px]">
              <span className="text-neutral-800">{heroData.mainTitle}</span>{" "}
              <span className="text-blue-600">{heroData.coloredTitle}</span>
            </h1>
            <p className="text-base leading-7 font-normal text-neutral-600">
              {heroData.subtitle}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full items-center justify-center gap-3 sm:flex-row sm:gap-3 lg:justify-start lg:gap-4">
            {heroData.buttons.map((button, index) => (
              <CustomButton key={index} text={button.text} type={button.type} />
            ))}
          </div>

          {/* Features */}
          <div className="flex w-full items-center justify-center gap-1.5 sm:flex-row lg:justify-start">
            {heroData.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center px-2 py-1 sm:gap-1.5 sm:py-0"
              >
                <FaCheckCircle
                  className="h-3 w-3 text-green-600 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
                <span className="text-base font-normal text-[#555555] sm:text-sm lg:text-base">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section (Video) */}
        <div className="order-1 flex-1 lg:order-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-[31px] bg-gray-200 shadow-lg sm:w-[637px]">
            <img
              src={heroData.videoPlaceholder.src}
              alt={heroData.videoPlaceholder.alt}
              className="h-full w-full "
              loading="lazy"
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play video"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/40 outline outline-8 outline-white/20 backdrop-blur-sm">
                <FaPlay className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
