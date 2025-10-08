// import { useState, useEffect, useContext } from "react";
// import {
//   MdOutlineSearch,
//   MdOutlineGroup,
//   MdAdd,
//   MdOutlineDashboard,
//   MdOutlinePerson,
//   MdInfoOutline,
//   MdCheckCircleOutline,
//   MdClose,
//   MdWarning,
// } from "react-icons/md";

// import { getData, updateData, deleteData } from "../../../utils/axiosInstance";
// import { AuthContext } from "../../../featured/auth/AuthContext";
// import AddUserForm from "./AddUserForm/AddUserForm";
// import { UserManagementTable } from "./UserManagementTable";
// import toast from "react-hot-toast";

// // Clean delete API function
// const deleteUserAPI = async (userId) => {
//   try {
//     const response = await deleteData("user/delete", userId);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Update User Modal Component
// const UpdateUserModal = ({ user, isOpen, onClose, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     name: user?.name || "",
//     email: user?.email || "",
//     role: user?.rawRole || "USER",
//     companyName: user?.companyName || "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         role: user.rawRole || "USER",
//         companyName: user.companyName || "",
//       });
//     }
//   }, [user]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     if (!formData.email.includes("@"))
//       newErrors.email = "Valid email is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       const updatePayload = {
//         name: formData.name.trim(),
//         role: formData.role,
//         companyName: formData.companyName.trim(),
//       };

//       const response = await updateData(
//         "user/updateUser",
//         user.id,
//         updatePayload,
//       );

//       if (response && response.success === true) {
//         onUpdate();
//         onClose();
//         toast("User updated successfully!");
//       } else {
//         setErrors({
//           general: "Update failed. Please try again.",
//         });
//       }
//     } catch (error) {
//       console.error("Update failed:", error);
//       setErrors({ general: "Failed to update user. Please try again." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center px-4 py-5 backdrop-blur-sm sm:px-6 md:px-8 lg:px-10">
//       <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
//         <div className="flex items-center justify-between border-b p-6">
//           <h3 className="text-lg font-semibold text-gray-900">Update User</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 transition-colors hover:text-gray-600"
//           >
//             <MdClose className="h-6 w-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4 p-6">
//           {errors.general && (
//             <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {errors.general}
//             </div>
//           )}

//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               Name *
//             </label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               }`}
//               placeholder="Enter user name"
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-500">{errors.name}</p>
//             )}
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               Email (Cannot be updated)
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               disabled
//               className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
//             />
//             <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
//               <MdWarning className="h-3 w-3" />
//               Email cannot be changed for security reasons
//             </p>
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               Role
//             </label>
//             <select
//               value={formData.role}
//               onChange={(e) =>
//                 setFormData({ ...formData, role: e.target.value })
//               }
//               className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             >
//               <option value="USER">User</option>
//               <option value="ADMIN">Admin</option>
//               <option value="VIEWER">Viewer</option>
//             </select>
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               Company Name
//             </label>
//             <input
//               type="text"
//               value={formData.companyName}
//               onChange={(e) =>
//                 setFormData({ ...formData, companyName: e.target.value })
//               }
//               className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               placeholder="Enter company name"
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
//             >
//               {isLoading ? "Updating..." : "Update User"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Delete Confirmation Modal
// const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleDelete = async () => {
//     if (!user?.id) {
//       toast("Error: User ID not found.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await deleteUserAPI(user.id);

//       // Check for success - handle different response formats
//       const isSuccess =
//         response?.success === true ||
//         (response?.message &&
//           typeof response.message === "string" &&
//           response.message.toLowerCase().includes("successfully"));

//       if (isSuccess) {
//         onConfirm();
//         onClose();

//         setTimeout(() => {
//           toast(`User "${user.name}" has been deleted successfully!`);
//         }, 200);
//       } else {
//         const errorMsg =
//           typeof response === "string"
//             ? response
//             : response?.message || "Delete operation failed";
//         throw new Error(errorMsg);
//       }
//     } catch (error) {
//       console.error("Delete failed:", error);

//       let errorMessage = "Failed to delete user";

