import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import PostJobPage from './pages/PostJobPage';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;