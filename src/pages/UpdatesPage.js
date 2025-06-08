import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { 
  Search, 
  Plus, 
  Filter, 
  MessageSquare, 
  Calendar,
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertTriangle,
  Bell,
  BellOff,
  Pin,
  Trash2,
  Edit2,
  Share2,
  MoreVertical
} from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';

const UpdatesPage = () => {
  const { updates, classes, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    class: 'all',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [activeTab, setActiveTab] = useState('all');

  // Filter and sort updates
  const filteredUpdates = updates
    .filter(update => {
      const matchesSearch = 
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = filters.class === 'all' || update.classId === filters.class;
      const matchesType = filters.type === 'all' || update.type === filters.type;
      const matchesTab = 
        activeTab === 'all' || 
        (activeTab === 'mine' && update.authorId === currentUser?.id) ||
        (activeTab === 'pinned' && update.isPinned) ||
        (activeTab === 'announcements' && update.type === 'announcement');
      
      return matchesSearch && matchesClass && matchesType && matchesTab;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === 'date') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filters.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (filters.sortBy === 'author') {
        comparison = a.authorName.localeCompare(b.authorName);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  const updateTypes = [
    { id: 'all', name: 'All Updates' },
    { id: 'announcement', name: 'Announcements' },
    { id: 'homework', name: 'Homework' },
    { id: 'event', name: 'Events' },
    { id: 'reminder', name: 'Reminders' },
  ];

  const tabs = [
    { id: 'all', name: 'All Updates' },
    { id: 'mine', name: 'My Posts' },
    { id: 'pinned', name: 'Pinned' },
    { id: 'announcements', name: 'Announcements' },
  ];

  if (!updates) {
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
          <h1 className="text-2xl font-bold text-gray-900">Updates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated with the latest announcements and posts
          </p>
        </div>
        <Button as={Link} to="/updates/new" className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search updates..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
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
                        <option value="all">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="px-4 py-2">
                      <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        id="type-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                      >
                        <option value="all">All Types</option>
                        <option value="announcement">Announcement</option>
                        <option value="homework">Homework</option>
                        <option value="event">Event</option>
                        <option value="reminder">Reminder</option>
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
                    {['Date', 'Title', 'Author'].map((option) => {
                      const value = option.toLowerCase();
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.name}
              {tab.id === 'pinned' && (
                <span className="bg-blue-100 text-blue-600 ml-2 py-0.5 px-2 rounded-full text-xs font-medium">
                  {updates.filter(u => u.isPinned).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Update Type Filters */}
      <div className="flex flex-wrap gap-2">
        {updateTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setFilters({...filters, type: type.id})}
            className={`${
              filters.type === type.id
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors`}
          >
            {type.id === 'announcement' && <Bell className="h-4 w-4 mr-1.5" />}
            {type.id === 'homework' && <BookOpen className="h-4 w-4 mr-1.5" />}
            {type.id === 'event' && <Calendar className="h-4 w-4 mr-1.5" />}
            {type.id === 'reminder' && <AlertTriangle className="h-4 w-4 mr-1.5" />}
            {type.name}
            {filters.type === type.id && (
              <span className="ml-1.5 text-blue-600">
                {filteredUpdates.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredUpdates.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No updates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filters.class !== 'all' || filters.type !== 'all'
              ? 'No updates match your current filters.'
              : 'Get started by creating a new update.'}
          </p>
          <div className="mt-6">
            <Button as={Link} to="/updates/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      )}
    </div>
  );
};

const UpdateCard = ({ update }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(update.isPinned);
  const [isMuted, setIsMuted] = useState(false);
  
  const getTypeBadge = (type) => {
    const typeConfig = {
      announcement: { bg: 'bg-blue-100 text-blue-800', icon: Bell },
      homework: { bg: 'bg-purple-100 text-purple-800', icon: BookOpen },
      event: { bg: 'bg-green-100 text-green-800', icon: Calendar },
      reminder: { bg: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      default: { bg: 'bg-gray-100 text-gray-800', icon: MessageSquare }
    };
    
    const config = typeConfig[type] || typeConfig.default;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
        <Icon className="h-3 w-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className={`overflow-hidden ${isPinned ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={update.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(update.authorName)}&background=random`}
                alt={update.authorName}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {update.authorName}
                </h3>
                <span className="text-sm text-gray-500">•</span>
                <p className="text-sm text-gray-500">
                  {formatDate(update.createdAt)}
                </p>
                {update.className && (
                  <>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm font-medium text-blue-600">
                      {update.className}
                    </span>
                  </>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {getTypeBadge(update.type)}
                {isPinned && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0 flex
          ">
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
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsPinned(!isPinned)}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } flex w-full items-center px-4 py-2 text-sm`}
                        >
                          {isPinned ? (
                            <BellOff className="mr-3 h-5 w-5 text-gray-400" />
                          ) : (
                            <Pin className="mr-3 h-5 w-5 text-gray-400" />
                          )}
                          {isPinned ? 'Unpin' : 'Pin to top'}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } flex w-full items-center px-4 py-2 text-sm`}
                        >
                          {isMuted ? (
                            <Bell className="mr-3 h-5 w-5 text-gray-400" />
                          ) : (
                            <BellOff className="mr-3 h-5 w-5 text-gray-400" />
                          )}
                          {isMuted ? 'Enable notifications' : 'Mute notifications'}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } flex w-full items-center px-4 py-2 text-sm`}
                        >
                          <Edit2 className="mr-3 h-5 w-5 text-gray-400" />
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } flex w-full items-center px-4 py-2 text-sm`}
                        >
                          <Share2 className="mr-3 h-5 w-5 text-gray-400" />
                          Share
                        </button>
                      )}
                    </Menu.Item>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-red-50 text-red-700' : 'text-red-600'
                          } flex w-full items-center px-4 py-2 text-sm`}
                        >
                          <Trash2 className="mr-3 h-5 w-5 text-red-400" />
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-lg font-medium text-gray-900">{update.title}</h4>
          <div 
            className={`mt-2 text-gray-600 prose prose-sm max-w-none ${!isExpanded ? 'line-clamp-3' : ''}`}
            dangerouslySetInnerHTML={{ __html: update.content }}
          />
          {update.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        {update.attachments && update.attachments.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Attachments</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {update.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-md flex items-center justify-center text-blue-600">
                    {attachment.type.startsWith('image/') ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 truncate">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {attachment.size}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{update.likes || 0}</span>
            </button>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{update.comments || 0}</span>
            </button>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
          <div>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdatesPage;
