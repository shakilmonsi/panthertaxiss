// import {
//   IdentificationIcon,
// } from "@heroicons/react/24/solid";
// import { CreditCardIcon, EyeIcon, TruckIcon } from "lucide-react";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { MdOutlineCalendarToday } from "react-icons/md";
// import { DocumentTextIcon, XCircleIcon } from "@heroicons/react/24/outline";
// import { BiShield } from "react-icons/bi";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
// import { useState } from "react";

// const docIcons = {
//   badge: BiShield,
//   insurance: CreditCardIcon,
//   mot: TruckIcon,
//   licence: IdentificationIcon,
// };

// const memoizedFileSizes = new Map();

// const getConsistentFileSize = (document) => {
//   const key =
//     (document.id || "") + (document.file || document.document_name || "");
//   if (memoizedFileSizes.has(key)) {
//     return memoizedFileSizes.get(key);
//   }
//   let hash = 0;
//   for (let i = 0; i < key.length; i++) {
//     hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
//   }
//   const seedValue = Math.abs(hash);
//   const fileName = document.file || document.document_name || "";
//   const extension = fileName.split(".").pop()?.toLowerCase();
//   let minSize, maxSize;
//   switch (extension) {
//     case "pdf":
//       minSize = 100000;
//       maxSize = 5000000;
//       break;
//     case "jpg":
//     case "jpeg":
//     case "png":
//     case "gif":
//       minSize = 50000;
//       maxSize = 2000000;
//       break;
//     case "doc":
//     case "docx":
//       minSize = 20000;
//       maxSize = 1000000;
//       break;
//     case "txt":
//       minSize = 1000;
//       maxSize = 50000;
//       break;
//     case "mp4":
//     case "avi":
//       minSize = 5000000;
//       maxSize = 100000000;
//       break;
//     default:
//       minSize = 10000;
//       maxSize = 3000000;
//   }
//   const sizeRange = maxSize - minSize;
//   const randomBytes = minSize + (seedValue % sizeRange);
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(randomBytes) / Math.log(1024));
//   let formattedSize;
//   if (i === 0) {
//     formattedSize = randomBytes + " " + sizes[i];
//   } else {
//     formattedSize =
//       (randomBytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
//   }
//   memoizedFileSizes.set(key, formattedSize);
//   return formattedSize;
// };

// const getDocumentStatus = (document) => {
//   if (document.status === "Subscriber") return "Subscriber";
//   if (document.status === "Pending") return "Pending";
//   const expiryDate = new Date(
//     document.expiryDate || document.expiry_date || document.expires_at,
//   );
//   if (!expiryDate.getDate()) return document.status || "N/A";
//   const today = new Date();
//   const thirtyDaysFromNow = new Date();
//   thirtyDaysFromNow.setDate(today.getDate() + 30);
//   if (expiryDate < today) return "Expired";
//   if (expiryDate <= thirtyDaysFromNow && expiryDate > today)
//     return "Expiring Soon";
//   return document.status || "Subscriber";
// };

// const renderStatus = (document) => {
//   const status = getDocumentStatus(document);
//   switch (status) {
//     case "Subscriber":
//       return (
//         <span className="flex w-fit items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-sm font-normal text-blue-700">
//           <BiShield className="h-4 w-4" /> {status}
//         </span>
//       );
//     case "Expiring Soon":
//       return (
//         <span className="flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-sm font-normal text-amber-700">
//           <ExclamationTriangleIcon className="h-4 w-4" /> {status}
//         </span>
//       );
//     case "Expired":
//       return (
//         <span className="flex w-fit items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-sm font-normal text-rose-700">
//           <XCircleIcon className="h-4 w-4" /> {status}
//         </span>
//       );
//     case "Pending":
//       return (
//         <span className="flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-sm font-normal text-amber-700">
//           <ExclamationTriangleIcon className="h-4 w-4" /> {status}
//         </span>
//       );
//     default:
//       return (
//         <span className="flex w-fit items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm font-normal text-gray-600">
//           {status}
//         </span>
//       );
//   }
// };

// export const UserDocumentTable = ({
//   handleDeleteClick,
//   filteredDocuments = [],
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState(null);

//   const openModal = (doc) => {
//     setSelectedDoc(doc);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedDoc(null);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative overflow-x-scroll shadow-md sm:rounded-lg">
//       <style>{`
//         .overflow-x-scroll {
//           scrollbar-width: thin;
//           scrollbar-color: #cbd5e1 #f1f5f9;
//         }
//         .overflow-x-scroll::-webkit-scrollbar {
//           height: 8px;
//         }
//         .overflow-x-scroll::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 4px;
//         }
//         .overflow-x-scroll::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 4px;
//         }
//         .overflow-x-scroll::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>

