import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Wifi } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 text-center transition-colors duration-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/8 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
          <img src="/apisentinel_logo.png" alt="ApiSentinel" className="h-10 w-auto transition-transform group-hover:scale-105" />
          <span className="font-bold text-lg text-gray-900 dark:text-white">ApiSentinel</span>
        </Link>

        {/* Animated status icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
            <div className="relative bg-red-50 dark:bg-red-900/30 p-5 rounded-full ring-8 ring-red-50 dark:ring-red-900/10">
              <Wifi className="w-10 h-10 text-red-500 dark:text-red-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* 404 text */}
        <div className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 select-none mb-4 leading-none">
          404
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Endpoint not found</h1>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-10">
          Even ApiSentinel couldn't resolve this route.<br />
          The page you're looking for doesn't exist.
        </p>

        {/* Status-style indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium mb-10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          HTTP 404 — Not Found
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
