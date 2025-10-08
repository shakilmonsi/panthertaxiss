// import {
//   MdDelete,
//   MdEdit,
//   MdOutlineCalendarToday,
//   MdOutlineGroup,
//   MdOutlineSearch,
// } from "react-icons/md";

// export const UserManagementTable = ({
//   loading,
//   displayedUsers = [], // ✅ default to empty array
//   getAvatar,
//   handleUpdateUser,
//   handleDeleteUser,
//   searchTerm,
// }) => {
//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//       <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative overflow-hidden overflow-x-scroll rounded-xl border border-gray-200 bg-white shadow-md sm:rounded-lg">
//         <style>{`
//           .overflow-x-scroll {
//             scrollbar-width: thin;
//             scrollbar-color: #cbd5e1 #f1f5f9;
//           }
//           .overflow-x-scroll::-webkit-scrollbar {
//             height: 8px;
//           }
//           .overflow-x-scroll::-webkit-scrollbar-track {
//             background: #f1f5f9;
//             border-radius: 4px;
//           }
//           .overflow-x-scroll::-webkit-scrollbar-thumb {
//             background: #cbd5e1;
//             border-radius: 4px;
//           }
//           .overflow-x-scroll::-webkit-scrollbar-thumb:hover {
//             background: #94a3b8;
//           }
//         `}</style>
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
//                 Created
//               </th>
//               <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
//                 Last Login
//               </th>
//               <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
//                     Loading users...
//                   </div>
//                 </td>
//               </tr>
//             ) : displayedUsers.length > 0 ? (
//               displayedUsers.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="transition-colors hover:bg-gray-50"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0">{getAvatar(user)}</div>
//                       <div className="ml-4">
//                         <div className="text-base font-medium text-[#555]">
//                           {user.name}
//                         </div>
//                         <div className="flex items-center gap-1.5 text-sm text-gray-500">
//                           {user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     <span
//                       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
//                         user.role === "Admin"
//                           ? "bg-blue-100 text-blue-800"
//                           : user.role === "User"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     <div className="flex items-center gap-2">
//                       <MdOutlineCalendarToday className="h-4 w-4" />
//                       {user.created}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     <div className="flex items-center gap-2">
//                       <MdOutlineCalendarToday className="h-4 w-4" />
//                       {user.lastLogin}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     <span
//                       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
//                         user.status === "Active"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {user.status === "Active" ? "Subscriber" : "Trialing"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
//                     <div className="flex items-center space-x-4">
//                       <button
//                         onClick={() => handleUpdateUser(user)}
//                         className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
//                         title="Edit user"
//                       >
//                         <MdEdit className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteUser(user)}
//                         className="rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
//                         title="Delete user"
//                       >
//                         <MdDelete className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                   {searchTerm ? (
//                     <div className="flex flex-col items-center gap-2">
//                       <MdOutlineSearch className="h-12 w-12 text-gray-300" />
//                       <p className="text-lg font-medium">No users found</p>
//                       <p className="text-sm text-gray-400">
//                         Try adjusting your search terms or filters
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center gap-2">
//                       <MdOutlineGroup className="h-12 w-12 text-gray-300" />
//                       <p className="text-lg font-medium">No users available</p>
//                       <p className="text-sm text-gray-400">
//                         Add your first user to get started
//                       </p>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };










import {
  MdDelete,
  MdEdit,
  MdOutlineCalendarToday,
  MdOutlineGroup,
  MdOutlineSearch,
} from "react-icons/md";

export const UserManagementTable = ({
  loading,
  displayedUsers = [],
  getAvatar,
  handleUpdateUser,
  handleDeleteUser,
  searchTerm,
  currentPage,
  totalPages,
  totalUsers,
  handleNextPage,
  handlePreviousPage,
  loadMoreLoading,
}) => {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative overflow-hidden overflow-x-scroll rounded-xl border border-gray-200 bg-white shadow-md sm:rounded-lg">
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-base font-[600] tracking-wider text-[#212121] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">{getAvatar(user)}</div>
                        <div className="ml-4">
                          <div className="text-base font-medium text-[#555]">
                            {user.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          user.role === "Admin"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "User"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      <div className="flex items-center gap-2">
                        <MdOutlineCalendarToday className="h-4 w-4" />
                        {user.created}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      <div className="flex items-center gap-2">
                        <MdOutlineCalendarToday className="h-4 w-4" />
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "Active" ? "Subscriber" : "Trialing"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleUpdateUser(user)}
                          className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                          title="Edit user"
                        >
                          <MdEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                          title="Delete user"
                        >
                          <MdDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? (
                      <div className="flex flex-col items-center gap-2">
                        <MdOutlineSearch className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search terms or filters
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <MdOutlineGroup className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium">No users available</p>
                        <p className="text-sm text-gray-400">
                          Add your first user to get started
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIXED: Pagination Controls */}
      {!loading && displayedUsers.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loadMoreLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loadMoreLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadMoreLoading ? "Loading..." : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};