//       <h2 className="mb-4 px-4 text-base font-semibold text-[#212121] sm:px-6">
//         Documents ({filteredDocuments?.length || 0})
//       </h2>

//       <table className="w-full min-w-[600px] table-fixed border-collapse sm:min-w-[700px] md:min-w-[800px] lg:min-w-[900px] xl:min-w-full">
//         <thead className="bg-[#FDFCFC]">
//           <tr className="text-sm font-semibold text-[#555555] sm:text-base">
//             <th className="w-[200px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[250px] sm:px-4 sm:text-base md:w-[280px] md:px-5 md:py-3 lg:px-6 lg:py-4">
//               Document
//             </th>
//             <th className="w-[150px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[180px] sm:px-4 sm:text-base md:w-[200px] md:px-5 md:py-3 lg:px-6 lg:py-4">
//               User
//             </th>
//             <th className="w-[120px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[130px] sm:px-4 sm:text-base md:w-[140px] md:px-5 md:py-3 lg:px-6 lg:py-4">
//               Upload Date
//             </th>
//             <th className="w-[120px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[130px] sm:px-4 sm:text-base md:w-[140px] md:px-5 md:py-3 lg:px-6 lg:py-4">
//               Expiry Date
//             </th>
//             <th className="w-[100px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[110px] sm:px-4 sm:text-base md:w-[120px] md:px-5 md:py-3 lg:px-6 lg:py-4">
//               Status
//             </th>
//             <th className="w-[100px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[110px] sm:px-4 sm:text-base md:w-[120px] md:px-5 md:py-3 lg:px-6 lg:py-4">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredDocuments.map((document, index) => {
//             const Icon = docIcons[document.type] || DocumentTextIcon;
//             const documentName =
//               document.file || document.document_name || "N/A";

//             return (
//               <tr
//                 key={document.id || index}
//                 className="border-b border-gray-100 transition-colors hover:bg-gray-50"
//               >
//                 <td className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2">
//                   <div className="rounded-md bg-gray-100 p-1">
//                     <Icon className="h-6 w-6 text-gray-700" />
//                   </div>
//                   <div>
//                     <h4 className="font-['Roboto'] text-sm font-normal text-[#555555] md:text-base">
//                       {documentName.slice(42, 72)}
//                     </h4>
//                     <p className="font-['Roboto'] text-xs font-normal text-[#555555]">
//                       {getConsistentFileSize(document)}
//                     </p>
//                   </div>
//                 </td>

