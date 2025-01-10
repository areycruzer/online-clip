import React, { useState } from 'react';
import { useClipboard } from '../contexts/ClipboardContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { clipboards, deleteClipboard, loading, error } = useClipboard();
  const { user } = useAuth();
  const [selectedClipboards, setSelectedClipboards] = useState(new Set());
  const [deleteStatus, setDeleteStatus] = useState('');

  // Redirect if not admin
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedClipboards(new Set(clipboards.map(clip => clip._id)));
    } else {
      setSelectedClipboards(new Set());
    }
  };

  const handleSelect = (id) => {
    const newSelected = new Set(selectedClipboards);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedClipboards(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm('Are you sure you want to delete selected clipboards?')) {
      return;
    }
    
    setDeleteStatus('Deleting...');
    try {
      const promises = Array.from(selectedClipboards).map(id => deleteClipboard(id));
      await Promise.all(promises);
      setSelectedClipboards(new Set());
      setDeleteStatus('Successfully deleted selected clipboards');
    } catch (err) {
      console.error('Error deleting clipboards:', err);
      setDeleteStatus('Failed to delete some clipboards');
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this clipboard?')) {
      return;
    }
    
    try {
      await deleteClipboard(id);
      setDeleteStatus('Successfully deleted clipboard');
    } catch (err) {
      setDeleteStatus('Failed to delete clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        {selectedClipboards.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Delete Selected ({selectedClipboards.size})
          </button>
        )}
      </div>

      {(error || deleteStatus) && (
        <div className={`p-4 mb-4 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {error || deleteStatus}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600"
              onChange={handleSelectAll}
              checked={selectedClipboards.size === clipboards.length}
            />
            <span className="ml-2 text-sm text-gray-700">Select All</span>
          </label>
        </div>
        
        <div className="divide-y divide-gray-200">
          {clipboards.map((clipboard) => (
            <div key={clipboard._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600"
                    checked={selectedClipboards.has(clipboard._id)}
                    onChange={() => handleSelect(clipboard._id)}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{clipboard.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 break-words">{clipboard.content}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        clipboard.isPrivate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {clipboard.isPrivate ? 'Private' : 'Public'}
                      </span>
                      <span className="ml-2">
                        Created: {new Date(clipboard.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSingle(clipboard._id)}
                  className="ml-4 text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin; 