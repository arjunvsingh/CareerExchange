import React from 'react';
import JobPostingForm from '../components/forms/JobPostingForm';

const PostJobPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
      <JobPostingForm />
    </div>
  );
};

export default PostJobPage;
