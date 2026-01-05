import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Activity, Instagram } from "lucide-react";
import QRCodeGenerator from "react-qr-code";


const faqs = [
  {
    question: "How do I become a club member?",
    answer:
      "Join any of our open hikes first. At the end of it, you can be added to our hiking club whatsapp group, where we post updates and organize events.",
  },
  {
    question: "Can anyone join a hike?",
    answer:
      "Yes! Our hikes are open to everyone, as we want to reach as many people as possible. You don't need to be a member to join a hike.",
  },
  {
    question: "Can I organize my own hike?",
    answer:
      "Yes, as every club member can organize and lead hikes. As a hike leader, you're responsible for all participants: wait at every hard part of the route and ensure no one is left behind.",
  },
  {
    question: "What about photos and videos?",
    answer:
      "You'll have access to pictures that were taken during the hike 1-2 day after it ends by the link in the group. By joining our club, you agree that we can take photos and videos of you, store them, and use them for marketing purposes on our Instagram channel.",
  },
/*   {
    question: "How do I join the club group?",
    answer:
      "The club is not an open group. After attending a hike, contact the admins to be added. This ensures all members have hiking experience.",
  }, */
];

export default function Participants() {
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
          <Badge variant="secondary" className="mb-4 bg-card/20 text-card backdrop-blur-sm border-card/30">
            Join Our Community
          </Badge>

          <h1 className="mb-4 font-heading text-4xl font-bold text-snow md:text-5xl">Join the Hiking Club</h1>

          <p className="mx-auto max-w-2xl text-lg text-snow/80">
            Hikes are open to everyone! Join one to become a member and start leading your own adventures across
            Germany.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Instagram Community Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-[#833AB4]/85 via-[#FD1D1D]/85 to-[#F77737]/85 text-white">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Instagram Community
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="mb-4 font-heading text-xl font-semibold">Join Our Instagram</h3>
              <p className="mb-6 text-muted-foreground">
                Check out photos from our latest adventures, get inspired for your next trip, and tag us in your stories!              </p>

              {/* QR Code placeholder */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-auto w-auto items-center justify-center rounded-xl border-2 border-dashed border-[#833AB4]/30 bg-white p-4">
                  <QRCodeGenerator
                    value="https://www.instagram.com/tum.hiking.club/"
                    size={180}
                    fgColor="#833AB4"
                    bgColor="#FFFFFF"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>
              

              <Button asChild className="w-full gap-2 bg-gradient-to-r from-[#833AB4]/80 via-[#FD1D1D]/80 to-[#F77737]/90 hover:bg-[#833AB4] text-white" size="lg">
                <a 
                  href="https://www.instagram.com/tum.hiking.club/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                    Click to Join
                </a>
              </Button> 

              <p className="mt-3 text-center text-sm text-muted-foreground">
                Scan the QR code or click the button to join
              </p>
            </CardContent>
          </Card>

          {/* Strava Club Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-[#FC4C02]/80 text-white">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Strava Community
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="mb-4 font-heading text-xl font-semibold">Join Our Strava Club</h3>
              <p className="mb-6 text-muted-foreground">
                Track your hikes, compare stats with other members, and share your trail photos with the community!
              </p>

              <div className="flex flex-col items-center">
                {/* QR Code Container */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-auto w-auto items-center justify-center rounded-xl border-2 border-dashed border-[#FC4C02]/30 bg-white p-4">
                     <QRCodeGenerator
                    value="https://strava.app.link/1baOJxDklZb"
                    size={180}
                    fgColor="#FC4C02"
                    bgColor="#FFFFFF"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>

                <Button 
                  className="w-full gap-2 bg-[#FC4C02]/80 text-white hover:bg-[#fa5610]" 
                  size="lg"
                  asChild
                >
                  <a href="https://strava.app.link/1baOJxDklZb" target="_blank" rel="noopener noreferrer">
                    <Activity className="h-4 w-4" />
                    Click to Join
                  </a>
                </Button>
                
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Scan the QR code or click the button to join
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border border-border bg-card px-4"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
