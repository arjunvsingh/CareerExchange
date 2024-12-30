// components/jobs/JobCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { user, isApplicant } = useAuth();
  const { id, title, company, description, skills, timeline } = job;

  const skillsList = skills.split(',').map(skill => skill.trim());

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-base mt-1">{company}</CardDescription>
          </div>
          <Badge variant="outline">{timeline}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/jobs/${id}`)}
        >
          View Details
        </Button>
        {user && isApplicant() && (
          <Button
            onClick={() => navigate(`/jobs/${id}/bid`)}
            className="bg-black hover:bg-gray-800"
          >
            Place Bid
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;