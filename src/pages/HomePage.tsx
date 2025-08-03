import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Clock } from "lucide-react";
import LoadingPage from "./LoadingPage";

interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  description: string;
  postedDate: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalProfessionals: 0 });
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchJobs = async () => {
    const response = await fetch(
      "https://4ca3fbd2-5bc8-4f19-a1bc-af755fdc7323.mock.pstmn.io/api/jobs"
    );
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  };

  const fetchStats = async () => {
    const response = await fetch(
      "https://4ca3fbd2-5bc8-4f19-a1bc-af755fdc7323.mock.pstmn.io/api/stats"
    );
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  };

  const loadData = async () => {
    try {
      const [jobsData, statsData] = await Promise.all([fetchJobs(), fetchStats()]);
      setJobs(jobsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);


  const handleJobClick = () => {
    // Navigate to loading page as requested
    navigate("/job-details");
  };

    if (loading) {
    return <LoadingPage title="Loading Job Listings" message="Please wait while we fetch the latest job opportunities..." />;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Platform Information - Upper 2/5 */}
      <div className="h-2/5 bg-gradient-to-r from-primary/10 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto h-full flex items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to Skill Bridge
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect your skills with the perfect career opportunities. Our
                platform bridges the gap between talented professionals and
                employers seeking the right expertise.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-primary">{stats.totalJobs}+</h3>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-primary">{stats.totalCompanies}+</h3>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-primary">{stats.totalProfessionals}+</h3>
                <p className="text-sm text-muted-foreground">Professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs - Lower 3/5 */}
      <div className="h-3/5 p-8">
        <div className="max-w-4xl mx-auto h-full">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Available Job Opportunities
          </h2>

          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {jobs.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground text-lg">
                    No jobs posted yet. Use "Post Job Vacancies" to add new
                    opportunities.
                  </p>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card
                  key={job.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={handleJobClick}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="mr-1 h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {job.postedDate}
                      </div>
                    </div>
                    <Badge variant="secondary">{job.category}</Badge>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;