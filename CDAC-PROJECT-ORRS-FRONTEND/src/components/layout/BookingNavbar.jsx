import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import train from "../../assets/train.png";
import { House, Train as TrainIcon, Question, Phone, User } from 'phosphor-react';
import NavDropdown from './NavDropdown';
import { trainItems, helpItems, contactItems, accountItems } from './navLinks';

export default function BookingNavbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <img src={train} alt="train logo" className="h-6 w-6 brightness-0 invert" />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">
            Railway Reservation
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 font-medium">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive("/")
                ? "text-white font-semibold bg-white/20"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            <House size={18} weight="duotone" />
            Home
          </Link>

          <NavDropdown
            label="Trains"
            items={publicTrainItems}
            icon={<TrainIcon size={18} weight="duotone" />}
            isDark={true}
          />
          <NavDropdown
            label="Help"
            items={publicHelpItems}
            icon={<Question size={18} weight="duotone" />}
            isDark={true}
          />
          <NavDropdown
            label="Contact"
            items={contactItems}
            icon={<Phone size={18} weight="duotone" />}
            isDark={true}
          />
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="hidden lg:block">
              <NavDropdown
                label={user?.fullName || "My Account"}
                items={userAccountItems}
                hasLogout={true}
                onLogout={handleLogout}
                alignRight={true}
                icon={<User size={18} weight="duotone" />}
                isDark={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}