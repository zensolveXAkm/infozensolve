"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "Zensolve transformed our online presence. Their team is professional, skilled, and delivered beyond our expectations.",
    name: 'Sarah Johnson',
    title: 'CEO, Creative Co.',
    avatar: {
      src: 'https://placehold.co/100x100.png',
      fallback: 'SJ',
      hint: 'business woman'
    },
  },
  {
    quote: "The mobile app they developed for us is a masterpiece of design and functionality. Our user engagement has skyrocketed.",
    name: 'David Chen',
    title: 'Product Manager, FinTech Corp.',
    avatar: {
      src: 'https://placehold.co/100x100.png',
      fallback: 'DC',
      hint: 'professional man'
    },
  },
  {
    quote: "Working with Zensolve on our cloud migration was seamless. Their expertise and support were invaluable.",
    name: 'Maria Garcia',
    title: 'CTO, HealthFirst',
    avatar: {
      src: 'https://placehold.co/100x100.png',
      fallback: 'MG',
      hint: 'woman developer'
    },
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">What Our Clients Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We're proud to have earned the trust of businesses across various industries.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col justify-between items-start h-full p-6">
                      <p className="text-lg font-medium mb-4 italic">"{testimonial.quote}"</p>
                      <div className="flex items-center mt-auto">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.avatar.src} alt={testimonial.name} data-ai-hint={testimonial.avatar.hint} />
                          <AvatarFallback>{testimonial.avatar.fallback}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
