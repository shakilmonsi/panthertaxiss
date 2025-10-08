import { useEffect, useState } from "react";
import { useAuth } from "../../../../featured/auth/AuthContext";
import { postData, getData } from "../../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// localStorage ইউটিলিটি ফাংশন
const getStoredVehicleInfo = (userId) => {
  if (typeof window !== "undefined" && userId) {
    const stored = localStorage.getItem(`vehicleInfo_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const saveVehicleInfo = (userId, info) => {
  if (typeof window !== "undefined" && userId) {
    localStorage.setItem(`vehicleInfo_${userId}`, JSON.stringify(info));
  }
};

// ✅ Checklist state এর জন্য নতুন localStorage ইউটিলিটি ফাংশন
const getStoredChecklistState = (userId) => {
  if (typeof window !== "undefined" && userId) {
    const stored = localStorage.getItem(`checklistState_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const saveChecklistState = (userId, faulty, correct) => {
  if (typeof window !== "undefined" && userId) {
    localStorage.setItem(
      `checklistState_${userId}`,
      JSON.stringify({ checkedFaulty: faulty, checkedCorrect: correct }),
    );
  }
};
// ------------------------------------

export const User = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkedFaulty, setCheckedFaulty] = useState({});
  const [checkedCorrect, setCheckedCorrect] = useState({});
  const [checklistItems, setChecklistItems] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    completedBy: "",
    date: "",
    time: "",
    vehicleRegNo: "",
    plateNo: "",
    driverBadgeNo: "",
    mileage: "",
    notes: "",
  });

  const canAccessServices = user?.canAccessServices;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const getField = (name) => headerFields.find((f) => f.name === name);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (
        user?.id &&
        ["vehicleRegNo", "plateNo", "driverBadgeNo", "mileage"].includes(name)
      ) {
        saveVehicleInfo(user.id, {
          vehicleRegNo: newFormData.vehicleRegNo,
          plateNo: newFormData.plateNo,
          driverBadgeNo: newFormData.driverBadgeNo,
          mileage: newFormData.mileage,
        });
      }
      return newFormData;
    });
  };

  // --- Data Fetching and Initialization ---
  useEffect(() => {
    const fetchFormData = async () => {
      if (!canAccessServices && !isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getData("checklist-items");

        // Robust Data Extraction Logic
        const apiData = response?.data;
        let fetchedChecklist = [];

        if (Array.isArray(response)) {
          fetchedChecklist = response;
        } else if (Array.isArray(apiData?.checklistItems)) {
          fetchedChecklist = apiData.checklistItems;
        } else if (Array.isArray(apiData)) {
          fetchedChecklist = apiData;
        }

        const fetchedHeaderFields =
          apiData?.headerFields || response?.headerFields || [];
        const fetchedFormInfo = apiData?.formInfo || response?.formInfo || {};

        setChecklistItems(fetchedChecklist);
        setHeaderFields(fetchedHeaderFields);
        setFormInfo(fetchedFormInfo);

        // localStorage থেকে গাড়ির তথ্য এবং checklist state সেট করুন
        const storedInfo = user ? getStoredVehicleInfo(user.id) : null;
        // ✅ Checklist state লোড করুন
        const storedChecklistState = user
          ? getStoredChecklistState(user.id)
          : null;

        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const formattedTime = now.toTimeString().split(" ")[0].substring(0, 5);

        setFormData((prev) => ({
          ...prev,
          completedBy: user?.name || "",
          date: formattedDate,
          time: formattedTime,
          vehicleRegNo: storedInfo?.vehicleRegNo || "",
          plateNo: storedInfo?.plateNo || "",
          driverBadgeNo: storedInfo?.driverBadgeNo || "",
          mileage: storedInfo?.mileage || "",
          notes: "", // Notes should probably not be persisted
        }));

        // ✅ Checklist state সেট করুন
        if (storedChecklistState) {
          setCheckedFaulty(storedChecklistState.checkedFaulty || {});
          setCheckedCorrect(storedChecklistState.checkedCorrect || {});
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setChecklistItems([]);
        setHeaderFields([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [user, canAccessServices, isAdmin]);

  // --- Checkbox Handlers (Ensuring mutual exclusion) ---
  const toggleFaulty = (id) => {
    setCheckedFaulty((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      setCheckedCorrect((prevCorrect) => {
        const newCorrectState = { ...prevCorrect, [id]: false };
        // ✅ localStorage এ সেভ করুন
        if (user?.id) {
          saveChecklistState(user.id, newState, newCorrectState);
        }
        return newCorrectState;
      });
      return newState;
    });
  };

  const toggleCorrect = (id) => {
    setCheckedCorrect((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      setCheckedFaulty((prevFaulty) => {
        const newFaultyState = { ...prevFaulty, [id]: false };
        // ✅ localStorage এ সেভ করুন
        if (user?.id) {
          saveChecklistState(user.id, newFaultyState, newState);
        }
        return newFaultyState;
      });
      return newState;
    });
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canAccessServices && !isAdmin) {
      toast.error("Subscription required to submit forms.");
      return;
    }

    const allItemsChecked = checklistItems.every(
      (item) => checkedFaulty[item.id] || checkedCorrect[item.id],
    );

    if (!allItemsChecked) {
      toast.error(
        "Please mark every item as either Faulty or Correct before submitting.",
      );
      return;
    }

    const hasConflictingMarks = checklistItems.some(
      (item) => checkedFaulty[item.id] && checkedCorrect[item.id],
    );

    if (hasConflictingMarks) {
      toast.error(
        "Some items are marked as both Faulty and Correct. Please check your selections.",
      );
      return;
    }

    const vehicleInfo = {
      vehicleRegNo: formData.vehicleRegNo,
      plateNo: formData.plateNo,
      driverBadgeNo: formData.driverBadgeNo,
      mileage: formData.mileage,
    };

    if (user?.id) {
      saveVehicleInfo(user.id, vehicleInfo);
    }

    const mileageValue = formData.mileage;
    const mileage =
      mileageValue && !isNaN(mileageValue) ? Number(mileageValue) : 0;

    const itemResponses = checklistItems
      .map((item) => {
        if (checkedCorrect[item.id]) {
          return {
            checklistItemId: item.id,
            status: "CORRECT",
          };
        }
        if (checkedFaulty[item.id]) {
          return {
            checklistItemId: item.id,
            status: "FAULTY",
          };
        }
        return null;
      })
      .filter(Boolean);

    const payload = {
      vehicleRegNo: formData.vehicleRegNo,
      mileage: mileage,
      badgeNo: formData.driverBadgeNo,
      plateNo: formData.plateNo,
      notes: formData.notes || null,
      status: "completed",
      details: "daily check completed successfully",
      completedById: user?.id,
      itemResponses,
    };

    console.log("--- 🚀 Submitting Payload to API (Endpoint: /checks) 🚀 ---");
    console.log(payload);
    console.log("----------------------------------------------------------");

    try {
      await postData("checks", payload);
      toast.success("Form submitted successfully!");

      // setCheckedFaulty({});
      // setCheckedCorrect({});
      // if (user?.id) {
      //   localStorage.removeItem(`checklistState_${user.id}`);
      // }

      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toTimeString().split(" ")[0].substring(0, 5);

      setFormData((prev) => ({
        ...prev,
        date: formattedDate,
        time: formattedTime,
        notes: "",
      }));
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(
        "Form submission failed. Please check the console for details.",
      );
    }
  };

  // --- Conditional Rendering ---
  if (!canAccessServices && !isAdmin && !loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="mb-4 text-3xl font-bold text-red-600">
          Access Denied: Subscription Required
        </h2>
        <p className="mb-6 text-lg text-gray-700">
          Please subscribe to continue accessing the Vehicle Daily Check Form.
        </p>
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-blue-600 px-8 py-3 text-xl font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-blue-700"
        >
          View Subscription Plans
        </button>
      </div>
    );
  }

  if (loading) {
    return <div>Loading checklist...</div>;
  }

  // --- Main Form Rendering (JSX) ---
  return (
    <div className="mt-[65px] lg:mt-0">
      <form onSubmit={handleSubmit}>
        <div className="min-h-screen w-full bg-white p-6 font-['Roboto'] md:p-8 lg:p-10">
          {/* --- FORM HEADER (Inputs for Vehicle Reg No, Mileage, etc.) --- */}
          <div className="rounded-md border border-gray-300 p-6 shadow-sm">
            <h1 className="text-lg font-bold text-[#212121] sm:text-xl md:text-2xl">
              {formInfo.title ||
                "APPENDIX J – ROUTINE DAILY VEHICLE CONDITION CHECK"}
            </h1>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              {formInfo.subtitle ||
                "South Cambridgeshire District Council Daily Private Hire/Taxi Visual Inspection for All Vehicles"}
            </p>
            <div className="mt-2 space-y-4 text-sm text-gray-800 sm:mt-3 md:mt-4">
              {headerFields.map((field) => {
                const customLayoutFields = [
                  "date",
                  "time",
                  "vehicleRegNo",
                  "plateNo",
                  "driverBadgeNo",
                  "mileage",
                ];

                if (!customLayoutFields.includes(field.name)) {
                  return (
                    <p
                      key={field.name}
                      className="flex w-full flex-wrap items-center text-base font-normal text-[#555555]"
                    >
                      {field.label}{" "}
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        className="ml-2 flex-1 border-b border-dotted border-gray-600 bg-transparent outline-none"
                      />
                    </p>
                  );
                }
                return null;
              })}

              {/* Date & Time */}
              <div className="flex w-full flex-col gap-y-3 text-base font-normal text-[#555555] sm:flex-row sm:items-center sm:gap-x-6">
                <div className="flex items-center sm:flex-[2]">
                  <span className="whitespace-nowrap">
                    {getField("date")?.label || "Date"}
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required={getField("date")?.required || false}
                    className="ml-2 w-full border-b border-dotted border-gray-600 bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center sm:flex-[1]">
                  <span className="whitespace-nowrap">
                    {getField("time")?.label || "Time"}
                  </span>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required={getField("time")?.required || false}
                    className="ml-2 w-full border-b border-dotted border-gray-600 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Vehicle Reg No & Plate No */}
              <div className="flex w-full flex-col gap-y-3 text-base font-normal text-[#555555] sm:flex-row sm:items-center sm:gap-x-6">
                <div className="flex items-center sm:flex-[2]">
                  <span className="whitespace-nowrap">
                    {getField("vehicleRegNo")?.label || "Vehicle Reg No"}
                  </span>
                  <input
                    type="text"
                    name="vehicleRegNo"
                    value={formData.vehicleRegNo}
                    onChange={handleInputChange}
                    required={getField("vehicleRegNo")?.required || false}
                    className="ml-2 w-full border-b border-dotted border-gray-600 bg-transparent outline-none"
                    placeholder={getField("vehicleRegNo")?.placeholder || ""}
                  />
                </div>
                <div className="flex items-center sm:flex-[1]">
                  <span className="whitespace-nowrap">
                    {getField("plateNo")?.label || "Plate No"}
                  </span>
                  <input
                    type="text"
                    name="plateNo"
                    value={formData.plateNo}
                    onChange={handleInputChange}
                    required={getField("plateNo")?.required || false}
                    className="ml-2 w-full border-b border-dotted border-gray-600 bg-transparent outline-none"
                    placeholder={getField("plateNo")?.placeholder || ""}
                  />
                </div>
              </div>

              {/* Driver Badge No & Mileage */}
              <div className="flex w-full flex-col gap-y-3 text-base font-normal text-[#555555] sm:flex-row sm:items-center sm:gap-x-6">
                <div className="flex items-center sm:flex-[2]">
                  <span className="whitespace-nowrap">
                    {getField("driverBadgeNo")?.label || "Driver Badge No"}
                  </span>
                  <input
                    type="text"
                    name="driverBadgeNo"
                    value={formData.driverBadgeNo}
                    onChange={handleInputChange}
                    required={getField("driverBadgeNo")?.required || false}
                    className="ml-2 w-full border-b border-dotted border-gray-600 bg-transparent outline-none"
                    placeholder={getField("driverBadgeNo")?.placeholder || ""}
                  />
                </div>
                <div className="flex items-center sm:flex-[1]">
                  <span className="whitespace-nowrap">
                    {getField("mileage")?.label || "Mileage"}
                  </span>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    required={getField("mileage")?.required || false}
                    className="ml-2 w-full border-b border-dotted border-gray-600 bg-transparent outline-none"
                    placeholder={getField("mileage")?.placeholder || ""}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Checklist Table (Data Display) --- */}
          <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative mt-8 overflow-x-scroll rounded-md border border-[#B9B9B9] text-black shadow-sm md:mt-14">
            <style>{`
 .overflow-x-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
 .overflow-x-scroll::-webkit-scrollbar { height: 8px; }
 .overflow-x-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
 .overflow-x-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
 .overflow-x-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
 `}</style>

            <table className="w-full min-w-[600px] table-fixed border-collapse border border-gray-300 sm:min-w-[700px] md:min-w-[800px] md:min-w-[900px] xl:min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left font-medium">
                  <th className="w-[150px] border border-gray-300 px-2 py-2 sm:w-[200px] sm:px-3 md:w-[250px] md:px-4 lg:w-1/3">
                    Area
                  </th>
                  <th className="w-[250px] border border-gray-300 px-2 py-2 sm:w-[300px] sm:px-3 md:w-[350px] md:px-4 lg:w-1/2">
                    Requirement
                  </th>
                  <th className="w-[80px] border border-gray-300 px-2 py-2 text-center sm:px-3 md:w-[80px] md:px-4">
                    Faulty
                  </th>
                  <th className="w-[80px] border border-gray-300 px-2 py-2 text-center sm:px-3 md:w-[80px] md:px-4">
                    Correct
                  </th>
                </tr>
              </thead>

              <tbody>
                {checklistItems.map((item, idx) => {
                  const isChecked =
                    checkedFaulty[item.id] || checkedCorrect[item.id];

                  return (
                    <tr
                      key={item.id}
                      className={` ${idx % 2 !== 0 ? "bg-[#F7F6F666]" : "bg-white"} ${!isChecked ? "border-l-4 border-l-red-300" : ""} `}
                    >
                      <td className="border border-gray-300 px-2 py-2 align-top text-[12px] font-normal text-[#555555] sm:px-3 sm:text-[13px] md:px-4 md:text-[14px]">
                        {item.area}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 align-top text-[12px] font-normal text-[#555555] sm:px-3 sm:text-[13px] md:px-4 md:text-[14px]">
                        {item.requirement
                          .split(/\r?\n/)
                          .map(
                            (req, i) =>
                              req.trim() && <p key={i}> {req.trim()}</p>,
                          )}
                      </td>

                      {/* Faulty Checkbox */}
                      <td className="border border-gray-300 px-2 py-2 text-center font-normal text-[#555555] sm:px-3 md:px-4">
                        <div
                          onClick={() => toggleFaulty(item.id)}
                          className={`mx-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded border sm:h-6 sm:w-6 ${
                            checkedFaulty[item.id]
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-gray-400 text-transparent"
                          }`}
                        >
                          ✓
                        </div>
                      </td>

                      {/* Correct Checkbox */}
                      <td className="border border-gray-300 px-2 py-2 text-center font-normal text-[#555555] sm:px-3 md:px-4">
                        <div
                          onClick={() => toggleCorrect(item.id)}
                          className={`mx-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded border sm:h-6 sm:w-6 ${
                            checkedCorrect[item.id]
                              ? "border-green-600 bg-green-50 text-green-600"
                              : "border-gray-400 text-transparent"
                          }`}
                        >
                          ✓
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* --- NOTES & SUBMIT --- */}
          <div className="mt-7 md:mt-10">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notes"
              className="h-32 w-full resize-none rounded-md border border-gray-300 p-4 text-gray-700 placeholder-gray-400 focus:border-[#d6d1d1] focus:ring-2 focus:ring-[#d6d1d1] focus:outline-none"
            ></textarea>
          </div>

          <div className="my-3 flex justify-end md:my-6">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md hover:bg-blue-700"
            >
              Submit Here
            </button>
          </div>

          <p className="mb-5 max-w-[900px] text-base font-normal text-[#555555] md:mb-8">
            confirm that the vehicle has been visually inspected. If no faults
            have been identified and reported, I confirm the vehicle is found to
            be satisfactory at the time of check. If any faults have been
            identified and reported within this form, I confirm the faults will
            be rectified prior to the vehicle conducting any licensed work.
          </p>

          <h3 className="max-w-[800px] text-base font-semibold text-[#212121]">
            Warning: Drivers found to be using a defective vehicle will be in
            breach of their driver licence condition and could be at the risk of
            sanction, especially if the condition of the vehicle is such that it
            is obvious no routine checks have occurred over a number of days.
          </h3>
        </div>
      </form>
    </div>
  );
};