//       // Handle different error types
//       if (error.response?.data) {
//         if (typeof error.response.data === "string") {
//           errorMessage = error.response.data;
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message;
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       setError(errorMessage);
//       toast(`Delete Failed: ${errorMessage}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//       <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
//         <div className="p-6">
//           <div className="flex items-center gap-4">
//             <div className="flex-shrink-0">
//               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
//                 <MdWarning className="h-6 w-6 text-red-600" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <h3 className="mb-2 text-lg font-semibold text-gray-900">
//                 Delete User
//               </h3>
//               <p className="text-gray-600">
//                 Are you sure you want to delete{" "}
//                 <strong>"{user?.name || "this user"}"</strong>? This action
//                 cannot be undone and will permanently remove all user data.
//               </p>
//             </div>
//           </div>

//           {error && (
//             <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {error}
//             </div>
//           )}
//         </div>

//         <div className="flex gap-3 bg-gray-50 px-6 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isLoading}
//             className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleDelete}
//             disabled={isLoading}
//             className="flex-1 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                 Deleting...
//               </div>
//             ) : (
//               "Delete User"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const UserManagement = () => {
//   const { isAuthenticated } = useContext(AuthContext);
//   const [allUsers, setAllUsers] = useState([]);
//   const [displayedUsers, setDisplayedUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRole, setSelectedRole] = useState("All Role");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchError, setSearchError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [loadMoreLoading, setLoadMoreLoading] = useState(false);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const usersPerPage = 10;

//   // Modal states
//   const [updateModalOpen, setUpdateModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Enhanced fetch users with proper data handling
//   const fetchUsers = async (page = 1, search = "", reset = false) => {
//     if (!isAuthenticated) return;

//     const isInitialLoad = page === 1 && reset;
//     const isLoadMore = page > 1;

//     if (isInitialLoad) {
//       setLoading(true);
//       setCurrentPage(1);
//       setAllUsers([]);
//       setDisplayedUsers([]);
//     } else if (isLoadMore) {
//       setLoadMoreLoading(true);
//     } else {
//       setSearchLoading(true);
//     }

//     setSearchError(null);

//     try {
//       let endpoint = `user?page=${page}&limit=${usersPerPage}`;

//       if (search && search.trim()) {
//         endpoint = `user/user-search/${encodeURIComponent(search.trim())}?page=${page}&limit=${usersPerPage}`;
//       }

//       const response = await getData(endpoint);

//       // Safe data extraction
//       const users = Array.isArray(response?.data?.users)
//         ? response.data.users
//         : [];
//       const paginationData = response?.data?.pagination || null;

//       if (users.length >= 0) {
//         const mappedUsers = users.map((user) => {
//           // Safe property access with fallbacks
//           const safeName = user?.name || "Unknown User";
//           const safeEmail = user?.email || "No Email";
//           const safeRole = user?.role || "USER";
//           const safeCompanyName = user?.companyName || "";
//           const safeId = user?.id || user?._id || Math.random().toString(36);

//           return {
//             id: safeId,
//             name: safeName,
//             email: safeEmail,
//             role:
//               safeRole === "ADMIN"
//                 ? "Admin"
//                 : safeRole === "USER"
//                   ? "User"
//                   : "Viewer",
//             created: user?.createdAt
//               ? new Date(user.createdAt).toLocaleDateString()
//               : "N/A",
//             lastLogin: user?.lastLogin
//               ? new Date(user.lastLogin).toLocaleDateString()
//               : "Never",
//             status:
//               user?.subscription?.status === "active" ? "Active" : "Inactive",
//             companyName: safeCompanyName,
//             profile_pic: user?.profile_pic || null,
//             subscription: user?.subscription || null,
//             rawRole: safeRole,
//           };
//         });

//         if (isInitialLoad || !isLoadMore) {
//           setAllUsers(mappedUsers);
//           setDisplayedUsers(mappedUsers);
//           setCurrentPage(page);
//         } else {
//           setAllUsers((prev) => [...prev, ...mappedUsers]);
//           setDisplayedUsers((prev) => [...prev, ...mappedUsers]);
//           setCurrentPage(page);
//         }

//         // Update pagination info safely
//         const totalCount =
//           paginationData?.total ||
//           paginationData?.totalUsers ||
//           mappedUsers.length;
//         const totalPages =
//           paginationData?.pages ||
//           paginationData?.totalPages ||
//           Math.ceil(totalCount / usersPerPage);
//         const hasMorePages =
//           page < totalPages && mappedUsers.length === usersPerPage;

