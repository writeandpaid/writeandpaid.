import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    id: "testimonial-1",
    name: "Jessica M.",
    location: "Texas, USA",
    quote: "I was skeptical, but Write & Paid is the real deal. I made back my investment in the first month and now it's my main side hustle. So grateful!",
    avatar: placeholderImages.find(p => p.id === "avatar-1"),
  },
  {
    id: "testimonial-2",
    name: "David R.",
    location: "Florida, USA",
    quote: "The training is so clear and easy to follow. I was sending out letters within a week. It's the most flexible work I've ever had.",
    avatar: placeholderImages.find(p => p.id === "avatar-2"),
  },
  {
    id: "testimonial-3",
    name: "Sarah K.",
    location: "California, USA",
    quote: "As a stay-at-home mom, this has been a game-changer. I can earn money during nap times without any pressure. Highly recommend!",
    avatar: placeholderImages.find(p => p.id === "avatar-3"),
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black">Loved By Writers Across The USA</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Don't just take our word for it. Here's what our members are saying.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-card/80 backdrop-blur-sm">
              <CardContent className="p-0 flex-grow">
                <p className="italic">"{testimonial.quote}"</p>
              </CardContent>
              <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                  {testimonial.avatar && <Avatar>
                    <AvatarImage src={testimonial.avatar.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.avatar.imageHint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>}
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
