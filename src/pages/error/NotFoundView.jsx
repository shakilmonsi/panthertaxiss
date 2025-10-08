import { useNavigate } from "react-router-dom";

const NotFoundView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-9xl font-extrabold text-gray-900">
            <span className="sr-only">404</span>
            <span className="text-indigo-600">4</span>
            <span className="text-gray-900">0</span>
            <span className="text-indigo-600">4</span>
          </h1>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Page not found
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="mt-10">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Go back
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundView;
