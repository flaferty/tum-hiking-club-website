import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Users, Calendar, Shield, HelpCircle, Backpack, QrCode } from "lucide-react";
import QRCodeGenerator from "react-qr-code";

const memberBenefits = [
  {
    icon: Users,
    title: "Lead Your Own Hikes",
    description: "Every member can organize and lead hikes across Germany.",
  },
  {
    icon: Shield,
    title: "Safe Adventures",
    description: "Hike leaders wait at every intersection — no one gets left behind.",
  },
  {
    icon: Calendar,
    title: "Open to Everyone",
    description: "Hikes are open to all. Join one to become a club member!",
  },
  {
    icon: Backpack,
    title: "Community Support",
    description: "Get advice, tips, and support from experienced hikers.",
  },
];

const faqs = [
  {
    question: "How do I become a club member?",
    answer:
      "Join any of our open hikes first! After attending at least one hike, you can be added to our hiking club. Contact the admins to be added to the private group.",
  },
  {
    question: "Can anyone join a hike?",
    answer:
      "Yes! Our hikes are open to everyone — we want to reach as many people as possible. You don't need to be a member to join a hike.",
  },
  {
    question: "Can I organize my own hike?",
    answer:
      "Yes! Every club member can organize and lead hikes. As a hike leader, you're responsible for all participants — wait at every intersection and ensure no one is left behind.",
  },
  {
    question: "What about photos and videos?",
    answer:
      "By joining our club, you agree that we can take photos and videos of you, store them, and use them for marketing purposes on our Instagram channel.",
  },
  {
    question: "How do I join the club group?",
    answer:
      "The club is not an open group. After attending a hike, contact the admins to be added. This ensures all members have hiking experience.",
  },
];

export default function Participants() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/90 via-primary/70 to-background py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

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

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* WhatsApp Community Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#128C7E] text-white">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Community
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="mb-4 font-heading text-xl font-semibold">Join Our WhatsApp Group</h3>
              <p className="mb-6 text-muted-foreground">
                Stay updated on upcoming hikes, connect with fellow hikers, and share your adventures!
              </p>

              {/* QR Code placeholder */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-auto w-auto items-center justify-center rounded-xl border-2 border-dashed border-[#128C7E]/30 bg-white p-4">
                  <QRCodeGenerator
                    value="https://chat.whatsapp.com/EpCWwnfCKamLfmEJcT4uv0"
                    size={180}
                    fgColor="#128C7E" // WhatsApp Green
                    bgColor="#FFFFFF"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>

              <Button asChild className="w-full gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white" size="lg">
                <a 
                  href="https://chat.whatsapp.com/EpCWwnfCKamLfmEJcT4uv0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Or Click to Join
                </a>
              </Button>

              <p className="mt-3 text-center text-sm text-muted-foreground">
                Scan the QR code or click the button to join
              </p>
            </CardContent>
          </Card>

          {/* Member Benefits */}
          <div>
            <h2 className="mb-6 font-heading text-2xl font-bold">Member Benefits</h2>

            <div className="space-y-4">
              {memberBenefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 hover:shadow-md animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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
