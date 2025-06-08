import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { 
  Search, 
  UserPlus, 
  Download, 
  MoreVertical,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';

const StudentsPage = () => {
  const { students, classes, isLoading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.idNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = !filters.class || student.classId === filters.class;
      const matchesStatus = filters.status === 'all' || student.status === filters.status;
      
      return matchesSearch && matchesClass && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'class') {
        comparison = (a.className || '').localeCompare(b.className || '');
      } else if (filters.sortBy === 'status') {
        comparison = (a.status || '').localeCompare(b.status || '');
      } else if (filters.sortBy === 'lastActive') {
        comparison = new Date(a.lastActive) - new Date(b.lastActive);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student records and information
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button as={Link} to="/students/new" className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search students by name, email, or ID..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Filter
                  <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Filter by
                    </div>
                    <div className="px-4 py-2">
                      <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <select
                        id="class-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filters.class}
                        onChange={(e) => setFilters({...filters, class: e.target.value})}
                      >
                        <option value="">All Classes</option>
                        {Array.from(new Set(classes.map(c => c.id))).map(classId => {
                          const cls = classes.find(c => c.id === classId);
                          return cls ? (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                          ) : null;
                        })}
                      </select>
                    </div>
                    <div className="px-4 py-2">
                      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        <option value="graduated">Graduated</option>
                      </select>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sort
                  {filters.sortOrder === 'asc' ? (
                    <ChevronUp className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  )}
                </Menu.Button>
              </div>

              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Sort by
                    </div>
                    {['Name', 'Class', 'Status', 'Last Active'].map((option) => {
                      const value = option.toLowerCase().replace(' ', '');
                      return (
                        <Menu.Item key={value}>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } flex justify-between w-full px-4 py-2 text-sm`}
                              onClick={() => {
                                const newSortOrder = 
                                  filters.sortBy === value && filters.sortOrder === 'asc' 
                                    ? 'desc' 
                                    : 'asc';
                                setFilters({
                                  ...filters,
                                  sortBy: value,
                                  sortOrder: newSortOrder
                                });
                              }}
                            >
                              {option}
                              {filters.sortBy === value && (
                                <span className="text-blue-600">
                                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </button>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </Card>

      {selectedStudents.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-blue-800">
              {selectedStudents.length} {selectedStudents.length === 1 ? 'student' : 'students'} selected
            </span>
          </div>
          <div className="flex space-x-3
          ">
            <Button variant="outline" size="sm">
              Send Message
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
              Deactivate
            </Button>
          </div>
        </div>
      )}

      {filteredStudents.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filters.class || filters.status !== 'all'
              ? 'No students match your current filters.'
              : 'Get started by adding a new student.'}
          </p>
          <div className="mt-6">
            <Button as={Link} to="/students/new">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </Card>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
                    checked={selectedStudents.length === filteredStudents.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Class
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredStudents.map((student) => (
                <StudentRow 
                  key={student.id} 
                  student={student} 
                  isSelected={selectedStudents.includes(student.id)}
                  onSelect={() => toggleStudentSelection(student.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StudentRow = ({ student, isSelected, onSelect }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { bg: 'bg-yellow-100 text-yellow-800', text: 'Inactive' },
      suspended: { bg: 'bg-red-100 text-red-800', text: 'Suspended' },
      graduated: { bg: 'bg-blue-100 text-blue-800', text: 'Graduated' },
      default: { bg: 'bg-gray-100 text-gray-800', text: 'Unknown' }
    };
    
    const config = statusConfig[status] || statusConfig.default;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
        {config.text}
      </span>
    );
  };

  return (
    <tr className={isSelected ? 'bg-blue-50' : ''}>
      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 sm:left-6"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img 
              className="h-10 w-10 rounded-full" 
              src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
              alt={student.name}
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{student.name}</div>
            <div className="text-gray-500">{student.idNumber || 'No ID'}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {student.className ? (
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-gray-400 mr-1.5" />
            {student.className}
          </div>
        ) : (
          <span className="text-gray-400">Not assigned</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex flex-col space-y-1">
          {student.email && (
            <div className="flex items-center">
              <Mail className="h-3.5 w-3.5 text-gray-400 mr-1.5 flex-shrink-0" />
              <span className="truncate max-w-[180px]">{student.email}</span>
            </div>
          )}
          {student.phone && (
            <div className="flex items-center">
              <Phone className="h-3.5 w-3.5 text-gray-400 mr-1.5 flex-shrink-0" />
              <span>{student.phone}</span>
            </div>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {getStatusBadge(student.status || 'inactive')}
      </td>
      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
              <span className="sr-only">Open options</span>
              <MoreVertical className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`/students/${student.id}`}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } flex items-center px-4 py-2 text-sm`}
                    >
                      <User className="mr-3 h-5 w-5 text-gray-400" />
                      View Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`/students/${student.id}/edit`}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } flex items-center px-4 py-2 text-sm`}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                      Edit
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`/students/${student.id}/progress`}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } flex items-center px-4 py-2 text-sm`}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.995l-.144.015-.192.025-.2.04-.14.03a5.5 5.5 0 01-5.742-5.742l.03-.14.04-.2.025-.192.015-.144a1 1 0 011.99 0l.008.09.01.1.02.12.03.15.04.18.05.19.06.2.05.13.08.2.09.18.07.12.1.15.11.14.1.1.1.1.11.1.14.1.15.1.12.07.18.09.2.08.13.05.2.06.18.04.15.04.12.02.1.01.09.01h.1a1 1 0 01.99 1.01z" clipRule="evenodd" />
                      </svg>
                      View Progress
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`/students/${student.id}/attendance`}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } flex items-center px-4 py-2 text-sm`}
                    >
                      <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                      Attendance
                    </a>
                  )}
                </Menu.Item>
                {(student.status === 'active' || student.status === 'suspended') && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        {student.status === 'active' ? (
                          <>
                            <XCircle className="mr-3 h-5 w-5 text-yellow-400" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-3 h-5 w-5 text-green-400" />
                            Activate
                          </>
                        )}
                      </button>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${
                        active ? 'bg-red-50 text-red-700' : 'text-red-600'
                      } flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <svg className="mr-3 h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </td>
    </tr>
  );
};

export default StudentsPage;
