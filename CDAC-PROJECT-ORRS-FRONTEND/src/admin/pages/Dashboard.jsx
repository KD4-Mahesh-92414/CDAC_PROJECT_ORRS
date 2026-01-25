import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import StatsCard from '../components/StatsCard';
import { useTrains } from '../context/TrainContext';
import { useStations } from '../context/StationContext';
import { 
  RocketLaunchIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { trains } = useTrains();
  const { stations } = useStations();

  const activeTrains = trains.filter(t => t.trainActiveStatus === 'Active').length;
  const activeStations = stations.filter(s => s.status === 'Active').length;
  const runningTrains = trains.filter(t => t.status === 'Running').length;
  const cancelledTrains = trains.filter(t => t.status === 'Cancelled').length;
  const notStartedTrains = trains.filter(t => t.status === 'Not Started').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Railway system overview and statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Trains"
            value={activeTrains}
            icon={RocketLaunchIcon}
            change="+2"
            changeType="increase"
          />
          <StatsCard
            title="Active Stations"
            value={activeStations}
            icon={UsersIcon}
            change="0"
            changeType="neutral"
          />
          <StatsCard
            title="Total Trains"
            value={trains.length}
            icon={CurrencyDollarIcon}
            change="+3"
            changeType="increase"
          />
          <StatsCard
            title="Total Stations"
            value={stations.length}
            icon={ChartBarIcon}
            change="+1"
            changeType="increase"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Revenue Chart Placeholder</p>
            </div>
          </div>

          {/* Weekly Bookings Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Bookings</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Bookings Chart Placeholder</p>
            </div>
          </div>
        </div>

        {/* Train Status Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Train Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{runningTrains}</p>
              <p className="text-sm text-green-700">Running</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{notStartedTrains}</p>
              <p className="text-sm text-yellow-700">Not Started</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{cancelledTrains}</p>
              <p className="text-sm text-red-700">Cancelled</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}