'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Wrench, Sparkles, Loader2, RefreshCw, Bookmark, LogIn, LogOut } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../components/AuthProvider';
import { SavedIdeas } from '../components/SavedIdeas';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

export default function JugaadGenerator() {
  const [problem, setProblem] = useState('');
  const [jugaad, setJugaad] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, signInWithGoogle, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveIdea = async () => {
    if (!user || !jugaad) return;
    setIsSaving(true);
    setSaveSuccess(false);
    const path = `users/${user.uid}/savedJugaads`;
    try {
      await addDoc(collection(db, path), {
        problem,
        solution: jugaad,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      setSaveSuccess(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const generateJugaad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setIsLoading(true);
    setError(null);
    setJugaad(null);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/generate-jugaad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate a response.');
      }

      if (data.jugaad) {
        setJugaad(data.jugaad);
      } else {
        throw new Error('Failed to generate a response.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 text-orange-950 font-sans selection:bg-orange-200">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <div className="flex justify-end mb-8">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-orange-800">
                Hi, {user.displayName?.split(' ')[0] || 'User'}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full transition-colors shadow-sm"
            >
              <LogIn size={16} />
              Sign in to Save Ideas
            </button>
          )}
        </div>

        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-6 text-orange-600 shadow-sm"
          >
            <Lightbulb size={40} className="animate-pulse" />
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-orange-900 mb-4 font-display"
          >
            Jugaad Idea Generator
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-orange-700/80 max-w-xl mx-auto"
          >
            Enter your everyday problem, and get a low-cost, highly creative, and typically Indian &quot;hack&quot; to fix it.
          </motion.p>
        </header>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl shadow-orange-900/5 p-6 sm:p-8 border border-orange-100"
        >
          <form onSubmit={generateJugaad} className="space-y-6">
            <div>
              <label htmlFor="problem" className="block text-sm font-semibold text-orange-900 mb-2">
                What&apos;s the problem?
              </label>
              <textarea
                id="problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g., My laptop charger keeps falling off the desk..."
                className="w-full min-h-[120px] p-4 rounded-2xl bg-orange-50/50 border border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all resize-none text-orange-900 placeholder:text-orange-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !problem.trim()}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-orange-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating Jugaad...
                </>
              ) : (
                <>
                  <Wrench size={20} />
                  Find a Jugaad
                </>
              )}
            </button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center"
            >
              {error}
            </motion.div>
          )}

          {jugaad && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-orange-500" size={24} />
                <h2 className="text-2xl font-bold text-orange-900">Your Jugaad Solution</h2>
              </div>
              <div className="bg-white rounded-3xl shadow-xl shadow-orange-900/5 p-6 sm:p-8 border border-orange-100 prose prose-orange max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{jugaad}</ReactMarkdown>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                {user && (
                  <button
                    onClick={handleSaveIdea}
                    disabled={isSaving || saveSuccess}
                    className="inline-flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 disabled:bg-orange-50 text-orange-700 font-bold py-3 px-6 rounded-2xl transition-all w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : saveSuccess ? (
                      <Bookmark className="fill-orange-700" size={18} />
                    ) : (
                      <Bookmark size={18} />
                    )}
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Idea'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setProblem('');
                    setJugaad(null);
                    setSaveSuccess(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 text-orange-600 hover:text-orange-800 font-medium transition-colors py-3 px-6 w-full sm:w-auto"
                >
                  <RefreshCw size={18} />
                  Try another problem
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {user && <SavedIdeas />}
      </div>
    </div>
  );
}