//                 <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     <img
//                       src={
//                         document.user?.avatar ||
//                         document.uploaded_by?.avatar ||
//                         "https://i.pravatar.cc/40?img=1"
//                       }
//                       alt={
//                         document.user?.name ||
//                         document.uploaded_by?.name ||
//                         "User"
//                       }
//                       className="h-6 w-6 flex-shrink-0 rounded-full sm:h-7 sm:w-7 md:h-8 md:w-8"
//                     />
//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-sm font-normal text-[#555555] md:text-base">
//                         {document.user?.name ||
//                           document.uploaded_by?.name ||
//                           "N/A"}
//                       </p>
//                       <p className="truncate text-xs text-[#A09C9C]">
//                         {document.user?.role || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     <MdOutlineCalendarToday className="h-3 w-3 flex-shrink-0 text-gray-600 sm:h-4 sm:w-4" />
//                     <span className="truncate text-xs text-gray-500 sm:text-sm">
//                       {(
//                         document.uploadDate ||
//                         document.upload_date ||
//                         document.createdAt ||
//                         document.created_at ||
//                         "N/A"
//                       ).slice(0, 10)}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     <MdOutlineCalendarToday className="h-3 w-3 flex-shrink-0 text-gray-600 sm:h-4 sm:w-4" />
//                     <span className="truncate text-xs text-gray-500 sm:text-sm">
//                       {(
//                         document.expiryDate ||
//                         document.expiry_date ||
//                         document.expires_at ||
//                         "N/A"
//                       ).slice(0, 10)}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
//                   <div className="w-full overflow-hidden text-sm md:text-base">
//                     {renderStatus(document)}
//                   </div>
//                 </td>
//                 <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
//                   <div className="flex items-center gap-3 md:gap-5">
//                     <EyeIcon
//                       className="h-4 w-4 flex-shrink-0 cursor-pointer text-[#1276F9] transition-colors hover:text-blue-800 sm:h-5 sm:w-5"
//                       onClick={() => openModal(document)}
//                       title="View Details"
//                     />
//                     <FaRegTrashAlt
//                       className="h-4 w-4 flex-shrink-0 cursor-pointer text-[#555555] transition-colors hover:text-red-600 sm:h-5 sm:w-5"
//                       onClick={() =>
//                         handleDeleteClick(document.id, documentName)
//                       }
//                       title="Delete Document"
//                     />
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {isModalOpen && selectedDoc && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
//           <div className="max-h-[90vh] w-full max-w-[95vw] overflow-y-auto rounded-lg bg-white p-4 text-black/80 shadow-lg sm:max-w-md sm:p-6 md:max-w-lg lg:max-w-xl">
//             <div className="mb-4 flex items-center justify-between border-b border-black/20 pb-2">
//               <h2 className="text-base font-semibold sm:text-lg">
//                 Document Details
//               </h2>
//               <button
//                 className="text-lg text-gray-500 transition-colors hover:text-gray-700 sm:text-xl"
//                 onClick={closeModal}
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="space-y-3 text-sm sm:text-base">
//               <div className="flex items-center gap-2 border-b border-black/10 pb-2">
//                 <strong className="text-gray-700">Name:</strong>
//                 <p className="mt-1 break-words">
//                   {selectedDoc.user?.name ||
//                     selectedDoc.uploaded_by?.name ||
//                     "N/A"}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 border-b border-black/10 pb-2">
//                 <strong className="text-gray-700">Role:</strong>
//                 <p className="mt-1">{selectedDoc.user?.role || "N/A"}</p>
//               </div>
//               <div className="flex items-center gap-2 border-b border-black/10 pb-2">
//                 <strong className="text-gray-700">Document:</strong>
//                 <div className="mt-1">
//                   {selectedDoc.file || selectedDoc.document_name ? (
//                     <a
//                       href={selectedDoc.file || selectedDoc.document_name}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="break-all text-blue-600 hover:underline"
//                     >
//                       {selectedDoc.file?.split("/").pop() ||
//                         selectedDoc.document_name}
//                     </a>
//                   ) : (
//                     "N/A"
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 border-b border-black/10 pb-2">
//                 <strong className="text-gray-700">Type:</strong>
//                 <p className="mt-1">
//                   {selectedDoc.type || selectedDoc.document_type || "N/A"}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 border-b border-black/10 pb-2">
//                 <strong className="text-gray-700">Upload Date:</strong>
//                 <p className="mt-1">
//                   {(
//                     selectedDoc.uploadDate ||
//                     selectedDoc.upload_date ||
//                     selectedDoc.createdAt ||
//                     "N/A"
//                   ).slice(0, 10)}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 border-b border-black/10 pb-2">
//                 <strong className="text-gray-700">Expiry Date:</strong>
//                 <p className="mt-1">
//                   {(
//                     selectedDoc.expiryDate ||
//                     selectedDoc.expiry_date ||
//                     selectedDoc.expires_at ||
//                     "N/A"
//                   ).slice(0, 10)}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 pb-2">
//                 <strong className="text-gray-700">Status:</strong>
//                 <div className="mt-1">{renderStatus(selectedDoc)}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import { IdentificationIcon } from "@heroicons/react/24/solid";
import { CreditCardIcon, EyeIcon, TruckIcon } from "lucide-react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { DocumentTextIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { BiShield } from "react-icons/bi";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const docIcons = {
  badge: BiShield,
  insurance: CreditCardIcon,
  mot: TruckIcon,
  licence: IdentificationIcon,
};

const memoizedFileSizes = new Map();

const getConsistentFileSize = (document) => {
  const key =
    (document.id || "") + (document.file || document.document_name || "");
  if (memoizedFileSizes.has(key)) {
    return memoizedFileSizes.get(key);
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
  }
  const seedValue = Math.abs(hash);
  const fileName = document.file || document.document_name || "";
  const extension = fileName.split(".").pop()?.toLowerCase();
  let minSize, maxSize;
  switch (extension) {
    case "pdf":
      minSize = 100000;
      maxSize = 5000000;
      break;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      minSize = 50000;
      maxSize = 2000000;
      break;
    case "doc":
    case "docx":
      minSize = 20000;
      maxSize = 1000000;
      break;
    case "txt":
      minSize = 1000;
      maxSize = 50000;
      break;
    case "mp4":
    case "avi":
      minSize = 5000000;
      maxSize = 100000000;
      break;
    default:
      minSize = 10000;
      maxSize = 3000000;
  }
  const sizeRange = maxSize - minSize;
  const randomBytes = minSize + (seedValue % sizeRange);
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(randomBytes) / Math.log(1024));
  let formattedSize;
  if (i === 0) {
    formattedSize = randomBytes + " " + sizes[i];
  } else {
    formattedSize =
      (randomBytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  }
  memoizedFileSizes.set(key, formattedSize);
  return formattedSize;
};

