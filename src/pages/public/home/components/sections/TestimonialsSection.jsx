import { IoIosStar } from "react-icons/io";

const testimonialsData = [
  {
    quote:
      "TaxiLog UK  has transformed our daily operations. The digital forms save us hours each week, and the document reminders ensure we never miss renewals.",
    author: "Sarah Mitchell",
    title: "Professional Driver",
    avatarUrl: "/image/home/Ellipse 1 (1).png",
    stars: 5,
  },
  {
    quote:
      "As a professional driver, this app gives me peace of mind. The inspection process is thorough yet quick, and I love having all my documents in one secure place.",
    author: "Michael Johnson",
    title: "Professional Driver",
    avatarUrl: "/image/home/Ellipse 1 (2).png",
    stars: 5,
  },
  {
    quote:
      "The compliance features are excellent. We can easily generate reports for audits, and the automatic reminders help us stay on top of all regulations.",
    author: "Lisa Rodriguez",
    title: "Professional Driver",
    avatarUrl: "/image/home/Ellipse 1.png",
    stars: 5,
  },
];

const StarRating = ({ count }) => {
  const stars = Array.from({ length: count }, (_, index) => (
    <IoIosStar key={index} className="h-5 w-5 text-yellow-400" />
  ));
  return <div className="flex items-center gap-1">{stars}</div>;
};

const TestimonialsSection = () => {
  return (
    <div
      id="testimonials"
      className="flex w-full flex-col items-center justify-center gap-6 px-4 py-10 sm:gap-4 sm:px-12 sm:py-16 md:gap-10 md:px-16 md:py-24 lg:px-24"
    >
      {/* Section Header */}
      <div className="flex w-full max-w-7xl flex-col items-center justify-start gap-4 text-center font-['Roboto']">
        <h1 className="text-3xl font-semibold text-neutral-800 sm:text-4xl md:text-5xl">
          Trusted by Professionals
        </h1>
        <p className="text-sm font-[600] text-[#555555] sm:text-base">
          See what drivers and fleet managers are saying about TaxiLog UK.
        </p>
      </div>

      {/* Testimonial Cards Container */}
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:justify-center">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={index}
            className="flex h-64 w-full max-w-sm flex-shrink-0 flex-col items-start justify-between rounded-xl border border-gray-50 bg-white p-6 shadow-[0px_4px_8px_0px_rgba(82,136,244,0.10)] md:w-96 lg:w-96"
          >
            {/* Quote and Stars */}
            <div className="flex flex-col items-start justify-start gap-2">
              <StarRating count={testimonial.stars} />
              <p className="my-2 self-stretch font-['Roboto'] text-base leading-normal font-normal text-zinc-500">
                "{testimonial.quote}"
              </p>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 self-stretch">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.avatarUrl}
                alt={testimonial.author}
              />
              <div className="flex flex-1 flex-col items-start justify-end gap-1">
                <div className="self-stretch text-base leading-normal font-[600] text-[#5F5F5F]">
                  {/* {testimonial.author} */}
                </div>
                <div className="self-stretch text-base leading-normal font-normal text-zinc-500">
                  {testimonial.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
