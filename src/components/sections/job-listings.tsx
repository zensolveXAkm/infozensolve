"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Star, Bookmark, ChevronLeft, ChevronRight, IndianRupee, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  workMode: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  department: string;
  companyType: string;
  roleCategory: string;
  education: string;
  industry: string;
  description: string;
  tags: string[];
  postedAt: Timestamp;
}

type FilterCounts = {
  workMode: Record<string, number>;
  companyType: Record<string, number>;
  industry: Record<string, number>;
  department: Record<string, number>;
  roleCategory: Record<string, number>;
  education: Record<string, number>;
  location: Record<string, number>;
};

const JobCard = ({ job }: { job: Job }) => {
    const postedDate = job.postedAt ? job.postedAt.toDate() : new Date();
    const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

    return (
    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white">
        <CardContent className="p-4">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <p className="font-medium text-foreground">{job.company}</p>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.0</span>
                        <span>27532 Reviews</span>
                    </div>
                </div>
                 <Image src={`https://placehold.co/40x40.png`} alt={`${job.company} logo`} width={40} height={40} className="rounded-md" data-ai-hint="company logo" />
            </div>

             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground my-3">
                <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" /> 
                    <span>
                      {job.experienceMin !== undefined && job.experienceMax !== undefined 
                        ? `${job.experienceMin}-${job.experienceMax} Yrs` 
                        : 'Not specified'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4" /> 
                    <span>
                      {job.salaryMin !== undefined && job.salaryMax !== undefined
                        ? `${job.salaryMin}-${job.salaryMax} Lacs PA`
                        : 'Not disclosed'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> <span>{job.location}</span>
                </div>
             </div>
             
             <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                <p className='truncate'>{job.description}</p>
             </div>

            <div className="flex flex-wrap gap-2 my-4">
                {job.tags.slice(0, 4).map(tag => (
                <Badge key={tag} variant="secondary" className="bg-secondary/70">{tag}</Badge>
                ))}
            </div>

            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">{timeAgo}</p>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/jobs/${job.id}/apply`}>Apply</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
            </div>
        </CardContent>
    </Card>
    );
}

const FilterAccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b py-4">
      <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-semibold">{title}</h3>
        {isOpen ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4" />}
      </Button>
      {isOpen && <div className="space-y-2 mt-2">{children}</div>}
    </div>
  )
}

const FilterCheckbox = ({ label, count }: { label: string; count: number }) => (
  <div className="flex items-center justify-between">
    <label htmlFor={label} className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox id={label} /> {label}</label>
    <span className="text-xs text-muted-foreground">({count})</span>
  </div>
);


const FilterSection = ({ counts }: { counts: FilterCounts | null }) => {
  const renderCheckboxes = (category: keyof FilterCounts, options: string[], limit = 4) => {
    const categoryCounts = counts ? counts[category] : {};
    const allOptions = options.length > 0 ? options : Object.keys(categoryCounts);
    
    // Sort options based on their counts
    const sortedOptions = allOptions.sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));

    return sortedOptions.slice(0, limit).map(option => (
      <FilterCheckbox key={option} label={option} count={categoryCounts[option] || 0} />
    ));
  };
  
  return (
    <Card className="bg-white/70 backdrop-blur-sm sticky top-24">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg">All Filters</CardTitle>
        <Button variant="link" className="p-0 h-auto text-primary">Clear All</Button>
      </CardHeader>
      <CardContent className="divide-y">
        
        <FilterAccordionItem title="Work Mode">
          {renderCheckboxes('workMode', ['Work from office', 'Remote', 'Hybrid'])}
        </FilterAccordionItem>

        <FilterAccordionItem title="Experience">
          <div className="mt-2 space-y-4">
            <div className="relative">
              <Slider defaultValue={[5]} max={30} step={1} />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0 Yrs</span>
              <span>30 Yrs</span>
            </div>
          </div>
        </FilterAccordionItem>
        
        <FilterAccordionItem title="Salary">
          <FilterCheckbox label="0-3 Lakhs" count={0} />
          <FilterCheckbox label="3-6 Lakhs" count={0} />
          <FilterCheckbox label="6-10 Lakhs" count={0} />
          <FilterCheckbox label="10-15 Lakhs" count={0} />
        </FilterAccordionItem>

        <FilterAccordionItem title="Location">
          <div className='relative my-2'>
            <Input placeholder='Search location...' className='pr-8' />
            <Search className='w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
          </div>
          {renderCheckboxes('location', [])}
        </FilterAccordionItem>

        <FilterAccordionItem title="Company Type">
          {renderCheckboxes('companyType', ['Corporate', 'Foreign MNC', 'Startup', 'Indian MNC'])}
        </FilterAccordionItem>

        <FilterAccordionItem title="Industry">
          {renderCheckboxes('industry', ['IT Services & Consulting', 'Software Product', 'Recruitment / Staffing', 'Education / Training'])}
        </FilterAccordionItem>

        <FilterAccordionItem title="Department">
           {renderCheckboxes('department', ['Engineering - Software & QA', 'Sales & Business Development', 'Data Science & Analytics', 'Marketing & Communication'])}
        </FilterAccordionItem>
        
        <FilterAccordionItem title="Role Category">
          {renderCheckboxes('roleCategory', ['Software Development', 'Quality Assurance and Testing', 'BD / Pre Sales', 'DevOps'])}
        </FilterAccordionItem>

        <FilterAccordionItem title="Education">
          {renderCheckboxes('education', ['Any Postgraduate', 'MBA/PGDM', 'Any Graduate', 'B.Tech/B.E.'])}
        </FilterAccordionItem>

      </CardContent>
    </Card>
  )
}

