import { Github, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="https://github.com/Jenish1409" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/in/jenish-raichura-9b535727b/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1 flex flex-col md:flex-row items-center gap-2">
            <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mr-4">ApiSentinel</Link>
            <p className="text-center text-base text-gray-500 dark:text-gray-400 flex items-center">
              &copy; {new Date().getFullYear()} All rights reserved. Made with <Heart className="h-4 w-4 text-red-500 mx-1" fill="currentColor" /> by <span className="font-semibold text-gray-900 dark:text-gray-200 ml-1">Jenish Raichura</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
