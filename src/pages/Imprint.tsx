import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { organizers } from "@/lib/data";

export default function Imprint() {
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
          <h1 className="mb-4 font-heading text-4xl font-bold text-snow md:text-5xl">Legal Notice</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 space-y-12">
            
            {/* Impressum Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Legal Notice / Impressum</h2>
              <div>
                <h3 className="font-semibold text-lg mb-2">According to / Angaben gemäß § 5 DDG</h3>
                <p className="text-muted-foreground">TUM HN Hiking Club</p>
                <p className="text-muted-foreground">Bildungscampus 2</p>
                <p className="text-muted-foreground">74076 Heilbronn</p>
                <p className="text-muted-foreground">Germany</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Represented by / Vertreten durch:</h3>
                <p className="text-muted-foreground">Attila Berzick</p>
                <p className="text-muted-foreground">Julien-Alexandre Bertin Klein</p>
                <p className="text-muted-foreground">Oleksandra Sobchyshak</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Contact / Kontakt:</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:contact@tumhikingclub.com" className="hover:text-primary">
                    contact@tumhikingclub.com
                  </a>
                </p>
              </div>
            </div>

            {/* Disclaimer Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Disclaimer / Haftungsausschluss</h2>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Hikes participation / Teilnahme an Wanderungen</h3>
                <p className="text-muted-foreground">
                  Participation in hikes organized by the TUM HN Hiking Club is strictly at your own risk. The organizers act as private individuals and not as professional mountain guides. We assume no liability for personal injury, property damage, or loss of items. By joining, you confirm that you have the necessary fitness and equipment for the planned route.
                </p>
                <p className="text-muted-foreground">
                  Die Teilnahme an den vom TUM HN Hiking Club organisierten Wanderungen erfolgt ausschließlich auf eigene Gefahr. Die Organisatoren handeln als Privatpersonen und nicht als professionelle Bergführer. Wir übernehmen keine Haftung für Personenschäden, Sachschäden oder den Verlust von Gegenständen. Mit Ihrer Teilnahme bestätigen Sie, dass Sie über die erforderliche Fitness und Ausrüstung für die geplante Route verfügen.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Affilation with TUM / Zugehörigkeit zur TUM</h3>
                <p className="text-muted-foreground">
                  The TUM HN Hiking Club is an independent student-led initiative. We are not an official organ, department, or representative of the Technical University of Munich (TUM). The use of the name "TUM" is for geographical and community identification purposes only. All activities, views, and content provided by this club are solely the responsibility of the club organizers and do not reflect the views or policies of the Technical University of Munich.
                </p>
                <p className="text-muted-foreground">
                  Der TUM HN Hiking Club ist eine unabhängige studentische Initiative. Wir sind kein offizielles Organ, keine Abteilung und kein Vertreter der Technischen Universität München (TUM). Die Verwendung des Namens „TUM“ dient ausschließlich der geografischen Zuordnung und der Identifikation innerhalb der studentischen Gemeinschaft. Alle Aktivitäten, Ansichten und Inhalte dieses Clubs liegen in der alleinigen Verantwortung der Club-Organisatoren und spiegeln nicht die Ansichten oder Richtlinien der Technischen Universität München wider.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Content Liability / Haftung für Inhalte</h3>
                <p className="text-muted-foreground">
                  The contents of our pages were created with great care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. As a service provider, we are responsible for our own content on these pages in accordance with Section 7 (1) of the DDG under general law. According to Sections 8 to 10 of the DDG, however, we as service providers are not obliged to monitor transmitted or stored third-party information or to search for circumstances that indicate illegal activity. Obligations to remove or block the use of information in accordance with general laws remain unaffected by this. However, liability in this regard is only possible from the time of knowledge of a specific legal violation. Upon becoming aware of such legal violations, we will remove this content immediately.
                </p>
                <p className="text-muted-foreground">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Links Liability / Haftung für Links</h3>
                <p className="text-muted-foreground">
                  Our website contains links to external third-party websites, over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking. However, permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a legal violation. If we become aware of any legal infringements, we will remove such links immediately.
                </p>
                <p className="text-muted-foreground">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </section>
    </div>
  );
}
