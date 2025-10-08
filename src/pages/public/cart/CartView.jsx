// src/pages/CartView.jsx
import { useState, useContext } from "react";
import { FaTrashAlt, FaEllipsisV, FaArrowRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import PurchaseSuccessModal from "../../../components/PurchaseSuccessModal";
import { Link } from "react-router-dom";
import { CartContext } from "../../../utils/CartContextDefinition";
import toast, { Toaster } from "react-hot-toast"; // react-hot-toast import করুন

function CartView() {
  const { cartItems, removeFromCart, subtotal, total } =
    useContext(CartContext);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCheckout = () => {
    console.log("Proceeding to checkout with items:", cartItems);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleRemoveClick = (itemId, itemTitle) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center">
          <p className="font-['Poppins'] text-base font-semibold text-gray-800">
            Are you sure you want to remove{" "}
            <strong className="capitalize">{itemTitle}</strong>?
          </p>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => {
                removeFromCart(itemId);
                toast.dismiss(t.id);
                toast.success(`${itemTitle} removed from cart!`);
              }}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              Yes, remove
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep the toast open until user interacts
        position: "top-center",
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    );
  };

  return (
    <div>
      <Toaster /> {/* Toaster কম্পোনেন্ট যোগ করুন */}
      <div
        className={`m-auto flex min-h-screen items-center justify-center bg-neutral-900 px-2 py-10 sm:px-6 lg:px-8`}
        style={{
          background: "linear-gradient(180deg, #050306 0%, #5D006D 100%)",
        }}
      >
        <div className="flex w-full max-w-6xl flex-col gap-8 rounded-2xl p-6 md:p-10 lg:flex-row">
          {/* Left Section: Shopping Cart */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Shopping Continue Button - Link ব্যবহার করা হয়েছে */}
            <Link to="/tracks" className="flex items-center gap-2">
              <IoIosArrowBack className="h-6 w-6 cursor-pointer font-[600] text-white" />{" "}
              <span className="font-['Poppins'] text-lg font-[600] text-white">
                Shopping Continue
              </span>
            </Link>

            <hr className="border-t border-stone-300 opacity-50" />

            {/* Shopping cart title */}
            <div>
              <h2 className="mt-2 font-['Poppins'] text-lg font-[500] text-white">
                Shopping cart
              </h2>
              <p className="font-['Nunito'] text-sm font-[500] text-white">
                You have {cartItems.length} item
                {cartItems.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col gap-4 lg:gap-6">
              {cartItems.length === 0 ? (
                // যদি কার্ট খালি থাকে
                <p className="text-center text-lg text-white">
                  Your cart is empty.
                </p>
              ) : (
                // কার্ট আইটেমগুলো ম্যাপ করে দেখানো
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4 pr-6 shadow-md"
                  >
                    <img
                      className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                      src={item.thumbnail || "/shoppingcart/default.jpg"}
                      alt={item.title}
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="font-['Poppins'] text-base font-[600] text-[#3B3B3B] capitalize sm:text-lg">
                        {item.title}
                      </div>
                      <div className="font-['Poppins'] text-sm font-[400] text-neutral-700 capitalize sm:text-base">
                        {item.tags && item.tags.length > 0
                          ? item.tags[0]
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="text-right font-['Poppins'] text-xs font-[500] text-[#393939] sm:text-sm">
                        ${(item.price * item.quantity).toFixed(2)}{" "}
                      </div>
                      <FaEllipsisV className="cursor-pointer text-sm text-[#393939] sm:text-base" />
                      <FaTrashAlt
                        className="cursor-pointer text-lg text-gray-500 sm:text-xl"
                        onClick={() => handleRemoveClick(item.id, item.title)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Section: Card Details */}
          <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white/30 p-4 lg:w-96">
            <div className="flex items-center justify-between">
              <h2 className="font-['Poppins'] text-[22px] font-[600] text-white">
                Card Details
              </h2>
              <img
                className="h-12 w-12 rounded-lg object-cover"
                src="/shoppingcart/cart1.jpg"
                alt="User Avatar"
              />
            </div>

            {/* Card Type section (unchanged) */}
            <div className="flex flex-col gap-2">
              <span className="font-['Nunito'] text-base font-[500] text-white">
                Card type
              </span>
              <div className="flex gap-4">
                <img
                  className="h-[40px] w-[60px] rounded-[5px] object-contain sm:h-[55px] md:w-[75px]"
                  style={{ background: "rgba(217, 217, 217, 0.2)" }}
                  src="/shoppingcart/cart2.png"
                  alt="Mastercard"
                />
                <img
                  className="h-[40px] w-[60px] rounded-[5px] object-contain sm:h-[55px] sm:w-[75px] md:w-[75px]"
                  style={{ background: "rgba(217, 217, 217, 0.2)" }}
                  src="/shoppingcart/cart3.png"
                  alt="Visa"
                />
                <img
                  className="h-[40px] w-[60px] rounded-[5px] object-contain sm:h-[55px] sm:w-[75px] md:w-[75px]"
                  style={{ background: "rgba(217, 217, 217, 0.2)" }}
                  src="/shoppingcart/cart4.png"
                  alt="Amex"
                />

                <div className="flex h-[40px] w-[60px] items-center justify-center rounded-[5px] bg-zinc-300/20 sm:h-[55px] sm:w-[75px] md:w-[75px]">
                  <span className="font-['Open_Sans'] text-sm font-[700] text-white">
                    See all
                  </span>
                </div>
              </div>
            </div>

            {/* Name on card input field (unchanged) */}
            <label
              htmlFor="nameOnCard"
              className="bottom-0 mt-1 mb-0 pb-0 font-['Poppins'] text-sm font-[500] text-white"
            >
              Name on card
            </label>
            <div className="relative top-0 m-0 -mt-2 gap-0 p-0">
              <input
                type="text"
                id="nameOnCard"
                defaultValue="Name"
                className="mt-0 h-10 w-full rounded-md bg-white p-2 font-['Poppins'] text-xs font-medium text-stone-300 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Card Number ইনপুট (unchanged) */}
            <label
              htmlFor="cardNumber"
              className="bottom-0 mt-1 mb-0 pb-0 font-['Poppins'] text-sm font-[500] text-white"
            >
              Card Number
            </label>
            <div className="relative top-0 m-0 -mt-2 gap-0 p-0">
              <input
                type="text"
                id="cardNumber"
                defaultValue="1111 2222 3333 4444"
                className="h-10 w-full rounded-md bg-white p-3 font-['Poppins'] text-xs font-medium text-stone-300 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Expiration date and CVV input (unchanged) */}
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expirationDate"
                  className="bottom-0 mt-1 mb-0 pb-0 font-['Poppins'] text-sm font-[500] text-white"
                >
                  Expiration date
                </label>
                <input
                  type="text"
                  id="expirationDate"
                  defaultValue="mm/yy"
                  className="mt-1 h-10 w-full rounded-md bg-white p-3 font-['Poppins'] text-xs font-medium text-stone-300 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="cvv"
                  className="bottom-0 mt-1 mb-0 pb-0 font-['Poppins'] text-sm font-[500] text-white"
                >
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  defaultValue="123"
                  className="mt-1 h-10 w-full rounded-md bg-white p-3 font-['Poppins'] text-xs font-medium text-stone-300 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <hr className="mt-4 border-t border-indigo-500 opacity-50" />

            {/* Subtotal, Shipping, Total - Context থেকে প্রাপ্ত মান ব্যবহার করা হয়েছে */}
            <div className="gap-2">
              <div className="flex items-center justify-between p-0 pt-1">
                <span className="font-['Poppins'] text-sm font-[500] text-white">
                  Subtotal
                </span>
                <span className="font-['Poppins'] text-sm font-[500] text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button - onClick handler যোগ করা হয়েছে */}
            <button
              onClick={handleCheckout}
              className="mt-4 flex items-center justify-between rounded-xl bg-[#DAA520] px-6 py-4 transition-colors duration-200 hover:bg-yellow-600"
            >
              <span className="font-['Poppins'] text-base font-[500] text-white">
                ${total.toFixed(2)}
              </span>
              <span className="font-['Poppins'] text-base font-[500] text-white">
                Checkout
              </span>
              <FaArrowRight className="text-lg text-white" />
            </button>
          </div>
        </div>

        {/* Purchase Success Modal */}
        {showSuccessModal && (
          <PurchaseSuccessModal onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default CartView;
