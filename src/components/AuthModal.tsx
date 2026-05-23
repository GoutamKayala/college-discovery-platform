import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Lock, Mail, User as UserIcon, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login(email, password);
        onSuccess(res.user);
        onClose();
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const res = await api.register(name, email, password);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors right-4 top-4"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 mt-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isLogin ? 'Sign in to bookmark colleges and save comparisons' : 'Join thousands of students finding their dream college'}
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 tracking-wider uppercase">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <UserIcon className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full py-2.5 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-600 tracking-wider uppercase">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@edu.in"
                className="w-full py-2.5 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-600 tracking-wider uppercase">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full py-2.5 pl-10 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-2.5 mt-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500">
            {isLogin ? "Don't have an account yet?" : 'Already registered?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-1.5 font-semibold text-blue-600 hover:text-blue-700 outline-hidden hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
