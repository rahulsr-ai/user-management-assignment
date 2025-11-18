
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({ isListingPage }: { isListingPage: boolean }) => {
  return (
    <div className="backdrop-blur-sm bg-white/30 border-b border-gray-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:py-6">
          <div className="flex items-center">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-3 lg:mr-4">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-gray-900">
                UserManagement
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">
                Find your favourite users
              </p>
            </div>
          </div>
          {isListingPage && (
            <Link
              to={"/create-user"}
              className="inline-flex items-center p-2 md:p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FaUserPlus className="mr-2 " />
              Add User
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
