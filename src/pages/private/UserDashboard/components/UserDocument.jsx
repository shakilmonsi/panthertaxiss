import { Upload, Search, XCircle } from "lucide-react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";
import Dropzone from "./Dropzone";
import { deleteData, getData } from "../../../../utils/axiosInstance";
import { useAuth } from "../../../../featured/auth/AuthContext";
import { DocumentStorageCard } from "./components/DocumentStorageCard/DocumentStorageCard";
import { FilterDropdown } from "./components/filterDropdown/FilterDropdown";
import { Document } from "./components/document/Document";
import { CssAnimation } from "./components/cssAnimation/CssAnimation";
import { Toast } from "./components/toast/Toast";
import { ConfirmationModal } from "./components/confirmationModal/ConfirmationModal";
import { useEffect, useState } from "react";

export const UserDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    documentId: null,
    documentName: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const [documentTypes, setDocumentTypes] = useState([]);
  const [typeSearchQuery, setTypeSearchQuery] = useState("");
  const [filteredTypes, setFilteredTypes] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenBtn, setIsOpenBtn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("allRoleOpen") === "true";
    }
    return false;
  });

  const [subscribedUserCount, setSubscribedUserCount] = useState(0);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All Types");

  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [isOpenAllStatus, setIsOpenAllStatus] = useState(false);
  const [selectedAllStatus, setSelectedAllStatus] = useState("All Users");

  const optionsStatus = ["All Status", "Subscriber", "Expiring Soon", "Expired"];

  const { user, isAuthenticated } = useAuth();

  const doc = (documents.results || []).filter((docItem) => {
    if (!user) return false;
    const documentUserId =
      docItem.user?.id || docItem.uploaded_by?.id || docItem.user_id;
    return documentUserId === user.id;
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDiv = () => {
    setIsOpenBtn((prev) => {
      localStorage.setItem("allRoleOpen", !prev);
      return !prev;
    });
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const [documentsRes, typeRes, usersData] = await Promise.all([
          getData("document/all-documents"),
          getData("document-type/all-document-types"),
          getData("user"),
        ]);
        setDocuments(documentsRes?.data || []);
        setType(typeRes?.data || []);

        const users = usersData?.data?.users || [];
        const activeUsers = users.filter(
          (u) => u.subscription && u.status && u.status.toLowerCase() === "active"
        );

        setSubscribedUserCount(activeUsers.length);
        // Check if current logged-in user is subscribed
        const currentUser = activeUsers.find((u) => u.id === user.id);
        setIsUserSubscribed(!!currentUser);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  // Process document types
  useEffect(() => {
    if (!type || !Array.isArray(type.results)) {
      const defaultTypes = [{ id: "all", name: "All Types" }];
      setDocumentTypes(defaultTypes);
      setFilteredTypes(defaultTypes);
      return;
    }

    const apiTypes = type.results.map((typeItem) => ({
      id: typeItem.id || typeItem.name?.toLowerCase().replace(/\s+/g, "_"),
      name: typeItem.name || typeItem.type_name || typeItem.document_type,
    }));

    const allTypes = [{ id: "all", name: "All Types" }, ...apiTypes];
    setDocumentTypes(allTypes);
    setFilteredTypes(allTypes);
  }, [type]);

  // Search & filter
  useEffect(() => {
    if (!doc || doc.length === 0) return;
    let filtered = doc;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((document) => {
        const documentName = (document.file || document.document_name || "").toLowerCase();
        const documentType = (document.type || document.document_type || "").toLowerCase();
        const userName = (document.user?.name || document.uploaded_by?.name || "").toLowerCase();
        return documentName.includes(query) || documentType.includes(query) || userName.includes(query);
      });
    }

    if (selected !== "All Types") {
      const selectedTypeObj = documentTypes.find((t) => t.name === selected);
      const selectedTypeId = selectedTypeObj?.id;
      if (selectedTypeId && selectedTypeId !== "all") {
        filtered = filtered.filter((document) => document.documentTypeId === selectedTypeId);
      }
    }

    if (selectedStatus !== "All Status") {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      filtered = filtered.filter((document) => {
        if (selectedStatus === "Subscriber") {
          return document.status && document.status.toLowerCase() === "active";
        }
        if (selectedStatus === "Expiring Soon") {
          if (!document.expiryDate) return false;
          const expiryDate = new Date(document.expiryDate);
          return expiryDate <= thirtyDaysFromNow && expiryDate > today;
        }
        if (selectedStatus === "Expired") {
          if (!document.expiryDate) return false;
          const expiryDate = new Date(document.expiryDate);
          return expiryDate < today;
        }
        return true;
      });
    }

    if (selectedAllStatus !== "All Users") {
      filtered = filtered.filter((document) => {
        const userName = document.user?.name || document.uploaded_by?.name || "";
        return userName === selectedAllStatus;
      });
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, selected, selectedStatus, selectedAllStatus, doc.length, documentTypes]);

  // Type search
  useEffect(() => {
    if (!typeSearchQuery.trim()) {
      setFilteredTypes(documentTypes);
    } else {
      const query = typeSearchQuery.toLowerCase().trim();
      const filtered = documentTypes.filter(
        (type) => type.name.toLowerCase().includes(query) || String(type.id).toLowerCase().includes(query)
      );
      setFilteredTypes(filtered);
    }
  }, [typeSearchQuery, documentTypes]);

  const handleTypeSearchChange = (e) => setTypeSearchQuery(e.target.value);
  const clearTypeSearch = () => setTypeSearchQuery("");
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const showToast = (message, type) => setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: "", type: "" });

  const handleDeleteClick = (documentId, documentName) => {
    const documentToDelete = doc.find((d) => d.id === documentId);
    if (!documentToDelete) {
      showToast("Document not found or access denied.", "error");
      return;
    }
    const documentUserId = documentToDelete.user?.id || documentToDelete.uploaded_by?.id || documentToDelete.user_id;
    if (documentUserId !== user.id) {
      showToast("You can only delete your own documents.", "error");
      return;
    }
    setConfirmModal({ show: true, documentId, documentName });
  };

  const handleDeleteConfirm = async () => {
    try {
      const documentId = confirmModal.documentId;
      await deleteData(`document/delete-document/${documentId}`);
      setDocuments((prevDocs) => ({
        ...prevDocs,
        results: (prevDocs.results || []).filter((d) => d.id !== documentId),
      }));
      showToast(`Document deleted successfully!`, "success");
      setConfirmModal({ show: false, documentId: null, documentName: "" });
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete document.", "error");
      setConfirmModal({ show: false, documentId: null, documentName: "" });
    }
  };
  
  const handleDeleteCancel = () => setConfirmModal({ show: false, documentId: null, documentName: "" });

  const handleUploadSuccess = (newDocument) => {
    setDocuments((prevDocs) => ({
      ...prevDocs,
      results: [newDocument, ...(prevDocs.results || [])],
    }));
    showToast("Document uploaded successfully!", "success");
    closeModal();
  };

  const exportCSV = () => { /* your CSV code here */ };
  const exportPDF = () => { /* your PDF code here */ };

  return (
    <div className="mt-[78px] min-h-screen w-full bg-white px-4 py-3 font-['Roboto'] sm:mt-4 sm:p-5 md:mt-13 md:p-10 lg:mt-0">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <ConfirmationModal
        isOpen={confirmModal.show}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message={`Are you sure you want to delete "${confirmModal.documentName}"? This action cannot be undone.`}
      />

      <div className="mx-auto max-w-full rounded-xl border border-gray-300 px-4 pt-6 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div className="flex flex-col gap-3">
            <h1 className="font-['Roboto'] text-xl font-[700] text-[#212121] sm:text-2xl">Document Storage</h1>
            <p className="font-['Roboto'] text-base font-[400] text-[#555555]">Manage compliance documents and track expiry dates</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={openModal}
              className="flex h-12 items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-4 py-2.5 transition-colors hover:bg-blue-700 sm:h-14"
            >
              <Upload className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              <span className="font-['Roboto'] text-sm font-[600] text-white sm:text-base">Upload Document</span>
            </button>
          </div>
          {isModalOpen && <Dropzone closeModal={closeModal} onUploadSuccess={handleUploadSuccess} />}
        </div>

        {/* Stats */}
        <DocumentStorageCard
          doc={doc}
          subscribedCount={isUserSubscribed ? "You are already Subscribed" : subscribedUserCount}
        />

        {/* Search & Filter */}
        <div className="mb-6 flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-lg flex-1 relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              placeholder="Search documents, users, or file names..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-10 w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-10 font-['Roboto'] text-base font-normal text-neutral-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={exportCSV}
                disabled={!filteredDocuments.length}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowDownTrayIcon className="h-5 w-5 text-[#555555]" />
                CSV
              </button>
              <button
                onClick={exportPDF}
                disabled={!filteredDocuments.length}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowDownTrayIcon className="h-5 w-5 text-[#555555]" />
                PDF
              </button>
            </div>
            <div className="relative w-full lg:w-52">
              <button
                onClick={toggleDiv}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-['Segoe_UI'] text-base font-[500] text-gray-500 shadow-sm"
              >
                <FiFilter /> All Role
                {isOpenBtn ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
          </div>
        </div>

        {isOpenBtn && (
          <FilterDropdown
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            selected={selected}
            typeSearchQuery={typeSearchQuery}
            handleTypeSearchChange={handleTypeSearchChange}
            clearTypeSearch={clearTypeSearch}
            loading={loading}
            filteredTypes={filteredTypes}
            setSelected={setSelected}
            setIsOpenStatus={setIsOpenStatus}
            isOpenStatus={isOpenStatus}
            selectedStatus={selectedStatus}
            optionsStatus={optionsStatus}
            setSelectedStatus={setSelectedStatus}
            setIsOpenAllStatus={setIsOpenAllStatus}
            isOpenAllStatus={isOpenAllStatus}
            user={user}
          />
        )}

        <Document
          loading={loading}
          error={error}
          filteredDocuments={filteredDocuments}
          searchQuery={searchQuery}
          selected={selected}
          selectedStatus={selectedStatus}
          selectedAllStatus={selectedAllStatus}
          clearSearch={() => setSearchQuery("")}
          setSelected={setSelected}
          setSelectedStatus={setSelectedStatus}
          setSelectedAllStatus={setSelectedAllStatus}
          doc={doc}
          user={user}
          handleDeleteClick={handleDeleteClick}
        />
      </div>

      <CssAnimation />
    </div>
  );
};
