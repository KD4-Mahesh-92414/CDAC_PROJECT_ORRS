import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

export default function TopNavbar({ setSidebarOpen }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-violet-600 to-violet-700 shadow-lg border-b border-violet-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <h2 className="ml-2 text-lg font-semibold text-white">
            Railway Admin Dashboard
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-violet-800 transition-colors">
            <BellIcon className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => navigate('/admin/profile')}
            className="p-2 rounded-full hover:bg-violet-800 transition-colors"
          >
            <UserCircleIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}