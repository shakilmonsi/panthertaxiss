// src/pages/TracksPage.jsx
import { useState, useContext } from "react"; // useContext import করুন
import { FaShareAlt } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";

import TracksPageHeroSection from "../../../components/TracksPageHeroSection/TracksPageHeroSection";
import { CartContext } from "../../../utils/CartContextDefinition";

// প্রতিটি ট্র্যাকের একটি 'price' প্রপার্টি থাকা জরুরি
const tracks = [
  {
    id: 1,
    title: "NOLSTAGIA",
    time: "2:45",
    bpm: "103",
    tags: ["Afrobeat", "Happy"],
    thumbnail: "/shoppingcart/cart5.jpg",
    price: 30.0,
  },
  {
    id: 2,
    title: "Melody Magic",
    time: "3:10",
    bpm: "120",
    tags: ["Electronic", "Energetic"],
    thumbnail: "/shoppingcart/cart6.jpg",
    price: 25.0,
  },
  {
    id: 3,
    title: "Chill Vibes",
    time: "4:00",
    bpm: "90",
    tags: ["Jazz", "Chill"],
    thumbnail: "/shoppingcart/cart7.jpg",
    price: 35.0,
  },
  {
    id: 4,
    title: "Groovy Beat",
    time: "2:50",
    bpm: "110",
    tags: ["Hip-hop", "Inspiring"],
    thumbnail: "/shoppingcart/cart1.jpg",
    price: 28.0,
  },
  // আরও ট্র্যাক যোগ করুন
];

