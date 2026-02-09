import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatsCard from '../components/StatsCard';
import { adminService } from '../../services';
import { 
  RocketLaunchIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTrains: 0,
    totalActiveTrains: 0,
    totalStations: 0,
    totalActiveStations: 0,
    totalScheduledTrains: 0,
    totalBookingsToday: 0,
    totalUsersRegistered: 0
  });
  const [bookingsData, setBookingsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, revenueRes] = await Promise.all([
        adminService.dashboard.getDashboardStats(),
        adminService.dashboard.getWeeklyBookings(),
        adminService.dashboard.getMonthlyRevenue()
      ]);
      
      if (statsRes.data?.status === 'SUCCESS') {
        setStats(statsRes.data.data);
      }
      if (bookingsRes.data?.status === 'SUCCESS') {
        setBookingsData(bookingsRes.data.data);
      }
      if (revenueRes.data?.status === 'SUCCESS') {
        setRevenueData(revenueRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const trainStatusData = [
    { name: 'Active', value: stats.totalActiveTrains, color: '#10b981' },
    { name: 'Inactive', value: stats.totalTrains - stats.totalActiveTrains, color: '#ef4444' }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Railway system overview and statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Trains"
            value={stats.totalTrains}
            icon={RocketLaunchIcon}
            change={`${stats.totalActiveTrains} active`}
            changeType="neutral"
          />
          <StatsCard
            title="Active Trains"
            value={stats.totalActiveTrains}
            icon={RocketLaunchIcon}
            change="Operational"
            changeType="increase"
          />
          <StatsCard
            title="Total Stations"
            value={stats.totalStations}
            icon={MapPinIcon}
            change={`${stats.totalActiveStations} active`}
            changeType="neutral"
          />
          <StatsCard
            title="Active Stations"
            value={stats.totalActiveStations}
            icon={MapPinIcon}
            change="Operational"
            changeType="increase"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Scheduled Trains"
            value={stats.totalScheduledTrains}
            icon={CalendarIcon}
            change="From today"
            changeType="neutral"
          />
          <StatsCard
            title="Bookings Today"
            value={stats.totalBookingsToday}
            icon={CurrencyDollarIcon}
            change="Today's bookings"
            changeType="increase"
          />
          <StatsCard
            title="Registered Users"
            value={stats.totalUsersRegistered}
            icon={UsersIcon}
            change="Active users"
            changeType="increase"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Bookings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Train Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trainStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trainStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.totalActiveTrains}</p>
                <p className="text-sm text-green-700">Active Trains</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.totalActiveStations}</p>
                <p className="text-sm text-blue-700">Active Stations</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{stats.totalBookingsToday}</p>
                <p className="text-sm text-purple-700">Today's Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}