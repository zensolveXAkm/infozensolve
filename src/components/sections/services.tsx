import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Users, FileText } from 'lucide-react';

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
];

const Services = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Our Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We provide a wide range of solutions to help your business thrive in the digital age.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
              </CardHeader>
              <CardDescription className="px-6 pb-6 text-base">
                {service.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
