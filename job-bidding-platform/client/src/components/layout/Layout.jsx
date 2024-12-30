import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isEmployer } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return null;
    return isEmployer() ? '/employer/dashboard' : '/applicant/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              {user && (
                <>
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
                  {isEmployer() && (
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
                  )}
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <Link
                    to={getDashboardLink()}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive(getDashboardLink())
                        ? "text-black"
                        : "text-muted-foreground"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-sm"
                  >
                    Sign Out
                  </Button>
                </>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
              )}
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