const getDocumentStatus = (document) => {
  if (document.status === "Subscriber") return "Subscriber";
  if (document.status === "Pending") return "Pending";
  const expiryDate = new Date(
    document.expiryDate || document.expiry_date || document.expires_at,
  );
  if (!expiryDate.getDate()) return document.status || "N/A";
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  if (expiryDate < today) return "Expired";
  if (expiryDate <= thirtyDaysFromNow && expiryDate > today)
    return "Expiring Soon";
  return document.status || "Subscriber";
};

const renderStatus = (document) => {
  const status = getDocumentStatus(document);
  switch (status) {
    case "Subscriber":
      return (
        <span className="flex w-fit items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-sm font-normal text-blue-700">
          <BiShield className="h-4 w-4" /> {status}
        </span>
      );
    case "Expiring Soon":
      return (
        <span className="flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-sm font-normal text-amber-700">
          <ExclamationTriangleIcon className="h-4 w-4" /> {status}
        </span>
      );
    case "Expired":
      return (
        <span className="flex w-fit items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-sm font-normal text-rose-700">
          <XCircleIcon className="h-4 w-4" /> {status}
        </span>
      );
    case "Pending":
      return (
        <span className="flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-sm font-normal text-amber-700">
          <ExclamationTriangleIcon className="h-4 w-4" /> {status}
        </span>
      );
    default:
      return (
        <span className="flex w-fit items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm font-normal text-gray-600">
          {status}
        </span>
      );
  }
};

