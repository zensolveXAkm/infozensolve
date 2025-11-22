import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    title: 'Corporate Website Redesign',
    description: 'A complete overhaul of a legacy website, resulting in a 40% increase in user engagement and a modern, responsive design.',
    image: 'https://placehold.co/600x400.png',
    tags: ['UI/UX Design', 'Web Development'],
    hint: 'corporate website'
  },
  {
    title: 'E-commerce Platform',
    description: 'Developed a scalable e-commerce solution with custom features, handling over 10,000 transactions per month.',
    image: 'https://placehold.co/600x400.png',
    tags: ['Web Development', 'Cloud Solutions'],
    hint: 'online store'
  },
  {
    title: 'Mobile Banking App',
    description: 'A secure and intuitive mobile banking application for a leading financial institution, now used by over 1 million customers.',
    image: 'https://placehold.co/600x400.png',
    tags: ['Mobile App', 'Cybersecurity'],
    hint: 'mobile banking'
  },
  {
    title: 'SaaS Dashboard',
    description: 'Designed and built a complex data visualization dashboard for a SaaS product, improving data accessibility for users.',
    image: 'https://placehold.co/600x400.png',
    tags: ['UI/UX Design', 'SaaS'],
    hint: 'data dashboard'
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Our Portfolio</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Take a look at some of the successful projects we've delivered for our clients.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden group">
              <div className="overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  data-ai-hint={project.hint}
                  className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-base">{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
