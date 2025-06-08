import React, { useState, Fragment } from 'react';
import { 
  LogOut, 
  Home, 
  BookOpen as BookOpenIcon, 
  Users, 
  Bell, 
  Settings, 
  ChevronDown, 
  User, 
  MessageSquare, 
  Calendar, 
  Menu, 
  X 
} from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { classNames } from '../utils/index';

const Header = ({ 
  currentUser, 
  onLogout, 
  onNavigate, 
  onShowAuthModal,
  unreadUpdates = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userNavigation = [
    { name: 'Your Profile', icon: User, onClick: () => onNavigate('profile') },
    { name: 'Settings', icon: Settings, onClick: () => onNavigate('settings') },
    { name: 'Sign out', icon: LogOut, onClick: onLogout },
  ];

  const navigation = [
    { name: 'Dashboard', icon: Home, href: 'dashboard' },
    { name: 'Classes', icon: BookOpenIcon, href: 'classes' },
    { name: 'Students', icon: Users, href: 'students' },
    { name: 'Updates', icon: MessageSquare, href: 'updates' },
    { name: 'Calendar', icon: Calendar, href: 'calendar' },
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/school_logo.png"
                alt="School Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:inline">SMIS Portal</span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.href)}
                  className={classNames(
                    window.location.pathname.includes(item.href)
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-1" />
                  {item.name}
                  {item.name === 'Updates' && unreadUpdates > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {unreadUpdates}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <>
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                  onClick={() => onNavigate('updates')}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  {unreadUpdates > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  )}
                </button>

                {/* Profile dropdown */}
                <HeadlessMenu as="div" className="ml-3 relative">
                  <div>
                    <HeadlessMenu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {currentUser.user_metadata?.name?.charAt(0) || 'U'}
                      </div>
                      <ChevronDown className="ml-1 h-5 w-5 text-gray-400" />
                    </HeadlessMenu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      {userNavigation.map((item) => (
                        <HeadlessMenu.Item key={item.name}>
                          {({ active }) => (
                            <button
                              onClick={item.onClick}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left flex items-center'
                              )}
                            >
                              <item.icon className="h-4 w-4 mr-2" />
                              {item.name}
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      ))}
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              </>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={() => onShowAuthModal('login')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </button>
                <button
                  onClick={() => onShowAuthModal('register')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.href);
                  setMobileMenuOpen(false);
                }}
                className={classNames(
                  window.location.pathname.includes(item.href)
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                  'block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left'
                )}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                  {item.name === 'Updates' && unreadUpdates > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {unreadUpdates}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          {currentUser && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {currentUser.user_metadata?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {currentUser.user_metadata?.name || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => onNavigate('updates')}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  {unreadUpdates > 0 && (
                    <span className="absolute top-3 right-3 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  )}
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.onClick();
                      setMobileMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
