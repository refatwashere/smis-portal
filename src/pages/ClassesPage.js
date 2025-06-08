import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../components/ui/ToastProvider';
import { Search, Plus, Grid, List, ChevronDown, Edit, Trash2, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Dropdown } from '../components/ui/Dropdown';

const ClassesPage = () => {
  const { classes, isLoading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { deleteClass } = useApp();
  const navigate = useNavigate();
  const { success, error } = useToast();
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      try {
        await deleteClass(id);
        success('Class deleted successfully');
      } catch (err) {
        error('Failed to delete class');
        console.error('Error deleting class:', err);
      }
    }
  };

  const handleDeleteClick = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleDelete(id);
  };

  const handleEditClick = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/classes/${id}/edit`);
  };

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClasses = filteredClasses.sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else {
      return sortOrder === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt);
    }
  });

  if (isLoading && !classes.length) {
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
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your classes and view student progress
          </p>
        </div>
        <Button as={Link} to="/classes/new" className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Class
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search classes..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-md"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2 rounded-md"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Dropdown
              align="end"
              trigger={
                <Button variant="outline" size="sm" className="flex items-center">
                  <span className="mr-2">
                    {sortBy === 'name' ? 'Name' : 'Date Created'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              }
              items={[
                { label: 'Name', onClick: () => setSortBy('name'), active: sortBy === 'name' },
                { label: 'Date Created', onClick: () => setSortBy('createdAt'), active: sortBy === 'createdAt' }
              ]}
            />
            <Button
              variant={sortOrder === 'asc' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2"
            >
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>
          </div>
        </div>
      </Card>

      {sortedClasses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No classes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'No classes match your search. Try a different term.'
              : 'Get started by creating a new class.'}
          </p>
          <div className="mt-6">
            <Button as={Link} to="/classes/new">
              <Plus className="h-4 w-4 mr-2" />
              New Class
            </Button>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClasses.map((cls) => (
            <ClassCard 
              key={cls.id} 
              cls={cls} 
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                  Class Details
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Grade & Schedule
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Students
                </th>
                <th scope="col" className="relative py-3.5 pr-6 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedClasses.map((cls) => (
                <ClassRow key={cls.id} cls={cls} onDelete={handleDeleteClick} onEdit={handleEditClick} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ClassCard = ({ cls, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleDeleteInCard = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await onDelete(cls.id, e);
  };
  
  const handleEditInCard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(cls.id, e);
  };
  return (
    <Link to={`/classes/${cls.id}`} className="block h-full">
      <Card 
        className="h-full flex flex-col transition-shadow duration-200 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {cls.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {cls.subject ? `${cls.subject} • ` : ''} 
                {cls.grade ? `Grade ${cls.grade.replace('grade-', '')}` : 'No grade specified'}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {cls.students?.length || 0} students
            </span>
          </div>
          
          <p className="mt-3 text-sm text-gray-600 flex-1 line-clamp-3">
            {cls.description || 'No description provided.'}
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {cls.schedule || 'No schedule set'}
              </span>
              
              {isHovered && (
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleEditInCard}
                    className="h-8 w-8 p-0 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteInCard}
                    className="h-8 w-8 p-0 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const ClassRow = ({ cls, onDelete, onEdit }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              <Link to={`/classes/${cls.id}`} className="hover:text-blue-600">
                {cls.name}
              </Link>
            </div>
            <div className="text-sm text-gray-500">{cls.subject || 'No subject'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">Grade {cls.grade?.replace('grade-', '') || 'N/A'}</div>
        <div className="text-sm text-gray-500">{cls.schedule || 'No schedule'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {cls.students?.length || 0} students
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => onEdit(cls.id, e)}
          className="text-gray-500 hover:text-blue-600"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => onDelete(cls.id, e)}
          className="text-gray-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </td>
    </tr>
  );
};

export default ClassesPage;
