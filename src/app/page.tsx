

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Briefcase, Users, FileText, Phone, Mail, Rocket, Landmark, IndianRupee, Laptop, BriefcaseBusiness, BarChart3, Tv, Award, ShoppingBag, Settings, UserRound, ArrowRightCircle, ChevronRight, GraduationCap, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: 'Placement Services',
    description: 'Helping businesses find top-tier candidates and assisting individuals with job searches.',
  },
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: 'IT Consulting & Services',
    description: 'Providing expert IT consulting to ensure the right information is available to the right people at the right time.',
  },
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    title: 'Business Solutions',
    description: 'Offering tailored application frameworks and end-to-end business solutions to meet your needs.',
  },
  {
    icon: <HeartHandshake className="w-10 h-10 text-primary" />,
    title: 'CSR Projects',
    description: 'Engaging in corporate social responsibility projects to make a positive impact on society.',
  },
];

const categories = [
    { icon: <Laptop className="w-5 h-5" />, name: 'Remote' },
    { icon: <Landmark className="w-5 h-5" />, name: 'MNC' },
    { icon: <IndianRupee className="w-5 h-5" />, name: 'Banking &...' },
    { icon: <Rocket className="w-5 h-5" />, name: 'Startup' },
    { icon: <BriefcaseBusiness className="w-5 h-5" />, name: 'Internship' },
    { icon: <BarChart3 className="w-5 h-5" />, name: 'Data Scien...' },
    { icon: <Tv className="w-5 h-5" />, name: 'Software &...' },
    { icon: <Award className="w-5 h-5" />, name: 'Fortune 500' },
    { icon: <ShoppingBag className="w-5 h-5" />, name: 'Sales' },
    { icon: <Settings className="w-5 h-5" />, name: 'Engineering' },
    { icon: <UserRound className="w-5 h-5" />, name: 'HR' },
];

