'use client';

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Loader2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

interface SavedJugaad {
  id: string;
  problem: string;
  solution: string;
  createdAt: any;
  userId: string;
}

export function SavedIdeas() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<SavedJugaad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    const path = `users/${user.uid}/savedJugaads`;
    const q = query(
      collection(db, path),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedIdeas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SavedJugaad[];
      setIdeas(fetchedIdeas);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/savedJugaads`;
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  if (!user) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="text-orange-600" size={28} />
        <h2 className="text-3xl font-extrabold text-orange-900 font-display">My Saved Jugaads</h2>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center p-8 bg-orange-100/50 rounded-3xl border border-orange-200">
          <p className="text-orange-700">You haven&apos;t saved any jugaads yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {ideas.map((idea) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-xl shadow-orange-900/5 p-6 sm:p-8 border border-orange-100 relative group"
              >
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="absolute top-4 right-4 p-2 text-orange-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Delete saved idea"
                >
                  <Trash2 size={20} />
                </button>
                
                <div className="mb-4 pr-8">
                  <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-1">Problem</h3>
                  <p className="text-orange-900 font-medium">{idea.problem}</p>
                </div>
                
                <div className="pt-4 border-t border-orange-100">
                  <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-3">Jugaad Solution</h3>
                  <div className="prose prose-orange max-w-none prose-sm sm:prose-base">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{idea.solution}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