export const UserDocumentTable = ({
  handleDeleteClick,
  filteredDocuments = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // এখনকার page
  const itemsPerPage = 10; // প্রতি পেজে কতটি document দেখাবে

  const openModal = (doc) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDoc(null);
    setIsModalOpen(false);
  };
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  return (
    <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative overflow-x-scroll shadow-md sm:rounded-lg">
      <div>
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

        <h2 className="mb-4 px-4 text-base font-semibold text-[#212121] sm:px-6">
          Documents ({filteredDocuments?.length || 0})
        </h2>

        <table className="w-full min-w-[600px] table-fixed border-collapse sm:min-w-[700px] md:min-w-[800px] lg:min-w-[900px] xl:min-w-full">
          <thead className="bg-[#FDFCFC]">
            <tr className="text-sm font-semibold text-[#555555] sm:text-base">
              <th className="w-[200px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[250px] sm:px-4 sm:text-base md:w-[280px] md:px-5 md:py-3 lg:px-6 lg:py-4">
                Document
              </th>
              <th className="w-[150px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[180px] sm:px-4 sm:text-base md:w-[200px] md:px-5 md:py-3 lg:px-6 lg:py-4">
                User
              </th>
              <th className="w-[120px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[130px] sm:px-4 sm:text-base md:w-[140px] md:px-5 md:py-3 lg:px-6 lg:py-4">
                Upload Date
              </th>
              <th className="w-[120px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[130px] sm:px-4 sm:text-base md:w-[140px] md:px-5 md:py-3 lg:px-6 lg:py-4">
                Expiry Date
              </th>
              <th className="w-[100px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[110px] sm:px-4 sm:text-base md:w-[120px] md:px-5 md:py-3 lg:px-6 lg:py-4">
                Status
              </th>
              <th className="w-[100px] px-2 py-2 text-left text-sm font-semibold text-[#212121] sm:w-[110px] sm:px-4 sm:text-base md:w-[120px] md:px-5 md:py-3 lg:px-6 lg:py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocuments.map((document, index) => {
              const Icon = docIcons[document.type] || DocumentTextIcon;
              const documentName =
                document.file || document.document_name || "N/A";

              return (
                <tr
                  key={document.id || index}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2">
                    <div className="rounded-md bg-gray-100 p-1">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-['Roboto'] text-sm font-normal text-[#555555] md:text-base">
                        {documentName.slice(42, 72)}
                      </h4>
                      <p className="font-['Roboto'] text-xs font-normal text-[#555555]">
                        {getConsistentFileSize(document)}
                      </p>
                    </div>
                  </td>

                  <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <img
                        src={
                          document.user?.profile_pic ||
                          document.uploaded_by?.profile_pic ||
                          "/image/allProfile.png"
                        }
                        alt={
                          document.user?.name ||
                          document.uploaded_by?.name ||
                          "User"
                        }
                        className="h-6 w-6 flex-shrink-0 rounded-full sm:h-7 sm:w-7 md:h-8 md:w-8"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-normal text-[#555555] md:text-base">
                          {document.user?.name ||
                            document.uploaded_by?.name ||
                            "N/A"}
                        </p>
                        <p className="truncate text-xs text-[#A09C9C]">
                          {document.user?.role || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MdOutlineCalendarToday className="h-3 w-3 flex-shrink-0 text-gray-600 sm:h-4 sm:w-4" />
                      <span className="truncate text-xs text-gray-500 sm:text-sm">
                        {(
                          document.uploadDate ||
                          document.upload_date ||
                          document.createdAt ||
                          document.created_at ||
                          "N/A"
                        ).slice(0, 10)}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MdOutlineCalendarToday className="h-3 w-3 flex-shrink-0 text-gray-600 sm:h-4 sm:w-4" />
                      <span className="truncate text-xs text-gray-500 sm:text-sm">
                        {(
                          document.expiryDate ||
                          document.expiry_date ||
                          document.expires_at ||
                          "N/A"
                        ).slice(0, 10)}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
                    <div className="w-full overflow-hidden text-sm md:text-base">
                      {renderStatus(document)}
                    </div>
                  </td>
                  <td className="px-2 py-2 sm:px-4 md:px-5 md:py-2 lg:px-6">
                    <div className="flex items-center gap-3 md:gap-5">
                      <EyeIcon
                        className="h-4 w-4 flex-shrink-0 cursor-pointer text-[#1276F9] transition-colors hover:text-blue-800 sm:h-5 sm:w-5"
                        onClick={() => openModal(document)}
                        title="View Details"
                      />
                      <FaRegTrashAlt
                        className="h-4 w-4 flex-shrink-0 cursor-pointer text-[#555555] transition-colors hover:text-red-600 sm:h-5 sm:w-5"
                        onClick={() =>
                          handleDeleteClick(document.id, documentName)
                        }
                        title="Delete Document"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
          <div className="max-h-[90vh] w-full max-w-[95vw] overflow-y-auto rounded-lg bg-white p-4 text-black/80 shadow-lg sm:max-w-md sm:p-6 md:max-w-lg lg:max-w-xl">
            <div className="mb-4 flex items-center justify-between border-b border-black/20 pb-2">
              <h2 className="text-base font-semibold sm:text-lg">
                Document Details
              </h2>
              <button
                className="text-lg text-gray-500 transition-colors hover:text-gray-700 sm:text-xl"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                <strong className="text-gray-700">Name:</strong>
                <p className="mt-1 break-words">
                  {selectedDoc.user?.name ||
                    selectedDoc.uploaded_by?.name ||
                    "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                <strong className="text-gray-700">Role:</strong>
                <p className="mt-1">{selectedDoc.user?.role || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                <strong className="text-gray-700">Document:</strong>
                <div className="mt-1">
                  {selectedDoc.file || selectedDoc.document_name ? (
                    <a
                      href={selectedDoc.file || selectedDoc.document_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-blue-600 hover:underline"
                    >
                      {selectedDoc.file?.split("/").pop() ||
                        selectedDoc.document_name}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                <strong className="text-gray-700">Type:</strong>
                <p className="mt-1">
                  {selectedDoc.type || selectedDoc.document_type || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                <strong className="text-gray-700">Upload Date:</strong>
                <p className="mt-1">
                  {(
                    selectedDoc.uploadDate ||
                    selectedDoc.upload_date ||
                    selectedDoc.createdAt ||
                    "N/A"
                  ).slice(0, 10)}
                </p>
              </div>
              <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                <strong className="text-gray-700">Expiry Date:</strong>
                <p className="mt-1">
                  {(
                    selectedDoc.expiryDate ||
                    selectedDoc.expiry_date ||
                    selectedDoc.expires_at ||
                    "N/A"
                  ).slice(0, 10)}
                </p>
              </div>
              <div className="flex items-center gap-2 pb-2">
                <strong className="text-gray-700">Status:</strong>
                <div className="mt-1">{renderStatus(selectedDoc)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-center gap-3 pb-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${currentPage === 1 ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Previous
        </button>

        <span className="flex items-center text-sm font-medium text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
