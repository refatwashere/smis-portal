// AuthModal component for login/signup
import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { Modal } from './Modal';

const AuthModal = ({ 
    isOpen, 
    onClose, 
    authMode, 
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    phone,
    setPhone,
    handleAuth,
    isLoading,
    error
}) => {
    if (!isOpen) return null;

    return (
        <Modal title={authMode === 'login' ? 'Teacher Login' : 'Teacher Signup'} onClose={onClose}>
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'signup' && (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                    autoComplete="tel"
                                />
                            </div>
                        </>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            autoComplete="email"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AuthModal;