//         setTotalUsers(totalCount);
//         setHasMore(hasMorePages);
//       } else {
//         if (isInitialLoad) {
//           setAllUsers([]);
//           setDisplayedUsers([]);
//         }
//         setHasMore(false);
//         setTotalUsers(0);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setSearchError("Failed to fetch users data.");
//       if (isInitialLoad) {
//         setAllUsers([]);
//         setDisplayedUsers([]);
//       }
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//       setSearchLoading(false);
//       setLoadMoreLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchUsers(1, "", true);
//   }, [isAuthenticated]);

//   // Search with debounce
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchUsers(1, searchTerm, true);
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm]);

//   // Role filter effect
//   useEffect(() => {
//     if (selectedRole !== "All Role") {
//       const filtered = allUsers.filter((user) => user.role === selectedRole);
//       setDisplayedUsers(filtered);
//       setHasMore(false);
//     } else {
//       setDisplayedUsers(allUsers);
//       const shouldHaveMore =
//         allUsers.length >= usersPerPage && allUsers.length < totalUsers;
//       setHasMore(shouldHaveMore);
//     }
//   }, [selectedRole, allUsers, totalUsers]);

//   // Load more handler
//   const handleLoadMore = () => {
//     if (hasMore && !loadMoreLoading && selectedRole === "All Role") {
//       const nextPage = currentPage + 1;
//       fetchUsers(nextPage, searchTerm, false);
//     }
//   };

//   // Update user handler
//   const handleUpdateUser = (user) => {
//     setSelectedUser(user);
//     setUpdateModalOpen(true);
//   };

//   // Delete user handler
//   const handleDeleteUser = (user) => {
//     setSelectedUser(user);
//     setDeleteModalOpen(true);
//   };

//   // Refresh data after update/delete
//   const refreshData = () => {
//     fetchUsers(1, searchTerm, true);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     if (!displayedUsers || displayedUsers.length === 0) {
//       toast("No user data to export!");
//       return;
//     }

//     const headers = [
//       "Name",
//       "Email",
//       "Role",
//       "Created",
//       "Last Login",
//       "Status",
//       "Company Name",
//     ];
//     const rows = displayedUsers.map((user) => [
//       user.name,
//       user.email,
//       user.role,
//       user.created,
//       user.lastLogin,
//       user.status,
//       user.companyName || "N/A",
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `user_data_${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Calculate statistics safely
//   const subscriberUsers = displayedUsers.filter(
//     (user) => user.status === "Active",
//   ).length;
//   const trialingUsers = displayedUsers.filter(
//     (user) => user.status === "Inactive",
//   ).length;
//   const administrators = displayedUsers.filter(
//     (user) => user.role === "Admin",
//   ).length;

//   // Safe avatar function
//   const getAvatar = (user) => {
//     if (user.profile_pic) {
//       return (
//         <img
//           className="h-10 w-10 rounded-full object-cover"
//           src={user.profile_pic}
//           alt={`${user.name}'s profile`}
//           onError={(e) => {
//             e.target.style.display = "none";
//             e.target.nextSibling.style.display = "flex";
//           }}
//         />
//       );
//     }

//     const initials = user.name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//     const colors = [
//       "bg-blue-500 text-white",
//       "bg-green-500 text-white",
//       "bg-yellow-500 text-white",
//       "bg-purple-500 text-white",
//       "bg-pink-500 text-white",
//       "bg-indigo-500 text-white",
//     ];
//     const color = colors[user.name.charCodeAt(0) % colors.length];

