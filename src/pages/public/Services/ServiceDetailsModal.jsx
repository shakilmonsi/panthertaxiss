import React, { useState } from "react";

const ServiceDetailsModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white p-6 shadow-lg md:max-w-lg lg:max-w-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-3xl font-bold text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center">
          <img
            className="mb-4 h-48 w-full rounded-lg object-cover"
            src={service.img}
            alt={service.title}
          />
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">
            {service.title}
          </h2>
          <p className="text-md mb-4 text-center text-gray-600">
            {service.subtitle}
          </p>

          <div className="w-full text-gray-700">
            <h3 className="mb-2 text-xl font-semibold">Services Included:</h3>
            <ul className="mb-4 list-inside list-disc space-y-1">
              {service.details.mixingServices.map((serviceItem, index) => (
                <li key={index} className="text-lg">
                  {serviceItem}
                </li>
              ))}
            </ul>

            <p className="mb-2 text-lg">
              <span className="font-semibold">Revisions:</span>{" "}
              {service.details.revisions}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email Files To:</span>{" "}
              <a
                href={`mailto:${service.details.emailFilesTo}`}
                className="text-blue-600 hover:underline"
              >
                {service.details.emailFilesTo}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const musicCartData = [
    {
      id: 1,
      title: "Music Production",
      subtitle: "From Idea to Final Track",
      img: "/services/cart1.jpg",
      details: {
        mixingServices: [
          "Full Track Production (Custom Beat + Vocals) = $500",
          "Instrumental Beat Creation = $200",
          "Vocal Recording Guidance = $100",
        ],
        revisions: "Up to 5",
        emailFilesTo: "gigzbeatz@gmail.com",
      },
    },
    {
      id: 2,
      title: "Vocal Mixing",
      subtitle: "Get Your Vocals to Stand Out",
      img: "/services/cart2.jpg",
      details: {
        mixingServices: [
          "Vocal Tuning & Alignment = $100",
          "Lead & Backing Vocal Mixing = $120",
          "Vocal FX (Reverb, Delay, etc.) = $80",
        ],
        revisions: "Up to 3",
        emailFilesTo: "beatzvampire24@gmail.com",
      },
    },
    {
      id: 3,
      title: "Custom Beats",
      subtitle: "Unique Beats Tailored to You",
      img: "/services/cart3.jpg",
      details: {
        mixingServices: [
          "Trap/Hip-Hop Custom Beat = $200",
          "Afrobeat Custom Beat = $220",
          "RnB/Soul Custom Beat = $250",
        ],
        revisions: "Up to 4",
        emailFilesTo: "gigzbeatz@gmail.com",
      },
    },
    {
      id: 4,
      title: "Beat Licensing",
      subtitle: "Commercial and Exclusive Rights",
      img: "/services/cart4.jpg",
      details: {
        mixingServices: [
          "Basic License (MP3) = $50",
          "Premium License (WAV) = $100",
          "Exclusive Rights = $500",
        ],
        revisions: "No revisions",
        emailFilesTo: "beatzvampire24@gmail.com",
      },
    },
    {
      id: 5,
      title: "Sound Design",
      subtitle: "Create Your Own Sound Identity",
      img: "/services/cart5.jpg",
      details: {
        mixingServices: [
          "Custom Sound FX (One-shot/Loops) = $150",
          "Sound Kit Creation = $200",
          "Ambient/Textural Layers = $100",
        ],
        revisions: "Up to 2",
        emailFilesTo: "gigzbeatz@gmail.com",
      },
    },
    {
      id: 6,
      title: "Podcast Mixing",
      subtitle: "Professional Podcast Audio Polish",
      img: "/services/cart6.jpg",
      details: {
        mixingServices: [
          "Noise Reduction & Voice Clarity = $75",
          "Multi-Host Mixing = $100",
          "Intro/Outro Music Integration = $50",
        ],
        revisions: "Up to 3",
        emailFilesTo: "beatzvampire24@gmail.com",
      },
    },
  ];

  const handleDetailsClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div
      style={{
        background:
          "var(--dark-purple-color, linear-gradient(180deg, #050306 0%, #5D006D 100%))",
      }}
      className="flex min-h-screen justify-center px-4 py-10 sm:px-6 md:px-8 md:py-20 lg:px-10"
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3 md:gap-12 lg:gap-14">
        {musicCartData.map((item) => (
          <div
            key={item.id}
            className="inline-flex flex-col items-start justify-start gap-5 overflow-hidden rounded-lg bg-white/10 pb-5 shadow-lg md:w-72"
          >
            {/* Image Section */}
            <img
              className="h-[237px] self-stretch rounded-t-lg object-cover"
              src={item.img}
              alt={item.title}
            />

            {/* Content Section */}
            <div className="flex flex-col items-center justify-start gap-3.5 self-stretch px-4">
              <div className="bg-gradient-to-b from-orange-100 to-yellow-300 bg-clip-text text-center font-['Poppins'] text-2xl font-[600] text-transparent capitalize">
                {item.title}
              </div>

              <div className="top-0 pb-1 text-center font-['Poppins'] text-sm font-[400] text-[#E0E0E0]">
                {item.subtitle}
              </div>
              <button
                onClick={() => handleDetailsClick(item)}
                className="inline-flex h-11 w-64 cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 p-2.5 transition-all duration-300 hover:from-orange-300 hover:to-yellow-600"
              >
                <span className="flex-1 text-center font-['Poppins'] text-lg font-[600] text-zinc-800 capitalize">
                  DETAILS
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
};

export default ServicesView;
