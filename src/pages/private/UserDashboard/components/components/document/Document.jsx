import { FileText, Search } from "lucide-react";
import { UserDocumentTable } from "../UserDocumentTable";

export const Document = ({
  loading,
  error,
  filteredDocuments,
  searchQuery,
  selected,
  selectedStatus,
  selectedAllStatus,
  clearSearch,
  setSelected,
  setSelectedStatus,
  setSelectedAllStatus,
  doc,
  user,
  handleDeleteClick,
}) => {
  return (
    <div className="mb-9 rounded-lg border border-gray-300 bg-white p-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading documents...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      {/* No Results State */}
      {!loading &&
        !error &&
        filteredDocuments.length === 0 &&
        (searchQuery ||
          selected !== "All Types" ||
          selectedStatus !== "All Status" ||
          selectedAllStatus !== "All Users") && (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No documents found
            </h3>
            <p className="mb-4 max-w-md text-center text-gray-500">
              No documents match your current filters. Try adjusting your search
              or filters.
            </p>
            <button
              onClick={() => {
                clearSearch();
                setSelected("All Types");
                setSelectedStatus("All Status");
                setSelectedAllStatus("All Users");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}

      {/* Empty State when no documents at all */}
      {!loading && !error && doc.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No documents available
          </h3>
          <p className="max-w-md text-center text-gray-500">
            Upload your first document to get started.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredDocuments.length > 0 && (
        <UserDocumentTable
          user={user}
          handleDeleteClick={handleDeleteClick}
          filteredDocuments={filteredDocuments}
        />
      )}
    </div>
  );
};
