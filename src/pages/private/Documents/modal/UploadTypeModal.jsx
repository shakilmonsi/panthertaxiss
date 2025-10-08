import { useEffect, useState } from "react";
import { postData } from "../../../../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UploadTypeModal = ({ closeModal }) => {
  const [textValue, setTextValue] = useState("");
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        const dataType = postData("document-type/add-document-type");
        // const allDataType = dataType?.data ?? [];
        setType(dataType?.data ?? []);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!textValue.trim()) {
      toast.warn("Please enter a document type");
      return;
    }

    try {
      const payload = {
        type: type,
        name: textValue,
      };

      const response = await postData(
        "document-type/add-document-type",
        payload,
      );

      console.log("Response:", response);
      toast.success("✅ Document type added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error adding document type:", error);
      toast.error("❌ Failed to add document type!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Upload Document Type
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter document type"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Submit
          </button>
          <button
            onClick={closeModal}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
