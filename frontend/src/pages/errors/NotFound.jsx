import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] p-4">
      <div className="h-[calc(100vh-32px)] rounded-4xl bg-[#efefef] flex items-center justify-center p-10">
        <div className="max-w-175 w-full">
          <div className="bg-white rounded-[40px] p-10 shadow-sm relative overflow-hidden">
            <div className="absolute -top-30 -right-30 w-75 h-75 rounded-full bg-green-100 blur-3xl opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  4
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-primary text-primary flex items-center justify-center text-2xl font-bold">
                  0
                </div>

                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  4
                </div>
              </div>

              <h1 className="text-6xl font-bold leading-tight text-[#111]">
                Page not found
              </h1>

              <p className="text-gray-500 text-lg mt-5 leading-relaxed max-w-[500px]">
                The page you are looking for doesn’t exist or may have been
                moved.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-8">
                <Link
                  to="/"
                  className="
                    h-[60px]
                    px-8
                    rounded-2xl
                    bg-primary
                    text-white
                    flex
                    items-center
                    gap-3
                    font-medium
                    hover:scale-[1.02]
                    transition-all
                  "
                >
                  <ArrowLeft size={18} />
                  Back Home
                </Link>

                <button
                  className="
                    h-[60px]
                    px-8
                    rounded-2xl
                    border
                    border-[#dcdcdc]
                    bg-white
                    font-medium
                    hover:bg-[#f7f7f7]
                    transition-all
                  "
                >
                  Contact support
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Error code: 404
          </p>
        </div>
      </div>
    </div>
  );
}
