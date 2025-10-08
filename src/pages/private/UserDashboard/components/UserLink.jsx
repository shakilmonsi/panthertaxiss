import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import { TbWorld } from "react-icons/tb";
import { getData } from "../../../../utils/axiosInstance";
import { useAuth } from "../../../../featured/auth/AuthContext";

export const UserLink = () => {
  const { isAuthenticated } = useAuth();

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Category");
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // const options = [
  //   "All Users",
  //   "Payments",
  //   "Compliance",
  //   "Dispute Resolution",
  //   "Industry Guides",
  //   "Resources",
  // ];

  // Fetch links
  useEffect(() => {
    const fetchLinks = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const data = await getData("links");
        setLinks(data);
      } catch (err) {
        console.error("Failed to fetch links:", err);
        setError("Failed to load links data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [isAuthenticated]);

  // Filtered links (useMemo to avoid unnecessary recalculation)
  const filteredLinks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return links.filter(
      (link) =>
        link.title?.toLowerCase().includes(query) ||
        link.description?.toLowerCase().includes(query) ||
        link.url?.toLowerCase().includes(query),
    );
  }, [links, searchQuery]);

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

  const currentPageData = filteredLinks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="mt-[65px] min-h-screen w-full bg-white p-6 md:p-8 lg:mt-0 lg:p-10">
      {/* Header */}
      <div>
        <h1 className="font-['Roboto'] text-xl font-bold text-[#212121] md:text-2xl">
          Useful Links Management
        </h1>
        <p className="my-1.5 text-base font-normal text-black/90">
          Curate helpful resources and guides for your users
        </p>
      </div>

      {/* Search + Dropdown */}
      <div className="mb-6 flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-lg flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-neutral-600" />
            <input
              type="text"
              placeholder="Search links, descriptions, or URLs..."
              className="h-10 w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-10 font-['Roboto'] text-base text-neutral-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // reset page on search
              }}
            />
          </div>
        </div>

        {/* <div className="relative w-full lg:w-52">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 font-['Segoe_UI'] text-base font-medium text-gray-500 shadow-sm"
          >
            {selected}
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-zinc-500 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500 transition-transform duration-200" />
            )}
          </button>

          {isOpen && (
            <ul className="absolute z-10 mt-2 w-full rounded-lg bg-white shadow-lg">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-blue-50"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div> */}
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-500">Loading links...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="rounded-lg border border-gray-300 p-6">
          <div>
            <h3 className="font-['Roboto'] text-base font-semibold text-[#212121]">
              All Useful Links
            </h3>
            <p className="mt-1.5 text-sm font-normal text-gray-600">
              {filteredLinks.length} of {links.length} links
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-white shadow-sm">
            <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-gray-700">
                <thead>
                  <tr className="bg-[#FDFCFC] text-left">
                    <th className="w-1/2 max-w-xs px-4 py-2 text-base font-semibold text-neutral-800">
                      Link Information
                    </th>
                    <th className="w-1/6 px-4 py-2 text-base font-semibold text-neutral-800">
                      Created At
                    </th>
                    <th className="w-1/6 px-4 py-2 text-base font-semibold text-neutral-800">
                      Last Updated
                    </th>
                    <th className="w-1/6 px-4 py-2 text-base font-semibold text-neutral-800">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentPageData.map((link, idx) => (
                    <tr key={idx} className="border-b-2 border-gray-100">
                      <td className="w-1/2 max-w-xs px-4 py-2">
                        <div className="flex items-start gap-3">
                          <div className="my-auto flex-shrink-0 rounded-sm bg-[#BDDAFF] p-1.5">
                            <TbWorld className="h-6 w-6 text-[#0259C9]" />
                          </div>
                          <div className="min-w-0 flex-1 text-[#555555]">
                            <h2 className="mb-1 truncate text-base leading-tight font-bold">
                              {link.title.slice(0, 50)}
                            </h2>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mb-1 block truncate text-sm leading-tight hover:underline"
                            >
                              {link.url.slice(-50)}
                            </a>
                            <p
                              className="truncate text-[12px] leading-tight font-normal"
                              title={link.description}
                            >
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="w-1/6 px-4 py-2">
                        <div className="flex items-center gap-2 text-[13px]">
                          <MdOutlineCalendarToday className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span className="whitespace-nowrap">
                            {link.createdAt
                              ? new Date(link.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "2-digit",
                                  },
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="w-1/6 px-4 py-2">
                        <div className="flex items-center gap-2 text-[13px]">
                          <MdOutlineCalendarToday className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span className="whitespace-nowrap">
                            {link.updatedAt
                              ? new Date(link.updatedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "2-digit",
                                  },
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="w-1/6 px-4 py-2">
                        <div className="ml-3 flex md:ml-6">
                          <button
                            onClick={() => {
                              setSelectedLink(link);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-[#1276F9] hover:text-blue-800"
                            title="View Details"
                          >
                            <AiOutlineEye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                page === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            <span className="flex items-center text-sm font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                page === totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedLink && (
        <Modal
          report={selectedLink}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLink(null);
          }}
        />
      )}
    </div>
  );
};

const Modal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative mx-auto max-h-[90vh] w-full max-w-lg scale-95 transform overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 pb-2 shadow-xl transition-all duration-300 ease-in-out">
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-black">
          Link Details
        </h3>

        <p className="mb-2 border-b border-gray-200 pb-2 text-black">
          <strong>Title:</strong> {report.title}
        </p>
        <p className="mb-2 border-b border-gray-200 pb-2 break-words text-black">
          <strong>URL:</strong> {report.url}
        </p>
        <p className="mb-2 border-b border-gray-200 pb-2 text-black">
          <strong>Last Updated:</strong>{" "}
          {report.updatedAt
            ? new Date(report.updatedAt).toLocaleDateString("en-US")
            : "N/A"}
        </p>
        <p className="mb-2 border-b border-gray-200 pb-2 text-black">
          <strong>Created At:</strong>{" "}
          {report.createdAt
            ? new Date(report.createdAt).toLocaleDateString("en-US")
            : "N/A"}
        </p>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
