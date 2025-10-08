import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Search,
  ChevronDown,
  Eye,
  Calendar,
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { SlCalender } from "react-icons/sl";
import { CiBellOff } from "react-icons/ci";



import { getData } from "../../../utils/axiosInstance";
import { UploadTypeModal } from "./UploadTypeModal/UploadTypeModal";

const DocumentManagement = () => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeDocuments: 0,
    expiringSoon: 0,
    expired: 0,
    remindersActive: 0,
  });
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [users, setUsers] = useState([{ id: "all", name: "All Users" }]);
  const [filteredUsers, setFilteredUsers] = useState([
    { id: "all", name: "All Users" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [userDropdownSearchTerm, setUserDropdownSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [userSearchLoading, setUserSearchLoading] = useState(false);

  // ---setup model and upload doc type----------
  // FIXED: Separate state for Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // FIXED: Functions for Upload Modal
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-300 text-green-800";
      case "Expiring":
        return "bg-orange-200 text-yellow-900";
      case "Expired":
        return "bg-rose-100 text-rose-400";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  const getStatIconClasses = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-200 text-blue-600";
      case "green":
        return "bg-green-200 text-green-600";
      case "amber":
        return "bg-amber-100 text-amber-400";
      case "rose":
        return "bg-rose-100 text-rose-400";
      case "pink":
        return "bg-pink-50 text-pink-400";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const getStatValueClasses = (color) => {
    switch (color) {
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      case "amber":
        return "text-amber-400";
      case "rose":
        return "text-rose-400";
      case "pink":
        return "text-pink-400";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // UPDATED FUNCTION TO DISPLAY EXPIRED DAYS
  const calculateDaysLeft = (expiryDateString, expiryCount) => {
    if (!expiryDateString) return "N/A";
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffDays < 0) {
      // Use the expiryCount from the database if available
      const expiredDays = expiryCount || Math.abs(diffDays);
      return `Expired ${expiredDays} days ago`;
    } else {
      return "Expires today";
    }
  };

  const handleView = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (userDropdownSearchTerm.length > 0) {
        console.log("Starting user search for:", userDropdownSearchTerm);
        setUserSearchLoading(true);

        try {
          const response = await getData(
            `user/user-search/${userDropdownSearchTerm}`,
          );
          const searchedUsers = response?.data?.users || [];

          console.log("User search results:", searchedUsers);

          if (Array.isArray(searchedUsers)) {
            const userList = [
              { id: "all", name: "All Users" },
              ...searchedUsers,
            ];
            setFilteredUsers(userList);
          } else {
            setFilteredUsers([{ id: "all", name: "All Users" }]);
          }
        } catch (error) {
          console.error("Error searching users:", error);
          if (error.response) {
            console.error(
              "Server responded with:",
              error.response.status,
              error.response.data,
            );
          } else if (error.request) {
            console.error("No response received:", error.request);
          } else {
            console.error("Error setting up request:", error.message);
          }
          setFilteredUsers([{ id: "all", name: "All Users" }]);
        } finally {
          setUserSearchLoading(false);
        }
      } else {
        setFilteredUsers(users);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [userDropdownSearchTerm, users]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentsResponse = await getData("document/all-documents");
        const fetchedDocuments = documentsResponse?.data?.results ?? [];

        if (Array.isArray(fetchedDocuments)) {
          let activeCount = 0;
          let expiringCount = 0;
          let expiredCount = 0;
          let remindersCount = 0;
          const today = new Date();
          const todayTime = today.getTime();
          const thirtyDaysFromNow = todayTime + 30 * 24 * 60 * 60 * 1000;

          const updatedDocs = fetchedDocuments.map((doc) => {
            const docExpiryDate = doc.expiryDate
              ? new Date(doc.expiryDate)
              : null;
            let status = doc.status;

            if (docExpiryDate) {
              const docExpiryTime = docExpiryDate.getTime();
              if (docExpiryTime < todayTime) {
                status = "Expired";
                expiredCount++;
              } else if (docExpiryTime <= thirtyDaysFromNow) {
                status = "Expiring";
                expiringCount++;
              } else {
                status = "Active";
                activeCount++;
              }
            } else if (status === "Active") {
              activeCount++;
            }

            if (doc.reminders_enabled) {
              remindersCount++;
            }

            return { ...doc, status };
          });

          setStats({
            totalDocuments: updatedDocs.length,
            activeDocuments: activeCount,
            expiringSoon: expiringCount,
            expired: expiredCount,
            remindersActive: remindersCount,
          });

          setDocuments(updatedDocs);
          setFilteredDocuments(updatedDocs);

          const uniqueUsers = [];
          const seenUserIds = new Set();

          updatedDocs.forEach((doc) => {
            if (doc.user && !seenUserIds.has(doc.user.id)) {
              uniqueUsers.push(doc.user);
              seenUserIds.add(doc.user.id);
            }
          });

          setUsers([{ id: "all", name: "All Users" }, ...uniqueUsers]);
          setFilteredUsers([{ id: "all", name: "All Users" }, ...uniqueUsers]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("ডেটা লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = documents;

    if (selectedUser !== "All Users") {
      result = result.filter((doc) => doc.user?.name === selectedUser);
    }

    if (searchTerm) {
      result = result.filter(
        (doc) =>
          doc.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.document_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.status?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredDocuments(result);
  }, [searchTerm, selectedUser, documents]);

  const statsData = [
    {
      label: "Total Documents",
      value: stats.totalDocuments,
      color: "blue",
      icon: FileText,
    },
    {
      label: "Active Documents",
      value: stats.activeDocuments,
      color: "green",
      icon: CheckCircle,
    },
    {
      label: "Expiring Soon",
      value: stats.expiringSoon,
      color: "amber",
      icon: AlertTriangle,
    },
    { label: "Expired", value: stats.expired, color: "rose", icon: XCircle },
    {
      label: "Reminders Active",
      value: stats.remindersActive,
      color: "pink",
      icon: Bell,
    },
  ];

  const exportToCSV = () => {
    if (!filteredDocuments.length) return;

    const headers = [
      "Document Type",
      "User Name",
      "Email",
      "Status",
      "Expiry Date",
      "Reminders Enabled",
      "Uploaded On",
      "File URL",
    ];

    const rows = filteredDocuments.map((doc) => [
      doc.document_type || "N/A",
      doc.user?.name || "N/A",
      doc.user?.email || "N/A",
      doc.status || "N/A",
      formatDate(doc.expiryDate),
      doc.reminders_enabled ? "Yes" : "No",
      formatDate(doc.createdAt),
      doc.file || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) =>
          row
            .map((item) =>
              typeof item === "string" && item.includes(",")
                ? `"${item}"`
                : item,
            )
            .join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "documents_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative min-h-screen w-full overflow-x-scroll bg-white py-5 shadow-md sm:rounded-lg">
      <style>{`
        .overflow-x-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .overflow-x-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .overflow-x-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .overflow-x-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div className="mx-auto mt-[72px] max-w-full px-4 sm:px-6 md:mt-[64px] md:px-8 lg:mt-0 lg:px-10">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-6">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="font-['Roboto'] text-xl font-[700] text-neutral-800 md:text-[26px] lg:text-[32px]">
                Documents Management
              </h1>
            </div>
            <p className="font-['Roboto'] text-sm font-[400] text-neutral-600 sm:text-base">
              Track and manage user documents with expiry monitoring
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={openUploadModal}
              className="flex h-12 items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-4 py-2.5 transition-colors hover:bg-blue-700 sm:h-14"
            >
              <Upload className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              <span className="font-['Roboto'] text-sm font-[600] text-white sm:text-base">
                Upload Document Type
              </span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-blue-600 px-4 py-2.5 transition-colors hover:bg-blue-50 sm:h-14 sm:w-40"
            >
              <Download className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              <span className="font-['Roboto'] text-sm font-[600] text-blue-600 sm:text-base">
                Export
              </span>
            </button>
          </div>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-2.5 rounded-xl border border-neutral-300 bg-white p-4 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex items-center justify-center rounded p-1 ${getStatIconClasses(
                    stat.color,
                  )}`}
                >
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <div
                    className={`font-['Roboto'] text-2xl font-[600] sm:text-3xl ${getStatValueClasses(
                      stat.color,
                    )}`}
                  >
                    {stat.value}
                  </div>
                  <div className="font-['Roboto'] text-sm font-normal text-neutral-600 sm:text-base">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-6 flex w-full flex-col gap-4 border-b border-stone-300 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full flex-1 md:w-[45%]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-neutral-600" />
              <input
                type="text"
                placeholder="Search documents Name ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-10 font-['Roboto'] text-base font-normal text-neutral-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="relative w-full md:w-[45%]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full appearance-none items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 font-['Segoe_UI'] text-base font-[500] text-gray-500 shadow-sm"
            >
              {selectedUser}
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            </button>
            {isDropdownOpen && (
              <ul className="absolute z-10 -mt-12 max-h-60 w-full overflow-y-auto rounded-[8px] bg-white shadow-[12px_12px_24px_0_rgba(18,118,249,0.16)]">
                <li className="border-b border-gray-100 p-2">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-neutral-600" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={userDropdownSearchTerm}
                      onChange={(e) =>
                        setUserDropdownSearchTerm(e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-9 font-['Roboto'] text-sm font-normal text-neutral-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {userSearchLoading && (
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 transform">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </li>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user.name);
                        setIsDropdownOpen(false);
                        setUserDropdownSearchTerm("");
                      }}
                      className="flex cursor-pointer flex-col px-4 py-2 text-gray-700 hover:bg-blue-50"
                    >
                      <span className="font-medium">{user.name}</span>
                      {user.email && (
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      )}
                    </li>
                  ))
                ) : userDropdownSearchTerm && !userSearchLoading ? (
                  <li className="px-4 py-2 text-sm text-gray-500">
                    No users found
                  </li>
                ) : null}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-5">
          <div className="rounded-lg px-5 py-2.5">
            <h2 className="font-['Roboto'] text-lg font-semibold text-neutral-800 sm:text-xl">
              {filteredDocuments.length} documents found
            </h2>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-lg text-red-500">{error}</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center text-lg text-gray-500">
            data not found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex w-full flex-col gap-6 rounded-lg border border-stone-300 bg-white p-4"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-1 items-start gap-2">
                        <FileText className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="truncate font-['Roboto'] text-sm font-normal text-neutral-800 mb-1">
                            {doc.file.slice(-27) || "Document"}
                          </div>
                          <div className="font-['Roboto'] text-xs font-normal text-neutral-600">
                            {doc.user?.name || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex h-6 flex-shrink-0 items-center justify-center rounded-full px-2 py-1 ${getStatusBadgeClasses(
                          doc.status,
                        )}`}
                      >
                        <div className="font-['Roboto'] text-sm font-normal whitespace-nowrap">
                          {doc.status || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-200 py-3 pr-4 pl-2">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-400">
                        {doc.user?.profile_pic ? (
                          <img
                            src={doc.user.profile_pic}
                            alt={doc.user.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-600">
                            {doc.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="truncate font-['Roboto'] text-base font-normal text-neutral-800">
                          {doc?.user?.name || "N/A"}
                        </div>
                        <div className="truncate font-['Roboto'] text-sm font-normal text-neutral-600">
                          {doc?.user?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-neutral-600" />
                      <div className="font-['Roboto'] text-sm font-normal text-neutral-600">
                        Expires: {formatDate(doc.expiryDate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      {/* UPDATED CALL TO THE FUNCTION */}
                      <div className="font-['Roboto'] text-sm font-normal text-orange-500">
                       Expired : {calculateDaysLeft(doc.expiryDate, doc.expiryCount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      {doc.reminders_enabled ? (
                        <>
                          <Bell className="h-4 w-4 text-green-600" />
                          <span className="font-['Roboto'] font-normal text-neutral-600">
                            Reminders enabled
                          </span>
                        </>
                      ) : (
                        <>
                          <CiBellOff className="h-4 w-4 text-neutral-600" />
                          <span className="font-['Roboto'] font-normal text-neutral-600">
                            Reminders disabled
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <SlCalender className="h-4 w-4 text-neutral-600" />
                      <span className="font-['Roboto'] font-normal text-neutral-600">
                        Uploaded: {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleView(doc)}
                      className="flex items-center gap-2 transition-opacity hover:opacity-75"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="font-['Roboto'] text-xs font-normal text-blue-600">
                        View
                      </span>
                    </button>
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-opacity hover:opacity-75"
                    >
                      <Download className="h-4 w-4 text-neutral-600" />
                      <span className="font-['Roboto'] text-xs font-normal text-black">
                        Download
                      </span>
                    </a>
                  </div>
                  <div className="font-['Roboto'] text-xs font-normal text-black">
                    Uploaded {formatDate(doc.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FIXED: Upload Document Modal */}
        {isUploadModalOpen && <UploadTypeModal closeModal={closeUploadModal} />}
        {isModalOpen && selectedDocument && (
          <div
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative w-full max-w-2xl transform overflow-hidden rounded-lg border-1 border-blue-500 bg-white p-6 text-left shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <div className="flex items-center justify-center">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-2 text-center text-xl leading-6 font-bold text-gray-900">
                Document Details
              </h3>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                  <div className="border-blue-400/20 sm:col-span-1">
                    <span className="text-sm font-medium text-gray-500">
                      Document Type :
                    </span>
                    <span className="mt-1 pl-2 text-sm text-gray-900">
                      {selectedDocument.document_type || "N/A"}
                    </span>
                  </div>
                  <div className="border-blue-400/20 sm:col-span-1">
                    <span className="text-sm font-medium text-gray-500">
                      User Name :
                    </span>
                    <span className="mt-1 pl-2 text-sm text-gray-900">
                      {selectedDocument.user?.name || "N/A"}
                    </span>
                  </div>
                  <div className="border-blue-400/20 sm:col-span-1">
                    <span className="text-sm font-medium text-gray-500">
                      Expiry Date :
                    </span>
                    <span className="mt-1 pl-2 text-sm text-gray-900">
                      {formatDate(selectedDocument.expiryDate)}
                    </span>
                  </div>
                  <div className="border-blue-400/20 sm:col-span-1">
                    <span className="text-sm font-medium text-gray-500">
                      Status :
                    </span>
                    <span className="mt-1 pl-2 text-sm text-gray-900">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClasses(
                          selectedDocument.status,
                        )}`}
                      >
                        {selectedDocument.status || "N/A"}
                      </span>
                    </span>
                  </div>
                  <div className="border-blue-400/20 sm:col-span-1">
                    <span className="text-sm font-medium text-gray-500">
                      Reminders :
                    </span>
                    <span className="mt-1 pl-2 text-sm text-gray-900">
                      {selectedDocument.reminders_enabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </div>
                  <div className="border-blue-400/20 sm:col-span-1">
                    <span className="text-sm font-medium text-gray-500">
                      Uploaded On
                    </span>
                    <span className="mt-1 pl-2 text-sm text-gray-900">
                      {formatDate(selectedDocument.createdAt)}
                    </span>
                  </div>
                  <div className="border-blue-400/20 sm:col-span-2">
                    <span className="text-sm font-medium text-gray-500">
                      File URL :
                    </span>
                    <span className="mt-1 pl-2 text-sm break-all text-blue-600 underline hover:text-blue-800">
                      <a
                        href={selectedDocument.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedDocument.file || "N/A"}
                      </a>
                    </span>
                  </div>
                </dl>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <a
                  href={selectedDocument.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Download Document
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManagement;
