import { Link, useRouteError } from "react-router-dom";
import { SmilePlus } from "lucide-react";

export default function WorkspaceErrorPage() {
  const error: any = useRouteError();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 text-center">
      <div className="max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center gap-5">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-full">
            <SmilePlus className="text-blue-600 dark:text-blue-400 w-12 h-12" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
            Lost in the Workspace? 🚀
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
            Don’t worry — even the best explorers lose their way sometimes.
            Let’s get you back on track and creating amazing things again!
          </p>

          <p className="italic text-gray-500 dark:text-gray-400 mt-3">
            “Every mistake is a step toward success.” 🌈
          </p>

          <Link
            to="/workspace"
            className="mt-6 inline-block px-6 py-2.5 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>

      <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        Error Code: {error?.status || "404"}
      </p>
    </div>
  );
}
