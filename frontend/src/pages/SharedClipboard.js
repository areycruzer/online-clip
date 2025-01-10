import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClipboard } from '../contexts/ClipboardContext';

const SharedClipboard = () => {
  const { link } = useParams();
  const { getSharedClipboard } = useClipboard();
  const [clipboard, setClipboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClipboard = async () => {
      try {
        const data = await getSharedClipboard(link);
        setClipboard(data);
      } catch (err) {
        setError('This clipboard does not exist or is private');
      } finally {
        setLoading(false);
      }
    };

    fetchClipboard();
  }, [link, getSharedClipboard]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clipboard.content);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-8">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{clipboard.title}</h1>
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Copy Content
            </button>
          </div>
          <div className="mt-4">
            <pre className="mt-2 text-gray-500 whitespace-pre-wrap break-words bg-gray-50 rounded-md p-4">
              {clipboard.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedClipboard; 