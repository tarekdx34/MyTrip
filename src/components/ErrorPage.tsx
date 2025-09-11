import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
      <h1 className="text-5xl font-bold text-red-700 mb-4">500</h1>
      <p className="text-xl text-red-600 mb-8">
        Something went wrong. Try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Reload Page
      </button>
    </div>
  );
};

export default ErrorPage;
