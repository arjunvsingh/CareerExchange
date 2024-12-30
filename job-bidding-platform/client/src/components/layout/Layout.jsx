import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/') 
                    ? "text-black" 
                    : "text-muted-foreground"
                )}
              >
                Job Board
              </Link>
              <Link 
                to="/post-job"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/post-job') 
                    ? "text-black" 
                    : "text-muted-foreground"
                )}
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default Layout; 