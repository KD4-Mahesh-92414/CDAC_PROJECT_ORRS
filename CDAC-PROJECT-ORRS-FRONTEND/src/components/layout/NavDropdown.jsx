import { Link, useLocation } from "react-router-dom";

export default function NavDropdown({ 
  label, 
  items, 
  hasLogout = false, 
  alignRight = false, 
  icon,
  onLogout,
  isDark = false
}) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative group">
      <button className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 group ${isDark ? "text-white/90 hover:text-white hover:bg-white/10" : "text-gray-700 hover:text-violet-600 hover:bg-violet-50"}`}>
        {icon}
        <span className="text-sm">{label}</span>
        <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`absolute top-full ${alignRight ? 'right-0' : 'left-0'} hidden group-hover:block bg-white rounded-xl shadow-xl w-56 py-2 z-50 border border-violet-200 mt-2`}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 text-sm ${isActive(item.path) ? "bg-violet-50 text-violet-700 font-semibold border-l-4 border-violet-600" : "text-gray-700 hover:bg-violet-50 hover:text-violet-600"}`}
            >
              {Icon && <Icon size={18} weight="duotone" />}
              {item.label}
            </Link>
          );
        })}
        {hasLogout && onLogout && (
          <>
            <div className="border-t border-violet-200 my-2 mx-3"></div>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
