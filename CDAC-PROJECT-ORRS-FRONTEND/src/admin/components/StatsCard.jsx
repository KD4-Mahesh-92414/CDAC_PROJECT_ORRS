export default function StatsCard({ title, value, icon: Icon, change, changeType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${
              changeType === 'increase' ? 'text-green-600' : 
              changeType === 'decrease' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}{change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-violet-100 rounded-full">
            <Icon className="w-6 h-6 text-violet-600" />
          </div>
        )}
      </div>
    </div>
  );
}