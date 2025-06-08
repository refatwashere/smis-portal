import React from 'react';
import { BookOpen, Users, MessageSquare, PlusCircle, UserPlus } from 'lucide-react';

const Dashboard = ({ 
  currentUser, 
  classes, 
  students, 
  updates, 
  onViewClass, 
  onViewStudent, 
  onAddClass,
  onAddStudent,
  onShowAddUpdate
}) => {
  const stats = [
    { name: 'Total Classes', value: classes.length, icon: BookOpen, change: '+2.5%', changeType: 'increase' },
    { name: 'Total Students', value: students.length, icon: Users, change: '+5.2%', changeType: 'increase' },
    { name: 'Recent Updates', value: updates.length, icon: MessageSquare, change: '+3.8%', changeType: 'increase' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Welcome, {currentUser?.user_metadata?.name || 'Teacher'}
      </h2>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <button
              onClick={onAddClass}
              className="relative bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Add New Class</p>
                <p className="text-sm text-gray-500 truncate">Create a new class</p>
              </div>
            </button>

            <button
              onClick={onAddStudent}
              className="relative bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Add New Student</p>
                <p className="text-sm text-gray-500 truncate">Enroll a new student</p>
              </div>
            </button>

            <button
              onClick={onShowAddUpdate}
              className="relative bg-white p-6 rounded-lg border border-gray-300 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Add Update</p>
                <p className="text-sm text-gray-500 truncate">Record student progress</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          <p className="mt-1 text-sm text-gray-500">Latest updates and changes in your classes.</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {updates.slice(0, 5).map((update) => (
              <li key={update.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {update.text}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {update.category}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {update.student_name}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {new Date(update.created_at).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
            {updates.length === 0 && (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No recent activity to display
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
