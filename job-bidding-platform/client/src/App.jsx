import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import JobPostingForm from './components/forms/JobPostingForm';
import JobsPage from './pages/JobsPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <nav className="bg-white shadow-lg w-full">
            <div className="max-w mx-auto px-6 w-full">
              <div className="flex justify-between items-center h-16">
                <div className="flex space-x-8">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Job Board
                  </Link>
                  <Link 
                    to="/post-job" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1 w-full bg-gray-50">
            <div className="max-w-[2000px] mx-auto px-6 py-8 w-full">
              <Routes>
                <Route path="/" element={<JobsPage />} />
                <Route path="/post-job" element={<JobPostingForm />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;