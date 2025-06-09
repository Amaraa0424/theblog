"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Animation */}
        <div className="relative">
          <div className="text-9xl font-bold text-gray-200 dark:text-gray-800 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Here's what you can do:
          </h2>
          <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Check the URL for any typos</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Go back to the previous page</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span>Visit our homepage to start fresh</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Browse our latest blog posts</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
          
          <Link href="/">
            <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
          </Link>
          
          <Link href="/posts">
            <Button variant="outline" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Browse Posts</span>
            </Button>
          </Link>
        </div>

        {/* Fun Quote */}
        <div className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400">
          "Not all those who wander are lost... but this page definitely is."
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-500 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute bottom-40 right-10 w-5 h-5 bg-green-500 rounded-full animate-ping opacity-40"></div>
    </div>
  );
}