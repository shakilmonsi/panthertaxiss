//second last code
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaLink,
  FaChevronDown,
  FaEdit,
  FaTrash,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaTimes,
} from "react-icons/fa";
import { FaArrowDownShortWide } from "react-icons/fa6";
import {
  getData,
  postData,
  updateData,
  deleteData,
} from "../../../utils/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

const UsefulLinksManagement = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [originalLinks, setOriginalLinks] = useState([]);
  const [displayedLinks, setDisplayedLinks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedLinks, setExpandedLinks] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Fetch all links
  const fetchLinks = async () => {
    try {
      const data = await getData("links");
      const linksArray = Array.isArray(data) ? data : data?.data || [];
      setLinks(linksArray);
      setOriginalLinks(linksArray);
      setDisplayedLinks(linksArray.slice(0, visibleCount));
    } catch (error) {
      console.error("Fetch links error:", error);
      toast.error("Failed to fetch links.", { id: "fetch-error" });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Client-side search (title + URL)
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setSearchLoading(true);

        const filteredLinks = originalLinks.filter((link) => {
          const term = searchTerm.toLowerCase();
          return (
            link.title.toLowerCase().includes(term) ||
            link.url.toLowerCase().includes(term)
          );
        });

        setLinks(filteredLinks);
        setDisplayedLinks(filteredLinks.slice(0, visibleCount));
        setSearchError(filteredLinks.length === 0 ? "No links found." : null);
        setSearchLoading(false);
      } else {
        setLinks(originalLinks);
        setDisplayedLinks(originalLinks.slice(0, visibleCount));
        setSearchError(null);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, originalLinks, visibleCount]);

  // Add new link
  const handleAddLink = async () => {
    if (!title.trim() || !url.trim()) {
      toast.error("Please provide both title and URL.");
      return;
    }
    setLoading(true);
    try {
      await postData("links", { title, url });
      toast.success("Link added successfully!");
      setTitle("");
      setUrl("");
      fetchLinks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add link.");
    } finally {
      setLoading(false);
    }
  };

  // Edit link
  const handleOpenEditModal = (link) => {
    setCurrentLink(link);
    setNewTitle(link.title);
    setNewUrl(link.url);
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!currentLink || !newTitle.trim() || !newUrl.trim()) {
      toast.error("Please provide both title and URL.");
      return;
    }
    try {
      await updateData("links", currentLink.id, {
        title: newTitle,
        url: newUrl,
      });
      toast.success("Link updated successfully!");
      setIsEditModalOpen(false);
      fetchLinks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update link.");
    }
  };

  // Delete link
  const handleOpenDeleteModal = (link) => {
    setLinkToDelete(link);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;
    try {
      await deleteData("links", linkToDelete.id);
      toast.success("Link deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchLinks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete link.");
    }
  };

  // Toggle expand URL
  const toggleExpand = (linkId) => {
    setExpandedLinks((prev) => ({
      ...prev,
      [linkId]: !prev[linkId],
    }));
  };

  // Load more
  const loadMore = () => {
    const nextCount = visibleCount + 10;
    setDisplayedLinks(links.slice(0, nextCount));
    setVisibleCount(nextCount);
  };

  // Sort links by title
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedLinks = [...links].sort((a, b) => {
      if (a.title < b.title) return newSortOrder === "asc" ? -1 : 1;
      if (a.title > b.title) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setLinks(sortedLinks);
    setDisplayedLinks(sortedLinks.slice(0, visibleCount));
  };

  return (
    <div className="flex w-full flex-col items-center bg-white px-4 sm:px-6 md:px-8 lg:px-10 sm:pt-3 mb-4 lg:mt-0 md:mt-[64px] mt-[72px]">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Search Bar */}
      <div className="flex w-full max-w-full flex-col gap-6">
        <div className="flex w-full justify-start border-b border-stone-300 py-3">
          <div className="relative flex h-10 w-full items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-1.5 lg:w-[559px]">
            <FaSearch className="text-neutral-600" />
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent font-['Roboto'] text-sm leading-normal font-normal text-neutral-600 outline-none sm:text-base"
              placeholder="Search links by title or URL..."
            />
            {searchLoading && (
              <div className="absolute right-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Link */}
      <div className="mt-6 flex w-full max-w-full flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Useful Links Management
          </h1>
        </div>
        <div className="flex w-full flex-col items-start gap-4 rounded-2xl border border-neutral-300 bg-white p-4 sm:gap-6 sm:p-6 lg:gap-8">
          <h2 className="font-['Roboto'] text-sm leading-normal font-normal text-black sm:text-base">
            Add a New Link
          </h2>
          <div className="flex w-full flex-col items-start gap-4 sm:gap-6">
            <div className="flex w-full flex-col gap-1.5">
              <label className="font-['Segoe UI'] text-xs leading-tight font-normal text-slate-700 sm:text-sm">
                Link Title
              </label>
              <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
                <FaLink className="text-sm text-zinc-400 sm:text-base" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-['Segoe UI'] flex-1 text-sm leading-normal font-normal text-zinc-900 outline-none sm:text-base"
                  placeholder="e.g., Company Website"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <label className="font-['Segoe UI'] text-xs leading-tight font-normal text-slate-700 sm:text-sm">
                URL
              </label>
              <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
                <FaLink className="text-sm text-zinc-400 sm:text-base" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="font-['Segoe UI'] flex-1 text-sm leading-normal font-normal text-zinc-900 outline-none sm:text-base"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleAddLink}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 p-2.5 px-4 text-sm text-white disabled:opacity-50 sm:w-auto sm:px-6 sm:text-base lg:w-36"
          >
            {loading ? "Adding..." : "Add Link"}
          </button>
        </div>

        {/* Links List */}
        <div className="flex w-full flex-col items-start gap-4 rounded-2xl border border-neutral-300 bg-white p-4 sm:gap-6 sm:p-6">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <h2 className="font-['Roboto'] text-sm leading-normal font-[600] text-neutral-600 sm:text-base">
              Current Useful Links (
              <span className="font-[700]">{links.length}</span> total)
            </h2>
            <button
              onClick={handleSort}
              className="flex items-center gap-2 text-[#155DFC] hover:text-blue-800"
            >
              <span className="font-['Roboto'] text-sm leading-normal font-[700] sm:text-base">
                Sort by Title
              </span>
              {sortOrder === "asc" ? (
                <FaSortAlphaDown className="text-sm sm:text-base" />
              ) : (
                <FaSortAlphaUp className="text-sm sm:text-base" />
              )}
            </button>
          </div>

          {displayedLinks.length === 0 ? (
            <div className="flex w-full items-center justify-center py-8">
              <p className="px-4 text-center font-['Roboto'] text-sm text-neutral-500 sm:text-base">
                {searchTerm
                  ? `No links found for "${searchTerm}"`
                  : "No links available. Add your first link above."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop and Large Tablet View */}
              <div className="hidden w-full grid-cols-3 gap-4 lg:grid">
                {/* Header */}
                <div className="bg-neutral-100 p-2.5 font-['Roboto'] font-[600] text-neutral-800">
                  Link Title
                </div>
                <div className="bg-neutral-100 p-2.5 font-['Roboto'] font-[600] text-neutral-800">
                  URL
                </div>
                <div className="bg-neutral-100 p-2.5 font-['Roboto'] font-[600] text-neutral-800">
                  Actions
                </div>

                {/* Data */}
                {displayedLinks.map((link) => (
                  <div key={link.id} className="contents">
                    <div className="border-b border-gray-200 p-2.5 text-[16px] font-normal break-words whitespace-normal text-neutral-600">
                      {link.title}
                    </div>

                    <div className="border-b border-gray-200 p-2.5 text-[16px] font-normal break-words whitespace-normal text-blue-600">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {expandedLinks[link.id] || link.url.length <= 30
                          ? link.url
                          : `${link.url.substring(0, 30)}...`}
                      </a>
                      {link.url.length > 30 && (
                        <button
                          onClick={() => toggleExpand(link.id)}
                          className="ml-2 text-sm text-blue-600 hover:underline"
                        >
                          {expandedLinks[link.id] ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-6 border-b border-gray-200 p-2.5">
                      <button
                        onClick={() => handleOpenEditModal(link)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(link)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile and Medium Device Card View */}
              <div className="w-full space-y-4 lg:hidden">
                {displayedLinks.map((link) => (
                  <div
                    key={link.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    {/* Title */}
                    <div className="mb-3">
                      <h3 className="mb-1 font-['Roboto'] text-sm font-[600] text-neutral-800">
                        Link Title
                      </h3>
                      <p className="text-sm font-normal break-words text-neutral-600">
                        {link.title}
                      </p>
                    </div>

                    {/* URL */}
                    <div className="mb-4">
                      <h3 className="mb-1 font-['Roboto'] text-sm font-[600] text-neutral-800">
                        URL
                      </h3>
                      <div className="text-sm font-normal break-words text-blue-600">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {expandedLinks[link.id] || link.url.length <= 25
                            ? link.url
                            : `${link.url.substring(0, 25)}...`}
                        </a>
                        {link.url.length > 25 && (
                          <button
                            onClick={() => toggleExpand(link.id)}
                            className="ml-2 text-xs text-blue-600 hover:underline"
                          >
                            {expandedLinks[link.id] ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 border-t border-gray-300 pt-3">
                      <button
                        onClick={() => handleOpenEditModal(link)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit className="text-xs" /> Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(link)}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
                      >
                        <FaTrash className="text-xs" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {visibleCount < links.length && (
            <div className="mt-4 flex w-full justify-center">
              <button
                onClick={loadMore}
                className="flex items-center gap-2 rounded-lg border-2 border-blue-800 px-4 py-2 text-sm text-blue-800 hover:bg-[#155DFC] hover:text-white sm:px-6 sm:text-base"
              >
                Load More ({links.length - visibleCount} remaining){" "}
                <FaArrowDownShortWide className="text-sm sm:text-base" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl sm:max-w-md sm:p-6">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                Confirm Deletion
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={18} className="sm:h-5 sm:w-5" />
              </button>
            </div>
            <p className="mb-4 text-center text-xs text-gray-500 sm:mb-6 sm:text-sm">
              Are you sure you want to delete this link? This action cannot be
              undone.
            </p>
            <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="order-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:order-1 sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="order-1 w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 sm:order-2 sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl sm:max-w-lg sm:p-6">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                Edit Link
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={18} className="sm:h-5 sm:w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-700 sm:text-sm">
                  Link Title
                </label>
                <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
                  <FaLink className="text-sm text-zinc-400" />
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 text-sm text-zinc-900 outline-none sm:text-base"
                    placeholder="e.g., Company Website"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-700 sm:text-sm">URL</label>
                <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
                  <FaLink className="text-sm text-zinc-400" />
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 text-sm text-zinc-900 outline-none sm:text-base"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="order-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:order-1 sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleEditConfirm}
                className="order-1 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 sm:order-2 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsefulLinksManagement;
