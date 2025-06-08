import React, { useState } from 'react';

const UpdateForm = ({
  onSubmit,
  onCancel,
  initialText = '',
  initialCategory = 'Academic',
  isLoading,
  error,
  title = 'Add Update',
  submitText = 'Save Update'
}) => {
  const [updateText, setUpdateText] = useState(initialText);
  const [updateCategory, setUpdateCategory] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text: updateText, category: updateCategory });
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-4">
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )}
    
    <div>
      <label htmlFor="updateText" className="block text-sm font-medium text-gray-700">
        Update Text
      </label>
      <textarea
        id="updateText"
        name="updateText"
        value={updateText}
        onChange={(e) => setUpdateText(e.target.value)}
        className="form-input"
        rows={4}
        required
        aria-required="true"
      />
    </div>
    
    <div>
      <label htmlFor="updateCategory" className="block text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        id="updateCategory"
        name="updateCategory"
        value={updateCategory}
        onChange={(e) => setUpdateCategory(e.target.value)}
        className="form-input"
        required
        aria-required="true"
      >
        <option value="Academic">Academic</option>
        <option value="Behavioral">Behavioral</option>
        <option value="Attendance">Attendance</option>
        <option value="Other">Other</option>
      </select>
    </div>
    
    <div className="flex justify-end space-x-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Saving...' : submitText}
      </button>
    </div>
  </form>
  );
};

export default UpdateForm;
