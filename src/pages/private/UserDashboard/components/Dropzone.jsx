import { useEffect, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../featured/auth/AuthContext";
import { getData, postData } from "../../../../utils/axiosInstance";

export default function Dropzone({
  onFilesSelected = () => {},
  closeModal = () => {},
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      // console.log("useEffect called for fetching document types.");
      if (!isAuthenticated) {
        // console.log("User not authenticated, skipping API call.");
        return;
      }
      setLoading(true);
      try {
        // console.log("Attempting to fetch document types from API...");
        const res = await getData("document-type/all-document-types");
        // console.log("Document types fetched successfully:", res.data.results);
        setDocumentTypes(res?.data?.results || []);
      } catch (err) {
        console.error("Failed to load document types:", err);
        setError("Failed to load document types.");
        toast.error("Failed to load document types.");
      } finally {
        setLoading(false);
        // console.log("Loading state is set to false.");
      }
    };
    fetchDocumentTypes();
  }, [isAuthenticated]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
    // console.log("Drag over event triggered.");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
    // console.log("Drag leave event triggered.");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    // console.log("Drop event triggered.");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const newFiles = files.filter(
        (file) =>
          !selectedFiles.some(
            (f) => f.name === file.name && f.size === file.size,
          ),
      );
      if (newFiles.length === 0) {
        toast.error("File(s) already added!");
        // console.log("Dropped files were duplicates.");
        return;
      }
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onFilesSelected({ name: "file", files: updatedFiles });
      e.dataTransfer.clearData();
      // console.log("Files dropped and state updated:", updatedFiles);
    }
  };

  const handleFileChange = (e) => {
    // console.log("File input change event triggered.");
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles = files.filter(
        (file) =>
          !selectedFiles.some(
            (f) => f.name === file.name && f.size === file.size,
          ),
      );
      if (newFiles.length === 0) {
        toast.error("File(s) already added!");
        // console.log("Selected files were duplicates.");
        return;
      }
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onFilesSelected({ name: e.target.name, files: updatedFiles });
      // console.log("Files selected and state updated:", updatedFiles);
    }
  };

  const openFilePicker = () => {
    // console.log("Browse Files button clicked, opening file picker.");
    document.getElementById("dropzone-file").click();
  };

  // ... (imports)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submit button clicked.");
    // console.log("Current state before form validation:", {
    //   selectedFiles: selectedFiles.length,
    //   selectedType, // This will be used as documentTypeId
    //   expiryDate,
    // });

    if (selectedFiles.length === 0) {
      toast.warn("Please select at least one file.");
      console.warn("Validation failed: No files selected.");
      return;
    }

    if (!selectedType) {
      toast.warn("Please select a document type.");
      console.warn("Validation failed: No document type selected.");
      return;
    }

    if (!expiryDate) {
      toast.warn("Please enter expiry date.");
      console.warn("Validation failed: No expiry date entered.");
      return;
    }

    try {
      setLoading(true);
      // console.log("Form is valid, starting upload process.");

      const formData = new FormData();
      // Use 'file' as the key to match Postman
      formData.append("file", selectedFiles[0]); // Assuming single file upload
      // Use 'documentTypeId' as the key to match Postman
      formData.append("documentTypeId", selectedType);
      formData.append("expiryDate", expiryDate);
      // 'uploadDate' is not in the Postman screenshot, so we'll remove it for consistency
      // formData.append("uploadDate", new Date().toISOString());

      // console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          // console.log(`- ${key}: File - ${value.name}`);
        } else {
          // console.log(`- ${key}: ${value}`);
        }
      }

      // console.log("Attempting to send POST request to backend...");
      // Your axiosInstance.postData function should handle authorization
      const response = await postData("document/upload-document", formData);

      // console.log("Upload response received:", response);
      toast.success(" Files uploaded successfully!");

      setSelectedFiles([]);
      setSelectedType("");
      setExpiryDate("");
      closeModal();
    } catch (error) {
      console.error("Upload error caught in catch block:", error);
      toast.error(" Failed to upload files. Please try again!");
    } finally {
      setLoading(false);
      // console.log("Upload process finished, loading state is now false.");
    }
  };
  // ... (rest of the component code remains the same)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModal}
    >
      <div
        className="relative m-4 w-full max-w-4xl rounded-lg bg-white p-6 px-8 py-4 shadow-lg sm:m-0 sm:px-16 sm:py-6 md:px-28 md:py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 rounded-full border border-gray-400 p-2 text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>

        <h2 className="mb-4 font-['Roboto'] text-xl font-semibold text-black sm:mb-8 md:mb-10">
          Upload Document
        </h2>

        {/* Dropzone */}
        <div className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 sm:mb-8 md:mb-10">
          <div className="flex w-full flex-col items-center justify-center">
            <div
              className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center pt-5 pb-6"
                onClick={openFilePicker}
              >
                <FiUpload className="mb-4 h-10 w-10 text-black md:mb-7" />
                <p className="font-['Segoe_UI'] text-xl leading-normal font-semibold text-neutral-800">
                  Drag & drop files here
                </p>
                <p className="font-['Segoe_UI'] text-base leading-normal font-normal text-neutral-600 md:my-5">
                  or
                </p>
              </div>
              <button
                type="button"
                onClick={openFilePicker}
                className="mb-6 flex h-12 items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-10 py-1.5 transition-colors hover:bg-blue-700 sm:h-14"
              >
                <span className="font-['Roboto'] text-base font-semibold text-white">
                  Browse Files
                </span>
              </button>
              <input
                id="dropzone-file"
                type="file"
                name="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 p-3">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Selected Files:
                </h3>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {selectedFiles.map((file, idx) => (
                    <li key={idx}>
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Expiry Date Input */}
        <div
          className="mb-4 w-full cursor-pointer rounded border border-gray-300 px-3 py-2 text-sm text-black"
          onClick={() =>
            document.getElementById("expiry-date-input").showPicker?.()
          } // ✅ force open calendar
        >
          <input
            id="expiry-date-input"
            type="date"
            name="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full cursor-pointer bg-transparent outline-none"
          />
        </div>

        {/* Document Types */}
        <div>
          <h2 className="mt-3 pb-5 font-['Roboto'] text-base font-normal text-black sm:mt-4 sm:pb-6 md:mt-5 md:pb-7">
            Supported document types:
          </h2>
          <div className="mb-4 grid max-h-[180px] grid-cols-2 gap-2 overflow-y-auto text-sm text-black md:gap-4">
            {documentTypes.map((badge) => (
              <button
                key={badge.id}
                type="button"
                onClick={() => setSelectedType(badge.id)}
                className={`flex items-center gap-2 rounded border p-3 transition-colors ${
                  selectedType === badge.id
                    ? "border-blue-300 bg-blue-100"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-200"
                }`}
              >
                <span className="h-5 w-5 flex-1 text-left text-black">
                  {badge.name}
                </span>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center justify-center rounded-lg px-8 py-3 transition-colors ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <span className="font-['Roboto'] text-sm font-medium text-white">
                {loading ? "Uploading..." : "Submit"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
