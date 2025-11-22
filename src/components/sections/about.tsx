import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  {
    name: 'Anand Kumar',
    role: 'Director',
    image: 'https://placehold.co/100x100.png',
    fallback: 'AK',
    hint: 'man portrait'
  },
  {
    name: 'Rupesh Kumar Thakur',
    role: 'Director',
    image: 'https://placehold.co/100x100.png',
    fallback: 'RT',
    hint: 'man professional'
  },
];

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">About Zensolve Infotech</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Incorporated on January 15, 2024, Zensolve Infotech Solution Private Limited has been at the forefront of technological innovation. Our mission is to deliver exceptional IT solutions that drive growth, efficiency, and success for our clients.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe in building long-term partnerships based on trust, transparency, and a shared commitment to excellence. Our team of experts is passionate about solving complex challenges and turning ideas into reality across various sectors including BFSI, Manufacturing, Education, and more.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Zensolve Office"
              width={600}
              height={400}
              data-ai-hint="modern office"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">Meet Our Directors</h3>
          <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
            The passionate people behind our success.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-sm mx-auto">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.hint} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <h4 className="text-lg font-bold">{member.name}</h4>
                <p className="text-sm text-primary">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
