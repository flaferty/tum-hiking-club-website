import { useEffect, useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchAndParseFAQ,
  type FAQSection,
} from "@/features/FAQParser";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export default function FAQ() {
  const [faqSections, setFaqSections] = useState<FAQSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    fetchAndParseFAQ()
		.then(setFaqSections)
    	.finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setActiveItem(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!isLoading && faqSections.length > 0) {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [isLoading, faqSections]);

  const handleAccordionChange = (value: string) => {
    if (value) {
      window.history.pushState(null, "", `#${value}`);
      setActiveItem(value);
    } else {
      window.history.pushState(null, "", window.location.pathname);
      setActiveItem("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/90 via-primary/70 to-background py-20">
        <img
          src="/images/hero/mountains_2.jpg"
          alt="Mountainous landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"
        />
        <div className="container relative mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 bg-card/20 text-white backdrop-blur-sm border-card/30"
          >
            Got Questions?
          </Badge>

          <h1 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-200">
            Everything you need to know about our hikes, membership, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto max-w-3xl px-4 py-16">
        {isLoading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-4 font-heading text-2xl font-bold md:text-3xl">
                  {section.title}
                </h2>

                <Accordion
                  type="single"
                  collapsible
                  className="space-y-4"
                  value={activeItem}
                  onValueChange={handleAccordionChange}
                >
                  {section.questions.map((faq) => {
                    const slug = slugify(faq.question);
                    return (
                      <AccordionItem
                        key={slug}
                        value={slug}
                        id={slug}
                        className="rounded-lg border border-border bg-card px-4"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-1 [&_a]:underline [&_a]:text-primary">
                          <div
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
