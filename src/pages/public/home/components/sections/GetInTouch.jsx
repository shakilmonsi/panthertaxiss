import React from "react";

const GetInTouch = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#150630] to-[#150620] px-4 py-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Layered Background Style */}
        <div className="mx-auto max-w-7xl rounded-3xl border border-stone-300 bg-white/5 p-10 backdrop-blur-[100px] md:p-16">
          {/* Form Content */}
          <div className="flex flex-col items-center">
            <h2 className="font-poppins mb-10 text-center text-3xl font-semibold text-white capitalize sm:text-4xl">
              Get in touch
            </h2>

            <form className="flex w-full max-w-4xl flex-col gap-6">
              {/* Name + Email */}
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex-1 border-b border-neutral-400 px-2 pt-3 pb-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="font-poppins w-full bg-transparent text-base leading-relaxed font-normal text-white capitalize placeholder-white/70 outline-none sm:text-lg md:text-xl"
                  />
                </div>
                <div className="flex-1 border-b border-neutral-400 px-2 pt-3 pb-2">
                  <input
                    type="email"
                    placeholder="E-mail Address"
                    className="font-poppins w-full bg-transparent text-base leading-relaxed font-normal text-white capitalize placeholder-white/70 outline-none sm:text-lg md:text-xl"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="border-b border-neutral-400 px-2 pt-3 pb-2">
                <input
                  type="text"
                  placeholder="Subject"
                  className="font-poppins w-full bg-transparent text-base leading-relaxed font-normal text-white capitalize placeholder-white/70 outline-none sm:text-lg md:text-xl"
                />
              </div>

              {/* Message */}
              <div className="border-b border-neutral-400 px-2 pt-3 pb-2">
                <textarea
                  placeholder="Message"
                  rows="4"
                  className="font-poppins w-full resize-none bg-transparent text-base leading-relaxed font-normal text-white capitalize placeholder-white/70 outline-none sm:text-lg md:text-xl"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 px-6 py-3 text-sm font-semibold text-black capitalize transition hover:opacity-90 sm:px-10 sm:text-base"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
