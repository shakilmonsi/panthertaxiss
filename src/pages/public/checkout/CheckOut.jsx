import { FaTrashAlt, FaEllipsisV, FaArrowRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

function CheckOutPage() {
  const cartItems = [
    {
      id: 1,
      name: "NOLSTAGIA",
      genre: "Afrobeat",
      price: 30.0,
      imageUrl: "/shoppingcart/cart5.jpg",
    },
    {
      id: 2,
      name: "NOLSTAGIA",
      genre: "Afrobeat",
      price: 30.0,
      imageUrl: "/shoppingcart/cart6.jpg",
    },
    {
      id: 3,
      name: "NOLSTAGIA",
      genre: "Afrobeat",
      price: 30.0,
      imageUrl: "/shoppingcart/cart7.jpg",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = 4.0;
  // Figma-তে দেওয়া "Total (Tax incl.) $86.00" হুবহু ব্যবহার করা হয়েছে, কারণ এটি একটি নির্দিষ্ট মান।
  const total = 86.0;

  return (
    <div
      className="m-auto flex min-h-screen items-center justify-center bg-neutral-900 px-4 py-10 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(180deg, #050306 0%, #5D006D 100%)",
      }}
    >
      <div className="flex w-full max-w-6xl flex-col gap-8 rounded-2xl p-6 md:p-10 lg:flex-row">
        {/* Left Section: Shopping Cart */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Shopping Continue  */}
          <div className="flex items-center gap-2">
            <IoIosArrowBack className="h-6 w-6 cursor-pointer font-[600] text-white" />{" "}
            {/* React Icon replaces SVG */}
            <span className="font-['Poppins'] text-lg font-[600] text-white">
              Shopping Continue
            </span>
          </div>

          <hr className="border-t border-stone-300 opacity-50" />

          {/* Shopping cart title */}
          <div>
            <h2 className="mt-2 font-['Poppins'] text-lg font-[500] text-white">
              Shopping cart
            </h2>
            <p className="font-['Nunito'] text-sm font-[500] text-white">
              You have {cartItems.length} item in your cart
            </p>
          </div>

          {/* Cart Items */}
          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 pr-6 shadow-md"
              >
                <img
                  className="h-20 w-20 rounded-lg object-cover"
                  src={item.imageUrl}
                  alt={item.name}
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="font-['Poppins'] text-lg font-[600] text-[#3B3B3B] capitalize">
                    {item.name}
                  </div>
                  <div className="font-['Poppins'] text-base font-[400] text-neutral-700 capitalize">
                    {item.genre}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {" "}
                  {/* Price, Ellipsis, and Trash Icon */}
                  <div className="text-right font-['Poppins'] text-sm font-[500] text-[#393939]">
                    ${item.price.toFixed(2)}
                  </div>
                  <FaEllipsisV className="cursor-pointer text-base text-[#393939]" />
                  <FaTrashAlt className="cursor-pointer text-xl text-gray-500" />
                </div>
              </div>
            ))}
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

          {/* Card Type section */}
          <div className="flex flex-col gap-2">
            <span className="font-['Nunito'] text-base font-[500] text-white">
              Card type
            </span>
            <div className="flex gap-4">
              <img
                className="h-[55px] w-[75px] rounded-[5px] object-contain"
                style={{ background: "rgba(217, 217, 217, 0.2)" }}
                src="/shoppingcart/cart2.png"
                alt="Mastercard"
              />
              <img
                className="h-[55px] w-[75px] rounded-[5px] object-contain"
                style={{ background: "rgba(217, 217, 217, 0.2)" }}
                src="/shoppingcart/cart3.png"
                alt="Mastercard"
              />
              <img
                className="h-[55px] w-[75px] rounded-[5px] object-contain"
                style={{ background: "rgba(217, 217, 217, 0.2)" }}
                src="/shoppingcart/cart4.png"
                alt="Mastercard"
              />

              <div className="flex h-[55px] w-[75px] items-center justify-center rounded-[5px] bg-zinc-300/20">
                <span className="font-['Open_Sans'] text-sm font-[700] text-white">
                  See all
                </span>
              </div>
            </div>
          </div>

          {/* Name on card input field */}
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

          {/* Card Number ইনপুট */}
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

          {/* Expiration date and CVV input */}
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
                defaultValue="mm/yy" // Figma অনুযায়ী ডিফল্ট টেক্সট
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
                defaultValue="123" // Figma
                className="mt-1 h-10 w-full rounded-md bg-white p-3 font-['Poppins'] text-xs font-medium text-stone-300 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          <hr className="mt-4 border-t border-indigo-500 opacity-50" />

          {/* Subtotal, Shipping, Total */}
          <div className="gap-2">
            <div className="flex items-center justify-between p-0 pt-1">
              <span className="font-['Poppins'] text-sm font-[500] text-white">
                Subtotal
              </span>
              <span className="font-['Poppins'] text-sm font-[500] text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="top-0 bottom-0 flex items-center justify-between py-2">
              <span className="font-['Poppins'] text-sm font-[500] text-white">
                Shipping
              </span>
              <span className="font-['Poppins'] text-sm font-[500] text-white">
                ${shipping.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-['Poppins'] text-sm font-[500] text-white">
                Total (Tax incl.)
              </span>
              <span className="font-['Poppins'] text-sm font-[500] text-white">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button className="mt-4 flex items-center justify-between rounded-xl bg-[#DAA520] px-6 py-4 transition-colors duration-200 hover:bg-yellow-600">
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
    </div>
  );
}

export default CheckOutPage;
