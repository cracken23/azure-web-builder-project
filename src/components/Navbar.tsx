
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-azure-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Zm3.25 14a.75.75 0 0 1 0-1.5h9.5a.75.75 0 0 1 0 1.5h-9.5Zm0-5a.75.75 0 0 1 0-1.5h9.5a.75.75 0 0 1 0 1.5h-9.5Z" />
          </svg>
          Azure Portfolio
        </Link>

        <div className="hidden md:flex space-x-8">
          <Link to="/#about" className="text-gray-700 hover:text-azure-500 font-medium transition-colors">
            About
          </Link>
          <Link to="/#skills" className="text-gray-700 hover:text-azure-500 font-medium transition-colors">
            Skills
          </Link>
          <Link to="/#projects" className="text-gray-700 hover:text-azure-500 font-medium transition-colors">
            Projects
          </Link>
          <Link to="/#contact" className="text-gray-700 hover:text-azure-500 font-medium transition-colors">
            Contact
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
