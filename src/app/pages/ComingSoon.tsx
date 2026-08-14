import { Sidebar } from "../components/dashboard/Sidebar";
import { PageLayout } from "../components/dashboard/PageLayout";
import { Construction } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export default function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract page name from path
  const pageName = location.pathname
    .split("/")
    .filter(Boolean)[0]
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "This Page";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />

      <PageLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Construction className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {pageName}
              </h1>
              <p className="text-xl text-slate-400 mb-8">
                Coming Soon
              </p>

              <div className="backdrop-blur-xl bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <p className="text-slate-300 mb-4">
                  This feature is currently under development and will be
                  available in a future update.
                </p>
                <p className="text-sm text-slate-500">
                  We're working hard to bring you the best autonomous agent
                  experience possible.
                </p>
              </div>

              <button
                onClick={() => navigate("/")}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all cursor-pointer shadow-lg shadow-blue-500/30"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}