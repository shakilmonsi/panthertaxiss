import { Search } from "lucide-react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Using react-icons for a professional search icon

export default function VehicleInspectionForm() {
  const [checkboxStates, setCheckboxStates] = useState({});

  const handleCheckboxChange = (id, type) => {
    // This allows only one checkbox per row to be checked at a time
    setCheckboxStates((prev) => {
      const newState = { ...prev };
      // Uncheck the other option in the same row
      if (type === "correct") {
        delete newState[`${id}-faulty`];
      } else {
        delete newState[`${id}-correct`];
      }
      // Toggle the selected checkbox
      newState[`${id}-${type}`] = !prev[`${id}-${type}`];
      return newState;
    });
  };

  const inspectionItems = [
    {
      id: "windscreen",
      area: "Windscreen, Windows and Mirrors",
      requirements: [
        "Mirrors are fitted and properly aligned and secure",
        "All windows are clean and not obscured/damaged",
        "All windows operational",
      ],
    },
    {
      id: "washers",
      area: "Washers and Wipers",
      requirements: [
        "Wipers move when switched on",
        "Wiper blade must clear the windscreen",
        "Washers are operational",
        "Washer fluid is topped up",
      ],
      alternate: true,
    },
    {
      id: "lights",
      area: "Lights",
      requirements: [
        "All lights and indicators work correctly",
        "All senses are present, clean and in good condition and are the correct colour",
        "Stop lamps come on when then service brake is applied and goes out when released",
      ],
    },
    {
      id: "seats",
      area: "Seats and Seatbelts",
      requirements: [
        "All seats are secure",
        "All seatbelts must operate correctly and must be free from damage",
      ],
      alternate: true,
    },
    {
      id: "brakes",
      area: "Brakes",
      requirements: [
        "Foot/service brake works correctly",
        "Hand/parking brake works correctly",
      ],
    },
    {
      id: "bodywork",
      area: "Bodywork and Doors",
      requirements: [
        "All doors must shut securely and stay open when required",
        "No sharp edges or excess corrosion",
        "No loose bodywork",
      ],
    },
    {
      id: "tyres",
      area: "Tyres and Wheels",
      requirements: [
        "Minimum tread depth of 1.6mm",
        "Correctly inflated",
        "No visible damage",
      ],
    },
    {
      id: "plates",
      area: "Licence Plates and other identifiers",
      requirements: [
        "All plates and mandatory signs displayed, clean and secure",
        "Roof Light is safe and operational (if fitted)",
        "Taxi Meter (if fitted) seal is intact and correct",
        "Fare Tariff (if required) displayed",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-8">
      <div className="mx-auto max-w-full bg-white">
        {/* Header */}
        <div className="flex w-full items-center justify-between border-b border-stone-300 px-3 py-3 sm:px-4 md:px-6">
          <div className="w-full max-w-lg">
            <div className="flex w-full items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-1.5">
              <Search className="h-4 w-4 flex-shrink-0 text-neutral-600 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              <input
                type="text"
                className="w-full border-none bg-transparent text-xs text-neutral-600 placeholder-neutral-600 outline-none sm:text-sm md:text-base"
                placeholder="Search users by name or email."
              />
            </div>
          </div>
        </div>

        {/* Form Header */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 rounded-lg border border-gray-300 bg-white p-4 sm:mb-8 sm:p-6">
            <div className="space-y-3">
              <h1 className="text-lg leading-relaxed font-bold text-gray-800 sm:text-xl lg:text-2xl">
                APPENDIX J – ROUTINE DAILY VEHICLE CONDITION CHECK
              </h1>
              <p className="text-sm text-gray-600 sm:text-base">
                South Cambridgeshire District Council Daily Private Hire/Taxi
                Visual Inspection for All Vehicles
              </p>
              <div className="space-y-2 text-sm text-gray-600 sm:text-base">
                <div>
                  Completed by ……………………………………………………………………………………………………………
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <span>
                    Date
                    ………………………………………….............................................................................
                  </span>
                  <span>
                    Time…………………………………....................................
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <span>
                    Vehicle Reg No
                    ………………………………………….............................................................
                  </span>
                  <span>
                    Plate No ………………………………….............................
                  </span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <span>
                    Driver Badge
                    No…………………………………………..............................................................
                  </span>
                  <span>
                    Mileage...............................…………………………………
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Table */}
          <div className="mb-6 overflow-hidden rounded-lg border border-zinc-400 bg-white sm:mb-8">
            {/* Table Header */}
            <div className="bg-opacity-5 grid grid-cols-12 border-b border-zinc-400 bg-[#B9B9B9] lg:grid-cols-16">
              <div className="col-span-12 border-r border-zinc-400 px-2 py-2 sm:col-span-5 sm:px-3 sm:py-2.5 lg:col-span-6">
                <div className="text-xs font-[700] text-black">Area</div>
              </div>
              <div className="col-span-12 border-r border-zinc-400 px-2 py-2 sm:col-span-5 sm:px-3 sm:py-2.5 lg:col-span-7">
                <div className="text-xs font-[700] text-black">
                  <span> Requirement</span>
                </div>
              </div>
              <div className="lg:col-span-1.5 col-span-6 border-r border-zinc-400 px-1 py-2 sm:col-span-1 sm:px-3 sm:py-2.5">
                <div className="text-center text-xs font-[700] text-black">
                  Faulty
                </div>
              </div>
              <div className="lg:col-span-1.5 col-span-6 px-1 py-2 sm:col-span-1 sm:px-3 sm:py-2.5">
                <div className="text-center text-xs font-[700] text-black">
                  Correct
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {inspectionItems.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-12 border-b border-zinc-400 lg:grid-cols-16 ${
                  item.alternate ? "bg-opacity-40 bg-neutral-100" : ""
                }`}
              >
                <div className="col-span-12 border-r border-zinc-400 px-2 py-2 sm:col-span-5 sm:px-3 sm:py-2.5 lg:col-span-6">
                  <div>
                    <h6 className="text-xs font-bold text-gray-600">
                      {" "}
                      {item.area}
                    </h6>
                  </div>
                </div>
                <div className="col-span-12 border-r border-zinc-400 px-2 py-2 sm:col-span-5 sm:px-3 sm:py-2.5 lg:col-span-7">
                  <div className="space-y-1 text-xs text-gray-600">
                    {item.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Checkbox for Faulty */}
                <div className="lg:col-span-1.5 col-span-6 flex items-center justify-center border-r border-zinc-400 px-1 py-2 sm:col-span-1 sm:px-3 sm:py-2.5">
                  <button
                    onClick={() => handleCheckboxChange(item.id, "faulty")}
                    className={`flex h-6 w-6 items-center justify-center rounded-sm border border-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  >
                    {/* CHANGE: Replaced the div with a checkmark (✓) when selected */}
                    {checkboxStates[`${item.id}-faulty`] && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-green-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9.5 14.25a.75.75 0 01-1.154.114l-6.75-7.5a.75.75 0 011.06-1.06l6.219 6.918 8.972-13.45a.75.75 0 011.04-.208z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Checkbox for Correct */}
                <div className="lg:col-span-1.5 col-span-6 flex items-center justify-center px-1 py-2 sm:col-span-1 sm:px-3 sm:py-2.5">
                  <button
                    onClick={() => handleCheckboxChange(item.id, "correct")}
                    className={`flex h-6 w-6 items-center justify-center rounded-sm border border-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  >
                    {/* CHANGE: Replaced the div with a checkmark (✓) when selected */}
                    {checkboxStates[`${item.id}-correct`] && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-green-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9.5 14.25a.75.75 0 01-1.154.114l-6.75-7.5a.75.75 0 011.06-1.06l6.219 6.918 8.972-13.45a.75.75 0 011.04-.208z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          {/* CHANGE: Removed the border and padding from the notes section */}
          <div className="mb-6 overflow-hidden rounded-lg bg-white sm:mb-8">
            {/* Text area for notes */}
            <div className="h-20 p-3 sm:h-24">
              <textarea
                className="h-full w-full resize-none rounded-md border-2 border-gray-300 p-2 text-xs font-[600] text-black outline-none sm:text-sm"
                placeholder="Add any notes here..."
              ></textarea>
            </div>
          </div>

          {/* Footer Text */}
          <div className="space-y-4 text-sm sm:text-base">
            <p className="leading-relaxed text-gray-600">
              confirm that the vehicle has been visually inspected. If no faults
              have been identified and reported, I confirm the vehicle is found
              to be satisfactory at the time of check. If any faults have been
              identified and reported within this form, I confirm the faults
              will be rectified prior to the vehicle conducting any licensed
              work.
            </p>
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <p className="leading-relaxed font-semibold text-gray-800">
                Warning: Drivers found to be using a defective vehicle will be
                in breach of their driver licence condition and could be at the
                risk of sanction, especially if the condition of the vehicle is
                such that it is obvious no routine checks have occurred over a
                number of days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
