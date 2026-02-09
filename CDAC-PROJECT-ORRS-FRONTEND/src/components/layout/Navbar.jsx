import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import train from "../../assets/train.png";
import Modal from "../common/Modal";
import { Login } from "../../pages/auth/Login";
import { House, Train as TrainIcon, Question, Phone, User } from 'phosphor-react';
import { trainItems, helpItems, contactItems, accountItems } from './navLinks';

/**
 * Navbar Component
 * Responsibility: Navigation with simplified menu structure and Redux integration
 */
export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
  };

  const publicTrainItems = trainItems.filter(item => 
    item.path === "/trains/pnr-status" || item.path === "/trains/cancelled"
  );

  const publicHelpItems = helpItems.filter(item => 
    item.path === "/help/how-to-book" || item.path === "/help/faqs"
  );

  const userAccountItems = accountItems.filter(item => 
    item.path === "/account/profile" || 
    item.path === "/account/edit-profile" || 
    item.path === "/account/bookings" || 
    item.path === "/account/change-password"
  );

  const NavDropdown = ({
    label,
    items,
    hasLogout = false,
    alignRight = false,
    icon,
  }) => (
    <div className="relative group ">
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-violet-600 hover:bg-violet-50 font-medium transition-all duration-200 group">
        {icon}
        <span>{label}</span>
        <svg
          className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute top-full ${
          alignRight ? "right-0" : "left-0"
        } opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-gradient-to-br from-white to-violet-50 rounded-xl shadow-2xl w-64 py-4 z-50 border border-violet-200 mt-2 transition-all duration-200 backdrop-blur-sm`}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3 transition-all duration-200 text-sm font-medium rounded-lg mx-2 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md transform scale-105"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-violet-100 hover:to-violet-200 hover:text-violet-700 hover:transform hover:scale-105"
              }`}
            >
              {Icon && <Icon size={18} weight="duotone" />}
              {item.label}
            </Link>
          );
        })}
        {hasLogout && (
          <>
            <div className="border-t border-violet-300 my-3 mx-3"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 font-medium flex items-center gap-3 text-sm rounded-lg mx-2 hover:transform hover:scale-105"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-violet-50 py-4">
      <nav className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl px-6 py-4 mx-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-md">
              <img src={train} alt="train logo" className="h-6 w-6 invert" />
            </div>
            <span className="text-xl font-bold text-violet-700 hidden sm:inline">
              Railway Reservation
            </span>
          </Link>

          {/* Simplified Nav Links */}
          <div className="hidden lg:flex items-center gap-8 font-medium">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive("/")
                  ? "text-violet-600 font-semibold bg-violet-50"
                  : "text-gray-700 hover:text-violet-600 hover:bg-violet-50"
              }`}
            >
              <House size={18} weight="duotone" />
              Home
            </Link>

            <NavDropdown
              label="Trains"
              items={publicTrainItems}
              icon={<TrainIcon size={18} weight="duotone" />}
            />
            <NavDropdown
              label="Help"
              items={publicHelpItems}
              icon={<Question size={18} weight="duotone" />}
            />
            <NavDropdown
              label="Contact"
              items={contactItems}
              icon={<Phone size={18} weight="duotone" />}
            />
          </div>

          {/* Account & Login */}
          <div className="flex items-center gap-4">
            {/* Account Dropdown */}
            {isAuthenticated && (
              <div className="hidden lg:block">
                <NavDropdown
                  label={user?.fullName || "My Account"}
                  items={userAccountItems}
                  hasLogout={true}
                  alignRight={true}
                  icon={<User size={18} weight="duotone" />}
                />
              </div>
            )}

            {/* Login Button */}
            {!isAuthenticated && (
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white text-sm flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button className="lg:hidden text-violet-600 hover:text-violet-700 p-2 rounded-lg hover:bg-violet-50 transition-all duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)}>
        <Login
          onLoginSuccess={() => {
            setShowLogin(false);
          }}
        />
      </Modal>
    </div>
  );
}