const TracksPage = () => {
  // CartContext থেকে addToCart ফাংশনটি নিন
  const { addToCart } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [selectedBpm, setSelectedBpm] = useState("All Bpm");
  const [selectedMoods, setSelectedMoods] = useState("All Moods");
  const [selectedGenres, setSelectedGenres] = useState("All Genres");
  const [selectedSortOption, setSelectedSortOption] = useState("Default");
  const [selectedListView, setSelectedListView] = useState("Default List");

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isBpmDropdownOpen, setIsBpmDropdownOpen] = useState(false);
  const [isMoodsDropdownOpen, setIsMoodsDropdownOpen] = useState(false);
  const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isListViewDropdownOpen, setIsListViewDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    console.log("Searching for: ", searchTerm);
  };

  const handleDropdownChange = (e, setSelectedValue, setDropdownOpenState) => {
    setSelectedValue(e.target.value);
    // Native select এর জন্য এটি প্রয়োজন নেই কারণ ব্রাউজার নিজে বন্ধ করে।
    // কাস্টম ড্রপডাউন বানালে এটি ব্যবহার করতে পারেন।
    // setDropdownOpenState(false);
  };

  const toggleDropdown = (setDropdownOpenState) => {
    setDropdownOpenState((prevState) => !prevState);
  };

  // Add to Cart handler
  const handleAddToCart = (track) => {
    addToCart(track); // Context থেকে প্রাপ্ত addToCart ফাংশন কল করুন
    alert(`${track.title} added to cart!`); // ইউজারকে জানানোর জন্য একটি simple alert
  };

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch = track.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Category" ||
      track.tags.includes(selectedCategory);

    const matchesBpm =
      selectedBpm === "All Bpm" || track.bpm === selectedBpm.split(" ")[0];

    const matchesMood =
      selectedMoods === "All Moods" ||
      track.tags.some(
        (tag) => tag.toLowerCase() === selectedMoods.toLowerCase(),
      );

    const matchesGenre =
      selectedGenres === "All Genres" ||
      track.tags.some(
        (tag) => tag.toLowerCase() === selectedGenres.toLowerCase(),
      );

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBpm &&
      matchesMood &&
      matchesGenre
    );
  });

  return (
    <div
      className="min-h-screen bg-neutral-900 px-[11px] py-10 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(180deg, #050306 0%, #5D006D 100%)",
      }}
    >
      <div className="">
        <TracksPageHeroSection />
      </div>
      <div className="">
        <div className="flex justify-center pb-6 text-2xl font-[600] text-white capitalize md:text-3xl lg:pt-8 lg:text-4xl">
          Tracks
        </div>
        <div className="mx-auto max-w-[950px] rounded-md bg-white/5 p-4 md:p-6">
          <div className="mx-auto mb-6 flex flex-wrap justify-center gap-2 md:gap-10">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) =>
                  handleDropdownChange(
                    e,
                    setSelectedCategory,
                    setIsCategoryDropdownOpen,
                  )
                }
                className="appearance-none rounded-md bg-white px-2 py-1 pr-6 text-sm text-black md:py-2 md:pr-8 md:text-[16px]"
                onClick={() => toggleDropdown(setIsCategoryDropdownOpen)}
              >
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  All Category
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Afrobeat
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Electronic
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Hip-hop
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2">
                {isCategoryDropdownOpen ? (
                  <FiChevronUp className="text-base text-black md:text-xl" />
                ) : (
                  <FiChevronDown className="text-base text-black md:text-xl" />
                )}
              </div>
            </div>
            {/* BPM Dropdown */}
            <div className="relative">
              <select
                value={selectedBpm}
                onChange={(e) =>
                  handleDropdownChange(e, setSelectedBpm, setIsBpmDropdownOpen)
                }
                className="appearance-none rounded-md bg-white px-2 py-1 pr-6 pl-2 text-sm text-black md:py-2 md:pr-8 md:text-[16px]"
                onClick={() => toggleDropdown(setIsBpmDropdownOpen)}
              >
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  All Bpm
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  103 BPM
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  120 BPM
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  140 BPM
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2">
                {isBpmDropdownOpen ? (
                  <FiChevronUp className="text-base text-black md:text-xl" />
                ) : (
                  <FiChevronDown className="text-base text-black md:text-xl" />
                )}
              </div>
            </div>
            {/* Moods Dropdown */}
            <div className="relative">
              <select
                value={selectedMoods}
                onChange={(e) =>
                  handleDropdownChange(
                    e,
                    setSelectedMoods,
                    setIsMoodsDropdownOpen,
                  )
                }
                className="appearance-none rounded-md bg-white px-2 py-1 pr-6 pl-2 text-sm text-black md:py-2 md:pr-8 md:text-[16px]"
                onClick={() => toggleDropdown(setIsMoodsDropdownOpen)}
              >
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  All Moods
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Happy
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Sad
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Energetic
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Chill
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Inspiring
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2">
                {isMoodsDropdownOpen ? (
                  <FiChevronUp className="text-base text-black md:text-xl" />
                ) : (
                  <FiChevronDown className="text-base text-black md:text-xl" />
                )}
              </div>
            </div>
            {/* Genres Dropdown (first dropdown you highlighted) */}
            <div className="relative">
              <select
                value={selectedGenres}
                onChange={(e) =>
                  handleDropdownChange(
                    e,
                    setSelectedGenres,
                    setIsGenresDropdownOpen,
                  )
                }
                className="appearance-none rounded-md bg-white px-2 py-1 pr-6 pl-2 text-sm text-black md:py-2 md:pr-8 md:text-[16px]"
                onClick={() => toggleDropdown(setIsGenresDropdownOpen)}
              >
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  All Genres
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Pop
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Rock
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Jazz
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Hip-hop
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Electronic
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-3">
                {isGenresDropdownOpen ? (
                  <FiChevronUp className="pl-1 text-base text-black md:text-xl" />
                ) : (
                  <FiChevronDown className="text-base text-black md:text-xl" />
                )}
              </div>
            </div>
            {/* Sort Option Dropdown (second dropdown you highlighted) */}
            <div className="relative">
              <select
                value={selectedSortOption}
                onChange={(e) =>
                  handleDropdownChange(
                    e,
                    setSelectedSortOption,
                    setIsSortDropdownOpen,
                  )
                }
                className="appearance-none rounded-md bg-white px-2 py-1 pr-6 pl-2 text-sm text-black md:py-2 md:pr-8 md:text-[16px]"
                onClick={() => toggleDropdown(setIsSortDropdownOpen)}
              >
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Default
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  A-Z
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Newest
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Oldest
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-3">
                {isSortDropdownOpen ? (
                  <FiChevronUp className="pl-1 text-base text-black md:text-xl" />
                ) : (
                  <FiChevronDown className="text-base text-black md:text-xl" />
                )}
              </div>
            </div>
            {/* List View Dropdown (third dropdown you highlighted) */}
            <div className="relative">
              <select
                value={selectedListView}
                onChange={(e) =>
                  handleDropdownChange(
                    e,
                    setSelectedListView,
                    setIsListViewDropdownOpen,
                  )
                }
                className="appearance-none rounded-md bg-white px-2 py-1 pr-6 pl-2 text-sm text-black md:py-2 md:pr-8 md:text-[16px]"
                onClick={() => toggleDropdown(setIsListViewDropdownOpen)}
              >
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Default List
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Compact View
                </option>
                <option className="px-1 text-sm font-[400] md:text-[16px]">
                  Detailed View
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-3">
                {isListViewDropdownOpen ? (
                  <FiChevronUp className="pl-1 text-base text-black md:text-xl" />
                ) : (
                  <FiChevronDown className="text-base text-black md:text-xl" />
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto flex items-center justify-center px-2">
            <div className="inline-flex w-full max-w-[880px] items-center justify-between rounded-lg bg-white px-3 py-1 md:px-4 md:py-2">
              <input
                type="text"
                placeholder="What type of track are you looking for?"
                className="w-full bg-transparent font-['Poppins'] text-sm font-normal text-black outline-none placeholder:text-black/60 md:text-base"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div
                className="ml-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-neutral-200 p-1.5 md:ml-3 md:h-9 md:w-9 md:p-2.5"
                onClick={handleSearchClick}
              >
                <LuSearch className="text-lg text-black md:text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* table part */}
      <section className="sm:p-6 lg:p-8">
        {" "}
        <div className="mx-auto w-full max-w-7xl">
          <div className="overflow-x-auto border-b border-gray-500">
            <table className="min-w-full text-left text-xs text-white sm:text-sm md:text-base">
              <thead className="text-sm text-orange-300 sm:text-base md:text-xl">
                <tr>
                  <th
                    className="px-2 py-3 text-center font-medium sm:px-4 sm:py-4"
                    colSpan={2}
                  >
                    Title
                  </th>
                  <th className="px-2 py-3 font-medium sm:px-4 sm:py-4">
                    Time
                  </th>{" "}
                  <th className="px-2 py-3 font-medium sm:px-4 sm:py-4">BPM</th>{" "}
                  <th className="py-3 font-medium md:px-4">Tags</th>{" "}
                  <th className="py-3 font-medium md:px-4 md:py-4"></th>{" "}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500">
                {filteredTracks.length > 0 ? (
                  filteredTracks.map((track) => (
                    <tr key={track.id} className="transition hover:bg-white/5">
                      {/* Thumbnail + Title */}
                      <td className="py-2 sm:py-4" colSpan={2}>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <img
                            src={track.thumbnail}
                            alt="Album"
                            className="h-8 w-8 rounded-sm object-cover sm:h-14 sm:w-14 md:h-20 md:w-20"
                          />
                          <span className="pr-3 text-[10px] text-neutral-300 sm:text-sm md:text-base">
                            {track.title}
                          </span>
                        </div>
                      </td>
                      {/* Time */}
                      <td className="px-4 py-2 text-xs font-[600] text-[#949494] sm:py-4 sm:text-sm md:px-2">
                        {track.time}
                      </td>{" "}
                      {/* BPM */}
                      <td className="text- py-2 text-xs font-[600] text-[#949494] sm:py-4 sm:text-sm md:px-4">
                        {track.bpm}
                      </td>{" "}
                      {/* Tags */}
                      <td className="py-2 sm:px-4 sm:py-4">
                        <div className="flex flex-wrap gap-1 font-[400] sm:gap-2">
                          {track.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-block rounded-full bg-black/20 px-2 py-0.5 text-xs text-gray-400 capitalize sm:px-3 sm:py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="py-2 sm:py-4">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <button className="rounded-md bg-zinc-800 p-1 transition hover:bg-zinc-700 sm:p-2">
                            <FaShareAlt className="text-xs text-white sm:text-sm md:text-base" />{" "}
                          </button>
                          {/* "Add to Cart" button - onClick handler যোগ করা হয়েছে */}
                          <button
                            onClick={() => handleAddToCart(track)} // এখানে addToCart ফাংশন কল করা হয়েছে
                            className="flex items-center gap-1 rounded-md bg-gradient-to-b from-orange-200 to-yellow-500 px-2 py-1 text-xs font-semibold text-black md:px-3 md:py-2"
                          >
                            <HiOutlineShoppingBag className="text-xs sm:text-sm" />{" "}
                            <span>${track.price.toFixed(2)}</span>{" "}
                            {/* পণ্যের মূল্য দেখানো হয়েছে */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 text-center text-neutral-400"
                    >
                      No tracks found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
export default TracksPage;