//     return (
//       <div
//         className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${color}`}
//       >
//         {initials}
//       </div>
//     );
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleRoleChange = (e) => {
//     const value = e.target.value;
//     setSelectedRole(value);
//   };

//   const roles = [
//     "All Role",
//     ...Array.from(new Set(allUsers.map((user) => user.role))),
//   ];

//   return (
//     <div className="flex w-full flex-col bg-gray-50 px-4 font-sans text-gray-900 sm:px-0">
//       {/* Modals */}
//       <UpdateUserModal
//         user={selectedUser}
//         isOpen={updateModalOpen}
//         onClose={() => {
//           setUpdateModalOpen(false);
//           setSelectedUser(null);
//         }}
//         onUpdate={refreshData}
//       />

//       <DeleteConfirmModal
//         user={selectedUser}
//         isOpen={deleteModalOpen}
//         onClose={() => {
//           setDeleteModalOpen(false);
//           setSelectedUser(null);
//         }}
//         onConfirm={refreshData}
//       />

//       {/* Add User Modal */}
//       {isModalOpen && (
//         <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300">
//           <div className="relative max-h-full transform overflow-y-auto transition-transform duration-300">
//             <AddUserForm
//               onClose={() => setIsModalOpen(false)}
//               onUserAdded={refreshData}
//             />
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <header className="mt-[64px] flex max-w-full flex-col items-center justify-between border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:mt-0 sm:flex-row sm:px-10 md:mt-[64px] lg:mt-0">
//         <div className="mb-4 flex w-full flex-col items-center gap-4 sm:mb-0 sm:w-auto sm:flex-row">
//           <div className="relative w-full sm:w-72">
//             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base">
//               <MdOutlineSearch className="h-5 w-5 text-base text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Search users by name or email"
//               className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
//             />
//             {searchLoading && (
//               <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
//               </div>
//             )}
//           </div>

//           <div className="relative w-full sm:w-auto">
//             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//               <MdOutlinePerson className="h-5 w-5 text-gray-600" />
//             </div>
//             <select
//               value={selectedRole}
//               onChange={handleRoleChange}
//               className="w-full appearance-none rounded-md border border-gray-500 bg-white py-2 pr-8 pl-10 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
//             >
//               {roles.map((roleName, idx) => (
//                 <option key={idx} value={roleName}>
//                   {roleName}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <svg
//                 className="h-4 w-4 fill-current"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex w-full items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
//         >
//           <MdAdd className="h-5 w-5" />
//           Add User
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="mx-auto w-full px-1 py-3 sm:py-5 md:px-10">
//         <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
//           <div className="mb-4 sm:mb-0">
//             <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:mt-0">
//               User Management
//             </h1>
//             <p className="mt-1 text-gray-500">
//               Manage your team members and their permissions
//             </p>
//           </div>
//           <button
//             onClick={exportToCSV}
//             className="rounded-lg border border-gray-300 bg-blue-600  px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none"
//           >
//             Export CSV
//           </button>
//         </div>

//         {searchError && (
//           <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
//             <div className="text-sm text-red-700">{searchError}</div>
//           </div>
//         )}

//         {/* Stat Cards */}
//         <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="mt-1 text-[32px] font-[600] text-blue-600">
//                 {totalUsers || 0}
//               </p>
//             </div>
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
//               <MdOutlineGroup className="h-6 w-6" />
//             </div>
//           </div>

//           <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//             <div>
//               <p className="text-base text-black font-normal">Subscriber User</p>
//               <p className="mt-1 text-[32px] font-[700] text-green-600">
//                 {subscriberUsers}
//               </p>
//             </div>
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
//               <MdCheckCircleOutline className="h-6 w-6" />
//             </div>
//           </div>

//           <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//             <div>
//               <p className="text-base text-black font-normal">Inactive Users</p>
//               <p className="mt-1 text-[32px] font-[700] text-yellow-500">
//                 {trialingUsers}
//               </p>
//             </div>
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
//               <MdInfoOutline className="h-6 w-6" />
//             </div>
//           </div>

//           <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//             <div>
//               <p className="text-base text-black font-normal">Administrators</p>
//               <p className="mt-1 text-[32px] font-[600] text-blue-600">
//                 {administrators}
//               </p>
//             </div>
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
//               <MdOutlineDashboard className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         <UserManagementTable
//           loading={loading}
//           displayedUsers={displayedUsers}
//           getAvatar={getAvatar}
//           handleUpdateUser={handleUpdateUser}
//           handleDeleteUser={handleDeleteUser}
//           searchTerm={searchTerm}
//           hasMore={hasMore}
//           totalUsers={totalUsers}
//           handleLoadMore={handleLoadMore}
//           loadMoreLoading={loadMoreLoading}
//         />
//       </main>
//     </div>
//   );
// };
// export default UserManagement;















import { useState, useEffect, useContext } from "react";
import {
  MdOutlineSearch,
  MdOutlineGroup,
  MdAdd,
  MdOutlineDashboard,
  MdOutlinePerson,
  MdInfoOutline,
  MdCheckCircleOutline,
  MdClose,
  MdWarning,
} from "react-icons/md";

import { getData, updateData, deleteData } from "../../../utils/axiosInstance";
import { AuthContext } from "../../../featured/auth/AuthContext";
import AddUserForm from "./AddUserForm/AddUserForm";
import { UserManagementTable } from "./UserManagementTable";
import toast from "react-hot-toast";

const deleteUserAPI = async (userId) => {
  try {
    const response = await deleteData("user/delete", userId);
    return response;
  } catch (error) {
    throw error;
  }
};

const UpdateUserModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.rawRole || "USER",
    companyName: user?.companyName || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.rawRole || "USER",
        companyName: user.companyName || "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatePayload = {
        name: formData.name.trim(),
        role: formData.role,
        companyName: formData.companyName.trim(),
      };

      const response = await updateData(
        "user/updateUser",
        user.id,
        updatePayload,
      );

      if (response && response.success === true) {
        onUpdate();
        onClose();
        toast("User updated successfully!");
      } else {
        setErrors({
          general: "Update failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      setErrors({ general: "Failed to update user. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center px-4 py-5 backdrop-blur-sm sm:px-6 md:px-8 lg:px-10">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-lg font-semibold text-gray-900">Update User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {errors.general && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter user name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email (Cannot be updated)
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />
            <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
              <MdWarning className="h-3 w-3" />
              Email cannot be changed for security reasons
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter company name"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!user?.id) {
      toast("Error: User ID not found.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await deleteUserAPI(user.id);

      const isSuccess =
        response?.success === true ||
        (response?.message &&
          typeof response.message === "string" &&
          response.message.toLowerCase().includes("successfully"));

      if (isSuccess) {
        onConfirm();
        onClose();

        setTimeout(() => {
          toast(`User "${user.name}" has been deleted successfully!`);
        }, 200);
      } else {
        const errorMsg =
          typeof response === "string"
            ? response
            : response?.message || "Delete operation failed";
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Delete failed:", error);

      let errorMessage = "Failed to delete user";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast(`Delete Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <MdWarning className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Delete User
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <strong>"{user?.name || "this user"}"</strong>? This action
                cannot be undone and will permanently remove all user data.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </div>
            ) : (
              "Delete User"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  const [allUsersFromAPI, setAllUsersFromAPI] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Role");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchAllUsers = async (search = "") => {
    if (!isAuthenticated) return;

    setLoading(true);
    setSearchError(null);

    try {
      let endpoint = `user?page=1&limit=1000`;

      if (search && search.trim()) {
        endpoint = `user/user-search/${encodeURIComponent(search.trim())}?page=1&limit=1000`;
      }

      const response = await getData(endpoint);

      const users = Array.isArray(response?.data?.users)
        ? response.data.users
        : [];

      const mappedUsers = users.map((user) => {
        const safeName = user?.name || "Unknown User";
        const safeEmail = user?.email || "No Email";
        const safeRole = user?.role || "USER";
        const safeCompanyName = user?.companyName || "";
        const safeId = user?.id || user?._id || Math.random().toString(36);

        return {
          id: safeId,
          name: safeName,
          email: safeEmail,
          role:
            safeRole === "ADMIN"
              ? "Admin"
              : safeRole === "USER"
                ? "User"
                : "Viewer",
          created: user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A",
          lastLogin: user?.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : "Never",
          status:
            user?.subscription?.status === "active" ? "Active" : "Inactive",
          companyName: safeCompanyName,
          profile_pic: user?.profile_pic || null,
          subscription: user?.subscription || null,
          rawRole: safeRole,
        };
      });

      setAllUsersFromAPI(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSearchError("Failed to fetch users data.");
      setAllUsersFromAPI([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allUsersFromAPI];

    if (selectedRole !== "All Role") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    setDisplayedUsers(paginatedUsers);
    return filtered.length;
  };

  useEffect(() => {
    fetchAllUsers("");
  }, [isAuthenticated]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
      fetchAllUsers(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [selectedRole, currentPage, allUsersFromAPI]);

  const totalFilteredUsers = (() => {
    let filtered = [...allUsersFromAPI];
    if (selectedRole !== "All Role") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }
    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }
    return filtered.length;
  })();

  const totalPages = Math.ceil(totalFilteredUsers / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const refreshData = () => {
    fetchAllUsers(searchTerm);
  };

  const exportToCSV = () => {
    if (!displayedUsers || displayedUsers.length === 0) {
      toast("No user data to export!");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Role",
      "Created",
      "Last Login",
      "Status",
      "Company Name",
    ];
    const rows = displayedUsers.map((user) => [
      user.name,
      user.email,
      user.role,
      user.created,
      user.lastLogin,
      user.status,
      user.companyName || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `user_data_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalUsers = allUsersFromAPI.length;
  const subscriberUsers = allUsersFromAPI.filter(
    (user) => user.status === "Active"
  ).length;
  const trialingUsers = allUsersFromAPI.filter(
    (user) => user.status === "Inactive"
  ).length;
  const administrators = allUsersFromAPI.filter(
    (user) => user.role === "Admin"
  ).length;

  const getAvatar = (user) => {
    if (user.profile_pic) {
      return (
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={user.profile_pic}
          alt={`${user.name}'s profile`}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }

    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const colors = [
      "bg-blue-500 text-white",
      "bg-green-500 text-white",
      "bg-yellow-500 text-white",
      "bg-purple-500 text-white",
      "bg-pink-500 text-white",
      "bg-indigo-500 text-white",
    ];
    const color = colors[user.name.charCodeAt(0) % colors.length];

    return (
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${color}`}
      >
        {initials}
      </div>
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setSelectedRole(value);
    setCurrentPage(1);
  };

  const roles = ["All Role", "Admin", "User"];

  return (
    <div className="flex w-full flex-col bg-gray-50 px-4 font-sans text-gray-900 sm:px-0">
      <UpdateUserModal
        user={selectedUser}
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdate={refreshData}
      />

      <DeleteConfirmModal
        user={selectedUser}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={refreshData}
      />

      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300">
          <div className="relative max-h-full transform overflow-y-auto transition-transform duration-300">
            <AddUserForm
              onClose={() => setIsModalOpen(false)}
              onUserAdded={refreshData}
            />
          </div>
        </div>
      )}

      <header className="mt-[64px] flex max-w-full flex-col items-center justify-between border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:mt-0 sm:flex-row sm:px-10 md:mt-[64px] lg:mt-0">
        <div className="mb-4 flex w-full flex-col items-center gap-4 sm:mb-0 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base">
              <MdOutlineSearch className="h-5 w-5 text-base text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users by name or email"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            {searchLoading && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>

          <div className="relative w-full sm:w-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MdOutlinePerson className="h-5 w-5 text-gray-600" />
            </div>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full appearance-none rounded-md border border-gray-500 bg-white py-2 pr-8 pl-10 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {roles.map((roleName, idx) => (
                <option key={idx} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
        >
          <MdAdd className="h-5 w-5" />
          Add User
        </button>
      </header>

      <main className="mx-auto w-full px-1 py-3 sm:py-5 md:px-10">
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 sm:mb-0">
            <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:mt-0">
              User Management
            </h1>
            <p className="mt-1 text-gray-500">
              Manage your team members and their permissions
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="rounded-lg border border-gray-300 bg-blue-600  px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none"
          >
            Export CSV
          </button>
        </div>

        {searchError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
            <div className="text-sm text-red-700">{searchError}</div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="mt-1 text-[32px] font-[600] text-blue-600">
                {totalUsers || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <MdOutlineGroup className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-base text-black font-normal">Subscriber User</p>
              <p className="mt-1 text-[32px] font-[700] text-green-600">
                {subscriberUsers}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <MdCheckCircleOutline className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-base text-black font-normal">Inactive Users</p>
              <p className="mt-1 text-[32px] font-[700] text-yellow-500">
                {trialingUsers}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <MdInfoOutline className="h-6 w-6" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-base text-black font-normal">Administrators</p>
              <p className="mt-1 text-[32px] font-[600] text-blue-600">
                {administrators}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <MdOutlineDashboard className="h-6 w-6" />
            </div>
          </div>
        </div>

        <UserManagementTable
          loading={loading}
          displayedUsers={displayedUsers}
          getAvatar={getAvatar}
          handleUpdateUser={handleUpdateUser}
          handleDeleteUser={handleDeleteUser}
          searchTerm={searchTerm}
          currentPage={currentPage}
          totalPages={totalPages}
          totalUsers={totalFilteredUsers}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          loadMoreLoading={false}
        />
      </main>
    </div>
  );
};

export default UserManagement;