const topCompanies = [
    { 
        category: 'MNCs', 
        count: '2.1K+',
        logos: [
            { src: 'https://placehold.co/50x50.png', alt: 'Company 1', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 2', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 3', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 4', hint: 'company logo' },
        ] 
    },
    { 
        category: 'Edtech', 
        count: '160',
        logos: [
            { src: 'https://placehold.co/50x50.png', alt: 'Company 5', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 6', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 7', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 8', hint: 'company logo' },
        ] 
    },
    { 
        category: 'Healthcare', 
        count: '616',
        logos: [
            { src: 'https://placehold.co/50x50.png', alt: 'Company 9', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 10', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 11', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 12', hint: 'company logo' },
        ] 
    },
    { 
        category: 'Unicorns', 
        count: '89',
        logos: [
            { src: 'https://placehold.co/50x50.png', alt: 'Company 13', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 14', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 15', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 16', hint: 'company logo' },
        ] 
    },
    { 
        category: 'Internet', 
        count: '250',
        logos: [
            { src: 'https://placehold.co/50x50.png', alt: 'Company 17', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 18', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 19', hint: 'company logo' },
            { src: 'https://placehold.co/50x50.png', alt: 'Company 20', hint: 'company logo' },
        ] 
    },
];

const campusLinks = ["Expert speak", "Contests", "NCAT", "Pathfinder", "Jobs & Internships"];

const popularRoles = [
    { name: 'Full Stack Developer', count: '20.7K+ Jobs' },
    { name: 'Mobile / App Devel...', count: '3.1K+ Jobs' },
    { name: 'Front End Developer', count: '5.2K+ Jobs' },
    { name: 'DevOps Engineer', count: '3.2K+ Jobs' },
    { name: 'Engineering Manager', count: '1.6K+ Jobs' },
    { name: 'Technical Lead', count: '11.2K+ Jobs' },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header variant="transparent" />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-white">
          <Image
            src="https://github.com/akm12109/zensolve-assets/blob/main/herosection.png?raw=true"
            alt="A professional working on a laptop"
            fill
            className="z-0 object-cover"
            data-ai-hint="man laptop cafe"
          />
          <div className="absolute inset-0 bg-primary/10 z-10"></div>
          <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                  Make Career With Us
                </h1>
                <p className="text-lg text-white/90 max-w-lg">
                  Connecting top talent with leading companies. We specialize in IT, placement services, and innovative business solutions to help you achieve your career goals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-lg font-bold">
                    Find Job
                  </Button>
                </div>
              </div>
               <div className="hidden md:flex flex-col items-end space-y-4 self-end">
                <div className="flex items-center gap-3">
                  <span className="text-lg">+91 2269622941</span>
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">support@infozensolve.in</span>
                  <Mail className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections from images */}
        <section className="bg-secondary/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mock Interview Banner */}
                <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl p-8 flex justify-between items-center text-white relative overflow-hidden mb-12">
                    <div className="relative z-10">
                        <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">Quick & Easy</div>
                        <h2 className="text-3xl font-bold">Leave your resume here</h2>
                        <p className="opacity-90 mb-6">And let us find the best job for you.</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 py-3">Upload Resume</Button>
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
                    {categories.map(category => (
                        <Link key={category.name} href="/jobs">
                          <Button variant="outline" className="w-full justify-start bg-white shadow-sm hover:shadow-md h-12">
                              {category.icon}
                              <span className="ml-3 font-semibold">{category.name}</span>
                              <ArrowRight className="ml-auto w-4 h-4 text-muted-foreground" />
                          </Button>
                        </Link>
                    ))}
                </div>

                {/* Top Companies */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-foreground">Top companies hiring now</h2>
                </div>
                <div className="relative">
                    <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
                        {topCompanies.map(company => (
                            <Card key={company.category} className="min-w-[280px] flex-shrink-0">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="text-lg">{company.category}</span>
                                        <ArrowRight className="w-5 h-5 text-primary" />
                                    </CardTitle>
                                    <CardDescription>{company.count} are actively hiring</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 gap-4">
                                        {company.logos.map(logo => (
                                            <div key={logo.alt} className="flex items-center justify-center p-1 bg-muted rounded-md">
                                                <Image src={logo.src} alt={logo.alt} width={40} height={40} data-ai-hint={logo.hint} />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Button variant="ghost" size="icon" className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md hidden md:flex">
                        <ArrowRightCircle />
                    </Button>
                </div>
            </div>
        </section>
        
        {/* Career Platform & Popular Roles Section */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Career Platform Banner */}
            <Card className="p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-primary/10 relative overflow-hidden mb-16">
               <Badge variant="outline" className="absolute top-4 right-4 bg-purple-100 text-purple-700 border-purple-200">Just launched</Badge>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-12 h-12 text-primary" />
                      </div>
                  </div>
                  <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Introducing a career platform for college students & fresh grads</h2>
                      <p className="text-muted-foreground mb-4">Explore contests, webinars, take aptitude test, prepare for your dream career & find jobs & internships</p>
                      <div className="flex flex-wrap gap-2">
                          {campusLinks.map(link => (
                              <Button key={link} variant="ghost" size="sm" className="text-muted-foreground hover:bg-secondary">
                                  {link} <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                          ))}
                      </div>
                  </div>
                  <div className="flex-shrink-0">
                      <Button asChild size="lg" className="rounded-lg px-8">
                        <Link href="/jobs">Explore now</Link>
                      </Button>
                  </div>
              </div>
            </Card>

            {/* Popular Roles */}
            <div className="bg-orange-50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 text-center md:text-left">
                    <Image src="https://github.com/akm12109/zensolve-assets/blob/main/role-collection-ot.png?raw=true" alt="Discover jobs illustration" width={300} height={300} className="mx-auto" data-ai-hint="man searching job" />
                    <h2 className="text-3xl font-bold text-foreground mt-4">Discover jobs across popular roles</h2>
                    <p className="text-muted-foreground mt-2">Select a role and we'll show you relevant jobs for it!</p>
                </div>
                <div className="md:w-2/3 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {popularRoles.map(role => (
                            <Card key={role.name} className="bg-white hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{role.name}</p>
                                        <p className="text-sm text-muted-foreground">{role.count}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                     <Button variant="ghost" size="icon" className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md hidden md:flex">
                        <ChevronRight />
                    </Button>
                </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-center mb-12">
              Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((item) => (
                <Card key={item.title} className="bg-primary-foreground/10 border-0 overflow-hidden text-primary-foreground text-center">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="p-4 bg-primary/20 rounded-full mb-4">
                      {item.icon}
                    </div>
                    <p className="font-bold text-lg">{item.title}</p>
                    <p className="mt-2 text-sm opacity-90">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
