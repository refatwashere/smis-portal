import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
  BookOpen, 
  Users, 
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const DashboardPage = () => {
  const { currentUser, stats, recentActivity, isLoading } = useApp();

  // Sample data - in a real app, this would come from your backend
  const quickActions = [
    { 
      title: 'Create Class', 
      icon: <BookOpen className="h-5 w-5" />, 
      to: '/classes/new',
      description: 'Set up a new class with students and materials'
    },
    { 
      title: 'Add Student', 
      icon: <Users className="h-5 w-5" />, 
      to: '/students/new',
      description: 'Enroll a new student in a class'
    },
    { 
      title: 'Post Update', 
      icon: <MessageSquare className="h-5 w-5" />, 
      to: '/updates/new',
      description: 'Share an announcement or update with your class'
    },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Conference', date: '2023-06-15', time: '2:00 PM' },
    { id: 2, title: 'End of Term Exams', date: '2023-06-30', time: '9:00 AM' },
    { id: 3, title: 'School Holiday', date: '2023-07-04', time: 'All Day' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser?.user_metadata?.name || 'Teacher'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your classes today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Classes" 
          value={stats?.totalClasses || 0} 
          icon={<BookOpen className="h-6 w-6 text-blue-500" />} 
          change="+2 from last month"
        />
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents || 0} 
          icon={<Users className="h-6 w-6 text-green-500" />} 
          change="+5 from last month"
        />
        <StatCard 
          title="Updates This Month" 
          value={stats?.totalUpdates || 0} 
          icon={<MessageSquare className="h-6 w-6 text-purple-500" />} 
          change="+3 from last month"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <Link to="/activities" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.to}
              className="group block"
            >
              <Card className="h-full p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors duration-150">
                    {action.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity?.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No recent activity to display
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Upcoming Events
                </h3>
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  View Calendar
                </Button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {event.date} • {event.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, change }) => (
  <Card className="p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <span className="ml-2 text-sm font-medium text-green-600">
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  </Card>
);

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'update':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'student_added':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'class_created':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          {getActivityIcon(activity.type)}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-900">
            {activity.message}
          </p>
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(activity.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
