import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { organizers } from "@/lib/data";

export default function Organisers() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/90 via-primary/70 to-background py-20">
        <img
          src="/images/hero/mountains_2.jpg"
          alt="Mountainous landscape fading out"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"

        />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 bg-card/20 text-card backdrop-blur-sm border-card/30">
            Meet Our Hike Leaders
          </Badge>

          <h1 className="mb-4 font-heading text-4xl font-bold text-snow md:text-5xl">Our Hike Leaders</h1>

          <p className="mx-auto max-w-2xl text-lg text-snow/80">
            Every club member can organize and lead hikes. Our leaders take responsibility for everyone on the trail,
            waiting at every intersection and ensuring no one is left behind.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-8">
          {organizers.map((organizer, index) => (
            <Card
              key={organizer.id}
              className="group w-full md:w-[48%] lg:w-[23%] overflow-hidden transition-all duration-300 hover:shadow-elevated animate-slide-up"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={organizer.image}
                  alt={organizer.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mountain/80 via-transparent to-transparent" />
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="">
                    <h3 className="text-center text-md font-semibold">{organizer.name}</h3>
                    <p className="text-sm text-primary">{organizer.role}</p>
                  </div>
                  {organizer.role === "Club President" && <Award className="h-5 w-5 text-trail" />}
                </div>

                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{organizer.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Become a Leader CTA */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold md:text-3xl">Want to Lead a Hike?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Every member of our hiking club can organize and lead hikes! Once you've joined a hike and become a member,
            you can plan your own adventure and guide fellow hikers across Germany.
          </p>
          <Button asChild size="lg">
            <a href="mailto:contact@tumhikingclub.com">Contact us to get started</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