const RightSidebar = () => (
  <div className="space-y-4 sticky top-24">
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">See jobs in Featured Companies</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Image src="https://placehold.co/100x40.png" width={100} height={40} alt="The Hackett Group" data-ai-hint="company logo" />
        <Image src="https://placehold.co/100x40.png" width={100} height={40} alt="Judge" data-ai-hint="company logo" />
        <Image src="https://placehold.co/100x40.png" width={100} height={40} alt="IQVIA" data-ai-hint="company logo" />
        <Image src="https://placehold.co/100x40.png" width={100} height={40} alt="Akamai" data-ai-hint="company logo" />
      </CardContent>
    </Card>
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <Image src="https://placehold.co/100x25.png" width={100} height={25} alt="Naukri FastForward" data-ai-hint="company logo" />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-base">Get 3X more profile views</CardTitle>
        <CardDescription className="text-sm mt-2">Increase your chances of callback with our services.</CardDescription>
        <Button variant="link" className="p-0 h-auto mt-2">Know More</Button>
      </CardContent>
    </Card>
  </div>
)

import { Search } from 'lucide-react';

const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const filterChips = ["Engineering", "Remote", "Startup", "Data Science", "MNC", "Fresher"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, 'jobs');
        const q = query(jobsCollection, orderBy('postedAt', 'desc'));
        const jobsSnapshot = await getDocs(q);
        const jobsData = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filterCounts: FilterCounts | null = useMemo(() => {
    if (jobs.length === 0) return null;

    const counts: FilterCounts = {
      workMode: {},
      companyType: {},
      industry: {},
      department: {},
      roleCategory: {},
      education: {},
      location: {},
    };

    jobs.forEach(job => {
      // Helper to increment count for a category
      const increment = (category: keyof FilterCounts, value: string) => {
        if (!value) return;
        counts[category][value] = (counts[category][value] || 0) + 1;
      };

      increment('workMode', job.workMode);
      increment('companyType', job.companyType);
      increment('industry', job.industry);
      increment('department', job.department);
      increment('roleCategory', job.roleCategory);
      increment('education', job.education);
      increment('location', job.location);
    });

    return counts;
  }, [jobs]);

  return (
    <div id="jobs" className="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <Card className="p-4 mb-6 bg-white/70 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Enter skills / designations / companies" className="pl-10 h-11" />
          </div>
          <Button size="lg" className="h-11">Search</Button>
        </div>
      </Card>


      <div className="relative mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <Button variant="ghost" size="icon" className="bg-white rounded-full shadow-md shrink-0"><ChevronLeft /></Button>
            {filterChips.map(chip => (
                <Button key={chip} variant="outline" className="rounded-full bg-white whitespace-nowrap shrink-0">{chip}</Button>
            ))}
            <Button variant="ghost" size="icon" className="bg-white rounded-full shadow-md shrink-0"><ChevronRight /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-start">
        <aside className="hidden lg:block lg:col-span-1 xl:col-span-1">
          <FilterSection counts={filterCounts} />
        </aside>

        <main className="lg:col-span-3 xl:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm text-muted-foreground font-semibold">Showing {jobs.length} results</h2>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px] bg-white text-sm">
                  <span className="text-muted-foreground mr-1">Sort by:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

             {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : jobs.length > 0 ? (
                <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
                </div>
            ) : (
                <Card className="h-96 flex flex-col items-center justify-center text-center p-4">
                    <h3 className='text-lg font-semibold'>No jobs found.</h3>
                    <p className='text-muted-foreground'>No jobs were posted yet. Please check back later.</p>
                </Card>
            )}
        </main>

        <aside className="hidden xl:block xl:col-span-1">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};

export default JobListings;
