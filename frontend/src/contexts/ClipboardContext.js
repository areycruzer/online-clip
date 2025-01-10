import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { useAuth } from './AuthContext';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-79HP2EG7HF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const ClipboardContext = createContext(null);
const LOCAL_STORAGE_KEY = 'private_clipboards';

export const useClipboard = () => useContext(ClipboardContext);

const uploadFile = async (file) => {
  const fileRef = ref(storage, `files/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return {
    url: downloadURL,
    path: fileRef.fullPath,
    name: file.name,
    type: file.type
  };
};

export const ClipboardProvider = ({ children }) => {
  const [clipboards, setClipboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Load private clipboards from localStorage
  useEffect(() => {
    const savedPrivateClipboards = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPrivateClipboards) {
      const privateClips = JSON.parse(savedPrivateClipboards);
      setClipboards(prevClips => [...prevClips, ...privateClips]);
    }
  }, []);

  // Fetch public clipboards when user logs in
  useEffect(() => {
    if (user) {
      fetchPublicClipboards();
    } else {
      setClipboards([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPublicClipboards = async () => {
    try {
      setLoading(true);
      const clipboardsRef = collection(db, 'clipboards');
      const q = query(
        clipboardsRef,
        where('isPrivate', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedClipboards = [];
      querySnapshot.forEach((doc) => {
        fetchedClipboards.push({ 
          _id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
          lastModified: doc.data().lastModified?.toDate?.() || new Date(doc.data().lastModified)
        });
      });
      
      // Get private clipboards from localStorage
      const savedPrivateClipboards = localStorage.getItem(LOCAL_STORAGE_KEY);
      const privateClipboards = savedPrivateClipboards ? JSON.parse(savedPrivateClipboards) : [];
      
      // Combine and sort all clipboards
      const allClipboards = [...fetchedClipboards, ...privateClipboards];
      allClipboards.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      
      setClipboards(allClipboards);
      setError('');
    } catch (err) {
      console.error('Error fetching clipboards:', err);
      setError('Failed to fetch clipboards');
    } finally {
      setLoading(false);
    }
  };

  const createClipboard = async (clipboardData) => {
    try {
      let fileAttachments = [];
      
      // Upload files if any
      if (clipboardData.files && clipboardData.files.length > 0) {
        const uploadPromises = Array.from(clipboardData.files).map(uploadFile);
        fileAttachments = await Promise.all(uploadPromises);
      }

      const newClipboard = {
        ...clipboardData,
        files: fileAttachments,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        shareableLink: clipboardData.isPrivate ? null : Math.random().toString(36).substring(7)
      };

      // Remove the original files array that contains File objects
      delete newClipboard.files;
      newClipboard.attachments = fileAttachments;

      if (clipboardData.isPrivate) {
        // Store private clipboard locally
        const _id = Date.now().toString();
        const privateClipboard = { _id, ...newClipboard };
        
        const savedPrivateClipboards = localStorage.getItem(LOCAL_STORAGE_KEY);
        const privateClipboards = savedPrivateClipboards ? JSON.parse(savedPrivateClipboards) : [];
        privateClipboards.unshift(privateClipboard);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(privateClipboards));
        
        setClipboards([privateClipboard, ...clipboards]);
        return privateClipboard;
      } else {
        const docRef = await addDoc(collection(db, 'clipboards'), newClipboard);
        const createdClipboard = { _id: docRef.id, ...newClipboard };
        setClipboards([createdClipboard, ...clipboards]);
        return createdClipboard;
      }
    } catch (err) {
      console.error('Error creating clipboard:', err);
      setError('Failed to create clipboard');
      throw err;
    }
  };

  const updateClipboard = async (id, clipboardData) => {
    try {
      const updatedClipboard = {
        ...clipboardData,
        lastModified: new Date().toISOString(),
        shareableLink: clipboardData.isPrivate ? null : 
          clipboards.find(c => c._id === id)?.shareableLink || 
          Math.random().toString(36).substring(7)
      };

      const existingClipboard = clipboards.find(c => c._id === id);
      
      if (existingClipboard?.isPrivate && !clipboardData.isPrivate) {
        // If changing from private to public, move to Firebase
        const docRef = await addDoc(collection(db, 'clipboards'), updatedClipboard);
        await deleteClipboard(id); // Remove from localStorage
        const createdClipboard = { _id: docRef.id, ...updatedClipboard };
        setClipboards(prevClips => 
          [createdClipboard, ...prevClips.filter(clip => clip._id !== id)]
        );
        return createdClipboard;
      } else if (!existingClipboard?.isPrivate && clipboardData.isPrivate) {
        // If changing from public to private, move to localStorage
        const clipboardRef = doc(db, 'clipboards', id);
        await deleteDoc(clipboardRef);
        
        const _id = Date.now().toString();
        const privateClipboard = { _id, ...updatedClipboard };
        
        // Update localStorage
        const savedPrivateClipboards = localStorage.getItem(LOCAL_STORAGE_KEY);
        const privateClipboards = savedPrivateClipboards ? JSON.parse(savedPrivateClipboards) : [];
        privateClipboards.unshift(privateClipboard);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(privateClipboards));
        
        setClipboards(prevClips => 
          [privateClipboard, ...prevClips.filter(clip => clip._id !== id)]
        );
        return privateClipboard;
      } else if (existingClipboard?.isPrivate) {
        // Update private clipboard in localStorage
        const savedPrivateClipboards = localStorage.getItem(LOCAL_STORAGE_KEY);
        let privateClipboards = savedPrivateClipboards ? JSON.parse(savedPrivateClipboards) : [];
        
        privateClipboards = privateClipboards.map(clip => 
          clip._id === id ? { _id: id, ...updatedClipboard } : clip
        );
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(privateClipboards));
        
        setClipboards(clipboards.map(clipboard => 
          clipboard._id === id ? { _id: id, ...updatedClipboard } : clipboard
        ));
        
        return { _id: id, ...updatedClipboard };
      } else {
        // Update public clipboard in Firebase
        const clipboardRef = doc(db, 'clipboards', id);
        await updateDoc(clipboardRef, updatedClipboard);
        
        setClipboards(clipboards.map(clipboard => 
          clipboard._id === id ? { _id: id, ...updatedClipboard } : clipboard
        ));
        
        return { _id: id, ...updatedClipboard };
      }
    } catch (err) {
      console.error('Error updating clipboard:', err);
      setError('Failed to update clipboard');
      throw err;
    }
  };

  const deleteClipboard = async (id) => {
    try {
      const clipboardToDelete = clipboards.find(c => c._id === id);
      
      // Delete attached files if any
      if (clipboardToDelete?.attachments?.length > 0) {
        const deletePromises = clipboardToDelete.attachments.map(file => {
          const fileRef = ref(storage, file.path);
          return deleteObject(fileRef).catch(err => {
            console.error('Error deleting file:', err);
          });
        });
        await Promise.all(deletePromises);
      }

      if (clipboardToDelete?.isPrivate) {
        const savedPrivateClipboards = localStorage.getItem(LOCAL_STORAGE_KEY);
        let privateClipboards = savedPrivateClipboards ? JSON.parse(savedPrivateClipboards) : [];
        privateClipboards = privateClipboards.filter(clip => clip._id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(privateClipboards));
      } else {
        const clipboardRef = doc(db, 'clipboards', id);
        await deleteDoc(clipboardRef);
      }
      
      setClipboards(clipboards.filter(clipboard => clipboard._id !== id));
      setError('');
    } catch (err) {
      console.error('Error deleting clipboard:', err);
      setError('Failed to delete clipboard');
      throw err;
    }
  };

  const getSharedClipboard = async (link) => {
    try {
      const clipboardsRef = collection(db, 'clipboards');
      const q = query(
        clipboardsRef,
        where('shareableLink', '==', link),
        where('isPrivate', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Shared clipboard not found');
      }
      
      const docData = querySnapshot.docs[0];
      return { 
        _id: docData.id, 
        ...docData.data(),
        createdAt: docData.data().createdAt || new Date().toISOString(),
        lastModified: docData.data().lastModified || new Date().toISOString()
      };
    } catch (err) {
      console.error('Error fetching shared clipboard:', err);
      setError('Failed to fetch shared clipboard');
      throw err;
    }
  };

  const value = {
    clipboards,
    loading,
    error,
    createClipboard,
    updateClipboard,
    deleteClipboard,
    getSharedClipboard
  };

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  );
} 