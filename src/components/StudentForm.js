import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';
import { classNames } from '../utils/index';

const StudentForm = ({
  onSubmit,
  onCancel,
  initialName = '',
  initialIdentifier = '',
  initialClass = '',
  initialEmail = '',
  initialPhone = '',
  initialAddress = '',
  initialDob = '',
  isLoading = false,
  error = null,
  title = 'Add Student',
  submitText = 'Save'
}) => {
  const [name, setName] = useState(initialName);
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [className, setClassName] = useState(initialClass);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [dob, setDob] = useState(initialDob || '');
  const [errors, setErrors] = useState({});

  // Update internal state if initial values change
  useEffect(() => {
    setName(initialName);
    setIdentifier(initialIdentifier);
    setClassName(initialClass);
    setEmail(initialEmail);
    setPhone(initialPhone);
    setAddress(initialAddress);
    setDob(initialDob || '');
  }, [initialName, initialIdentifier, initialClass, initialEmail, initialPhone, initialAddress, initialDob]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (phone && !/^[0-9]{10,}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number (minimum 10 digits)';
    }
    
    if (dob && !isValidDate(dob)) {
      newErrors.dob = 'Please enter a valid date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidDate = (dateString) => {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return !isNaN(date.getTime());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ 
        name, 
        identifier, 
        class: className,
        email,
        phone,
        address,
        dob: dob ? format(new Date(dob), 'yyyy-MM-dd') : null
      });
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Student Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter the student's basic information below.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Student Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={classNames(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              errors.name && 'border-red-500'
            )}
            required
            autoComplete="name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Student ID (Optional)
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={classNames(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              errors.identifier && 'border-red-500'
            )}
            autoComplete="off"
            disabled={isLoading}
          />
          {errors.identifier && (
            <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <input
            id="class"
            name="class"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className={classNames(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              errors.class && 'border-red-500'
            )}
            disabled={isLoading}
          />
          {errors.class && (
            <p className="mt-1 text-sm text-red-600">{errors.class}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classNames(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              errors.email && 'border-red-500'
            )}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={classNames(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              errors.phone && 'border-red-500'
            )}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="dob"
              name="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={classNames(
                'pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                errors.dob && 'border-red-500'
              )}
              disabled={isLoading}
            />
          </div>
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
          )}
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={classNames(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
              errors.address && 'border-red-500'
            )}
            disabled={isLoading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading || !validateForm()}
          >
            {isLoading ? 'Saving...' : submitText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudentForm;
