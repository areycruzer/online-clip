import React, { useState, useRef } from 'react';
import { useClipboard } from '../contexts/ClipboardContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusIcon, 
  ShareIcon, 
  PencilIcon, 
  PaperClipIcon, 
  XCircleIcon,
  SparklesIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { clipboards, loading, error, createClipboard, updateClipboard } = useClipboard();
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPrivate: true,
    files: []
  });
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateClipboard(editingId, formData);
        setEditingId(null);
      } else {
        await createClipboard(formData);
      }
      setFormData({ title: '', content: '', isPrivate: true, files: [] });
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to save clipboard:', err);
    }
  };

  const handleEdit = (clipboard) => {
    setFormData({
      title: clipboard.title,
      content: clipboard.content,
      isPrivate: clipboard.isPrivate
    });
    setEditingId(clipboard._id);
    setIsCreating(true);
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleShare = (clipboard) => {
    if (clipboard.shareableLink) {
      const shareUrl = `${window.location.origin}/shared/${clipboard.shareableLink}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold theme-text flex items-center">
          <SparklesIcon className="h-8 w-8 mr-2 fun-icon" />
          My Magic Clipboards
        </h1>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingId(null);
            setFormData({ title: '', content: '', isPrivate: true, files: [] });
          }}
          className="fun-button emoji-cursor w-full sm:w-auto inline-flex items-center justify-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Magic ✨
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm animate-bounce" role="alert">
          <span className="block sm:inline">Oops! {error}</span>
        </div>
      )}

      {isCreating && (
        <form onSubmit={handleSubmit} className="fun-card p-4 sm:p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium theme-text">
                ✨ Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="fun-input mt-1 block w-full"
                placeholder="Give your clip a magical name..."
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium theme-text">
                🌟 Content
              </label>
              <textarea
                name="content"
                id="content"
                required
                rows={4}
                value={formData.content}
                onChange={handleChange}
                className="fun-input mt-1 block w-full"
                placeholder="Write something magical..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium theme-text">
                📎 Attachments
              </label>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="fun-button"
                >
                  <PaperClipIcon className="h-4 w-4 mr-2 inline" />
                  Add Magic Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </div>
              {formData.files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="fun-card flex items-center justify-between py-2 px-3">
                      <span className="text-sm text-gray-500 truncate flex-1 mr-2">
                        📄 {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0 fun-icon"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPrivate"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm theme-text">
                🔒 Keep it Secret
              </label>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setFormData({ title: '', content: '', isPrivate: true, files: [] });
                }}
                className="w-full sm:w-auto px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="fun-button w-full sm:w-auto"
              >
                {editingId ? '✨ Update Magic' : '✨ Create Magic'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {clipboards.map((clipboard) => (
          <div key={clipboard._id} className="fun-card emoji-cursor">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-base sm:text-lg font-medium theme-text break-words flex-1 mr-2">
                  {clipboard.title}
                </h3>
                <div className="flex space-x-2 flex-shrink-0">
                  {!clipboard.isPrivate && (
                    <button
                      onClick={() => handleShare(clipboard)}
                      className="p-1 rounded-full text-primary-500 hover:text-primary-600 focus:outline-none fun-icon"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(clipboard)}
                    className="p-1 rounded-full text-primary-500 hover:text-primary-600 focus:outline-none fun-icon"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 break-words whitespace-pre-wrap">
                  {clipboard.content}
                </p>
                {clipboard.attachments?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {clipboard.attachments.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fun-button inline-flex items-center text-sm"
                      >
                        <PaperClipIcon className="h-4 w-4 mr-1" />
                        {file.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                <span className={`fun-badge ${
                  clipboard.isPrivate 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {clipboard.isPrivate ? '🔒 Secret' : '🌎 Public'}
                </span>
                <button
                  onClick={() => handleCopy(clipboard.content)}
                  className="fun-button text-sm inline-flex items-center"
                >
                  <FaceSmileIcon className="h-4 w-4 mr-1" />
                  Copy Magic
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 