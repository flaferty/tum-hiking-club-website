import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { organizers } from "@/lib/data";

export default function Privacy() {
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
          <h1 className="mb-4 font-heading text-4xl font-bold text-snow md:text-5xl">Privacy Policy</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 space-y-12">

            <div className="space-y-8">
              <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
              <div>
                <h4>Disclaimer:</h4>
                <p>This translation is provided for your convenience only. In the event of any conflict or inconsistency between the English and German versions, the German version shall prevail and is the only legally binding document.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mt-6">1. Privacy at a Glance</h2>
                <h3 className="text-xl font-bold mt-4">General Information</h3>
                <p className="mt-2">
                  The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data with which you can be personally identified. Detailed information on the subject of data protection can be found in our Privacy Policy listed below this text.
                </p>

                <h3 className="text-xl font-bold mt-4">Data Collection on this Website</h3>
                <h4 className="mt-3">Who is responsible for data collection on this website?</h4>
                <p className="mt-2">
                  The data processing on this website is carried out by the website operator. You can find their contact details in the section "Notice regarding the Responsible Party" in this Privacy Policy.
                </p>

                <h4 className="mt-3">How do we collect your data?</h4>
                <p className="mt-2">
                  Your data is collected on the one hand by you communicating it to us. This can be, for example, data that you enter into a contact form.
                </p>
                <p className="mt-2">
                  Other data is collected automatically or after your consent when you visit the website through our IT systems. This is primarily technical data (e.g., internet browser, operating system, or time of the page view). This data is collected automatically as soon as you enter this website.
                </p>

                <h4 className="mt-3">What do we use your data for?</h4>
                <p className="mt-2">
                  A part of the data is collected to ensure the error-free provision of the website. Other data can be used to analyze your user behavior. If contracts can be concluded or initiated via the website, the transmitted data will also be processed for contract offers, orders, or other order inquiries.
                </p>

                <h4 className="mt-3">What rights do you have regarding your data?</h4>
                <p className="mt-2">
                  You have the right at any time to receive information free of charge about the origin, recipient, and purpose of your stored personal data. You also have a right to demand the correction or deletion of this data. If you have given your consent to data processing, you can revoke this consent at any time for the future. You also have the right, under certain circumstances, to demand the restriction of the processing of your personal data. Furthermore, you have a right of complaint to the competent supervisory authority.
                </p>
                <p className="mt-2">
                  For this purpose as well as for further questions on the subject of data protection, you can contact us at any time.
                </p>

                <h3 className="text-xl font-bold mt-4">Analysis Tools and Third-Party Tools</h3>
                <p className="mt-2">
                  When visiting this website, your surfing behavior can be statistically evaluated. This happens primarily with so-called analysis programs.</p>
                <p className="mt-2">
                  Detailed information on these analysis programs can be found in the following Privacy Policy.
                </p>

              </div>

              <div>
                <h2 className="text-2xl font-bold mt-6">2. Hosting</h2>
                <p className="mt-2">We host the contents of our website with the following provider:</p>

                <h3 className="text-xl font-bold mt-4">External Hosting</h3>
                <p className="mt-2">
                  This website is hosted externally. The personal data collected on this website is stored on the servers of the host(s). This may primarily involve IP addresses, contact requests, meta and communication data, contract data, contact details, names, website access, and other data generated via a website.
                </p>
                <p className="mt-2">
                  External hosting is performed for the purpose of fulfilling the contract toward our potential and existing customers (Art. 6 Para. 1 lit. b GDPR) and in the interest of a secure, fast, and efficient provision of our online offer by a professional provider (Art. 6 Para. 1 lit. f GDPR). Insofar as a corresponding consent was requested, processing takes place exclusively on the basis of Art. 6 Para. 1 lit. a GDPR and § 25 Para. 1 TDDDG, insofar as the consent includes the storage of cookies or access to information in the user's terminal device (e.g., device fingerprinting) within the meaning of the TDDDG. Consent is revocable at any time.
                </p>
                <p className="mt-2">
                  Our host(s) will only process your data to the extent necessary to fulfill its performance obligations and follow our instructions in relation to this data.
                </p>
                <p className="mt-2">We utilize the following host(s):</p>
                <p className="mt-2">
                  Vercel Inc.<br />
                  340 S Lemon Ave #4133<br />
                  Walnut, CA 91789<br />
                  USA
                </p>

                <h4 className="mt-3">Order Processing</h4>
                <p className="mt-2">We have concluded a contract on order processing (AVV) for the use of the above-mentioned service. This is a contract required by data protection law, which ensures that this provider processes the personal data of our website visitors only according to our instructions and in compliance with the GDPR.
                </p>

              </div>

              <div>
                <h2 className="text-2xl font-bold mt-6">3. General Information and Mandatory Information</h2>
                <h3 className="text-xl font-bold mt-4">Data Protection</h3>
                <p className="mt-2">
                  The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this Privacy Policy.
                </p>
                <p className="mt-2">
                  When you use this website, various personal data are collected. Personal data is data with which you can be personally identified. This Privacy Policy explains what data we collect and what we use it for. It also explains how and for what purpose this happens.
                </p>
                <p className="mt-2">We point out that data transmission on the Internet (e.g., when communicating by e-mail) can have security gaps. Complete protection of data against access by third parties is not possible.
                </p>

                <h3 className="text-xl font-bold mt-4">Notice regarding the Responsible Party</h3>
                <p className="mt-2">
                  The responsible party for data processing on this website is:
                </p>
                <p className="mt-2">TUM HN Hiking Club<br />
                  Bildungscampus 2<br />
                  74076 Heilbronn<br />
                  Germany
                </p>
                <p className="mt-2">
                  E-Mail: contact@tumhikingclub.com
                </p>
                <p className="mt-2">
                  The responsible party is the natural or legal person who alone or jointly with others decides on the purposes and means of the processing of personal data (e.g., names, e-mail addresses, etc.).
                </p>

                <h3 className="text-xl font-bold mt-4">Storage Duration</h3> <p className="mt-2">Unless a more specific storage period has been mentioned within this Privacy Policy, your personal data will remain with us until the purpose for data processing no longer applies. If you assert a legitimate deletion request or revoke a consent to data processing, your data will be deleted, provided we have no other legally permissible reasons for the storage of your personal data (e.g., tax or commercial law retention periods); in the latter case, deletion takes place after these reasons no longer apply.</p>

                <h3 className="text-xl font-bold mt-4">General Information on the Legal Basis for Data Processing on this Website</h3> <p className="mt-2">Insofar as you have consented to data processing, we process your personal data on the basis of Art. 6 Para. 1 lit. a GDPR or Art. 9 Para. 2 lit. a GDPR, provided that special categories of data according to Art. 9 Para. 1 GDPR are processed. In the case of explicit consent to the transfer of personal data to third countries, data processing also takes place on the basis of Art. 49 Para. 1 lit. a GDPR. Insofar as you have consented to the storage of cookies or to the access to information in your terminal device (e.g., via device fingerprinting), data processing additionally takes place on the basis of § 25 Para. 1 TDDDG. Consent is revocable at any time. If your data is required for contract fulfillment or for the implementation of pre-contractual measures, we process your data on the basis of Art. 6 Para. 1 lit. b GDPR. Furthermore, we process your data insofar as it is required for the fulfillment of a legal obligation on the basis of Art. 6 Para. 1 lit. c GDPR. Data processing can further take place on the basis of our legitimate interest according to Art. 6 Para. 1 lit. f GDPR. Information about the legal basis relevant in each individual case is provided in the following paragraphs of this Privacy Policy.</p>

                <h3 className="text-xl font-bold mt-4">Recipients of Personal Data</h3> <p className="mt-2">Within the scope of our business activities, we work together with various external bodies. In doing so, a transmission of personal data to these external bodies is partly necessary. We pass on personal data to external bodies only if this is necessary within the scope of contract fulfillment, if we are legally obligated to do so (e.g., passing on data to tax authorities), if we have a legitimate interest according to Art. 6 Para. 1 lit. f GDPR in the passing on, or if another legal basis permits the data transfer. When utilizing processors, we pass on personal data of our customers only on the basis of a valid contract on order processing. In the case of joint processing, a contract on joint processing is concluded.</p>

                <h3 className="text-xl font-bold mt-4">Revocation of Your Consent to Data Processing</h3> <p className="mt-2">Many data processing operations are only possible with your explicit consent. You can revoke consent already given at any time. The legality of the data processing performed until the revocation remains unaffected by the revocation.</p>

                <h3 className="text-xl font-bold mt-4">Right to Object to Data Collection in Special Cases as well as to Direct Advertising (Art. 21 GDPR)</h3> <p className="mt-2">IF DATA PROCESSING IS PERFORMED ON THE BASIS OF ART. 6 PARA. 1 LIT. E OR F GDPR, YOU HAVE THE RIGHT AT ANY TIME, FOR REASONS ARISING FROM YOUR PARTICULAR SITUATION, TO OBJECT TO THE PROCESSING OF YOUR PERSONAL DATA; THIS ALSO APPLIES TO PROFILING BASED ON THESE PROVISIONS. THE RESPECTIVE LEGAL BASIS ON WHICH PROCESSING IS BASED CAN BE FOUND IN THIS PRIVACY POLICY. IF YOU OBJECT, WE WILL NO LONGER PROCESS YOUR CONCERNED PERSONAL DATA UNLESS WE CAN DEMONSTRATE COMPELLING REASONS FOR THE PROCESSING WORTHY OF PROTECTION WHICH OUTWEIGH YOUR INTERESTS, RIGHTS, AND FREEDOMS, OR THE PROCESSING SERVES TO ASSERT, EXERCISE, OR DEFEND LEGAL CLAIMS (OBJECTION ACCORDING TO ART. 21 PARA. 1 GDPR).</p> <p className="mt-2">IF YOUR PERSONAL DATA IS PROCESSED TO OPERATE DIRECT ADVERTISING, YOU HAVE THE RIGHT AT ANY TIME TO OBJECT TO THE PROCESSING OF PERSONAL DATA CONCERNING YOU FOR THE PURPOSE OF SUCH ADVERTISING; THIS ALSO APPLIES TO PROFILING, INSOFAR AS IT IS CONNECTED WITH SUCH DIRECT ADVERTISING. IF YOU OBJECT, YOUR PERSONAL DATA WILL SUBSEQUENTLY NO LONGER BE USED FOR THE PURPOSE OF DIRECT ADVERTISING (OBJECTION ACCORDING TO ART. 21 PARA. 2 GDPR).</p>

                <h3 className="text-xl font-bold mt-4">Right of Complaint to the Competent Supervisory Authority</h3> <p className="mt-2">In the event of violations of the GDPR, the data subjects are entitled to a right of complaint to a supervisory authority, in particular in the member state of their habitual residence, their workplace, or the place of the suspected violation. The right of complaint exists without prejudice to other administrative or judicial remedies.</p>

                <h3 className="text-xl font-bold mt-4">Right to Data Portability</h3> <p className="mt-2">You have the right to have data that we process automatically on the basis of your consent or in fulfillment of a contract handed over to you or to a third party in a standard, machine-readable format. Insofar as you demand the direct transfer of the data to another responsible party, this will only be done as far as it is technically feasible.</p>

                <h3 className="text-xl font-bold mt-4">Information, Correction, and Deletion</h3> <p className="mt-2">Within the framework of the applicable legal provisions, you have the right at any time to free information about your stored personal data, its origin and recipient, and the purpose of the data processing and, if applicable, a right to correction or deletion of this data. For this purpose as well as for further questions on the subject of personal data, you can contact us at any time.</p>

                <h3 className="text-xl font-bold mt-4">Right to Restriction of Processing</h3> <p className="mt-2">You have the right to demand the restriction of the processing of your personal data. For this purpose, you can contact us at any time. The right to restriction of processing exists in the following cases:</p> <ul> <li>If you dispute the accuracy of your personal data stored with us, we usually require time to verify this. For the duration of the verification, you have the right to demand the restriction of the processing of your personal data.</li> <li>If the processing of your personal data occurred/occurs unlawfully, you can demand the restriction of data processing instead of deletion.</li> <li>If we no longer require your personal data, but you require it for the exercise, defense, or assertion of legal claims, you have the right to demand the restriction of the processing of your personal data instead of deletion.</li> <li>If you have lodged an objection according to Art. 21 Para. 1 GDPR, a balance must be made between your and our interests. As long as it is not yet established whose interests outweigh, you have the right to demand the restriction of the processing of your personal data.</li> </ul>
                <p className="mt-2">If you have restricted the processing of your personal data, this data – apart from its storage – may only be processed with your consent or for the assertion, exercise, or defense of legal claims or to protect the rights of another natural or legal person or for reasons of an important public interest of the European Union or a member state.</p>

                <h3 className="text-xl font-bold mt-4">SSL or TLS Encryption</h3> <p className="mt-2">For security reasons and to protect the transmission of confidential content, such as orders or inquiries that you send to us as site operators, this page uses SSL or TLS encryption. You can recognize an encrypted connection by the fact that the address line of the browser changes from "http://" to "https://" and by the lock symbol in your browser line.</p> <p className="mt-2">If SSL or TLS encryption is activated, the data you transmit to us cannot be read by third parties.</p>

              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold mt-6">4. Data Collection on this Website</h2>
                <h3 className="text-xl font-bold mt-4">Cookies</h3> <p className="mt-2">Our Internet pages use so-called "cookies." Cookies are small data packages and do not cause any damage to your terminal device. They are either stored temporarily for the duration of a session (session cookies) or permanently (permanent cookies) on your terminal device. Session cookies are automatically deleted after the end of your visit. Permanent cookies remain stored on your terminal device until you delete them yourself or an automatic deletion is carried out by your web browser.</p> <p className="mt-2">Cookies can originate from us (first-party cookies) or from third-party companies (so-called third-party cookies). Third-party cookies enable the integration of certain services of third-party companies within websites (e.g., cookies for processing payment services).</p> <p className="mt-2">Cookies have different functions. Numerous cookies are technically necessary, as certain website functions would not work without them (e.g., the shopping cart function or the display of videos). Other cookies can be used to evaluate user behavior or for advertising purposes.</p> <p className="mt-2">Cookies that are required to carry out the electronic communication process, to provide certain functions desired by you (e.g., for the shopping cart function), or to optimize the website (e.g., cookies for measuring the web audience) (necessary cookies) are stored on the basis of Art. 6 Para. 1 lit. f GDPR, unless another legal basis is stated. The website operator has a legitimate interest in the storage of necessary cookies for the technically error-free and optimized provision of its services. Insofar as consent to the storage of cookies and comparable recognition technologies was requested, processing occurs exclusively on the basis of this consent (Art. 6 Para. 1 lit. a GDPR and § 25 Para. 1 TDDDG); the consent is revocable at any time.</p>
                <p className="mt-2">You can set your browser so that you are informed about the setting of cookies and only allow cookies in individual cases, exclude the acceptance of cookies for certain cases or generally, as well as activate the automatic deletion of cookies when closing the browser. When deactivating cookies, the functionality of this website may be limited.</p>
                <p className="mt-2">Which cookies and services are utilized on this website can be found in this Privacy Policy.</p>

                <h3 className="text-xl font-bold mt-4">Server Log Files</h3> <p className="mt-2">The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:</p> <ul>
                  <li>Browser type and browser version</li> <li>Operating system used</li> <li>Referrer URL</li>
                  <li>Hostname of the accessing computer</li> <li>Time of the server request</li> <li>IP address</li> </ul>
                <p className="mt-2">A merger of this data with other data sources is not performed.</p> <p className="mt-2">The collection of this data is based on Art. 6 Para. 1 lit. f GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of its website – for this purpose, the server log files must be recorded.</p>

                <h3 className="text-xl font-bold mt-4">Inquiry by E-Mail, Telephone, or Fax</h3> <p className="mt-2">If you contact us by e-mail, telephone, or fax, your inquiry including all resulting personal data (name, inquiry) will be stored and processed by us for the purpose of processing your request. We do not pass on this data without your consent.</p> <p className="mt-2">The processing of this data is based on Art. 6 Para. 1 lit. b GDPR, insofar as your inquiry is related to the fulfillment of a contract or is necessary for the implementation of pre-contractual measures. In all other cases, processing is based on our legitimate interest in the effective processing of requests addressed to us (Art. 6 Para. 1 lit. f GDPR) or on your consent (Art. 6 Para. 1 lit. a GDPR) insofar as this was requested; the consent is revocable at any time.</p> <p className="mt-2">The data sent by you to us via contact requests remains with us until you request us to delete it, revoke your consent to storage, or the purpose for data storage no longer applies (e.g., after completed processing of your request). Mandatory statutory provisions – in particular statutory retention periods – remain unaffected.</p>

              </div>
              <p>Source: <a href="[https://www.e-recht24.de](https://www.e-recht24.de)">(https://www.e-recht24.de)</a></p>
            </div>

            <div className="space-y-8">
              <h1 className="text-3xl font-bold mb-4">Datenschutz&shy;erkl&auml;rung</h1>

              <div>
                <h2 className="text-2xl font-bold mt-6">1. Datenschutz auf einen Blick</h2>
                <h3 className="text-xl font-bold mt-4">Allgemeine Hinweise</h3>
                <p className="mt-2">
                  Die folgenden Hinweise geben einen einfachen &Uuml;berblick dar&uuml;ber,
                  was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind
                  alle Daten, mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen. Ausf&uuml;hrliche Informationen zum
                  Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgef&uuml;hrten
                  Datenschutzerkl&auml;rung.
                </p>

                <h3 className="text-xl font-bold mt-4">Datenerfassung auf dieser Website</h3>
                <h4 className="mt-3">Wer ist verantwortlich f&uuml;r die Datenerfassung auf dieser Website?</h4> 
                <p className="mt-2">
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
                  Kontaktdaten k&ouml;nnen Sie dem Abschnitt &bdquo;Hinweis zur Verantwortlichen Stelle&ldquo; in dieser
                  Datenschutzerkl&auml;rung entnehmen.
                </p>
                
                <h4 className="mt-3">Wie erfassen wir Ihre Daten?</h4>
                <p className="mt-2">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                </p>
                <p className="mt-2">
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch
                  der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.&nbsp;B. Internetbrowser,
                  Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese
                  Website betreten.
                </p>
                
                <h4 className="mt-3">Wof&uuml;r nutzen wir Ihre Daten?</h4>
                <p className="mt-2">
                  Ein Teil der Daten wird erhoben, um eine
                  fehlerfreie Bereitstellung der Website zu gew&auml;hrleisten. Andere Daten k&ouml;nnen zur Analyse Ihres
                  Nutzerverhaltens verwendet werden. Sofern &uuml;ber die Website Vertr&auml;ge geschlossen oder angebahnt
                  werden k&ouml;nnen, werden die &uuml;bermittelten Daten auch f&uuml;r Vertragsangebote, Bestellungen oder
                  sonstige Auftragsanfragen verarbeitet.
                </p>

                <h4 className="mt-3">Welche Rechte haben Sie bez&uuml;gling Ihrer Daten?</h4>
                <p className="mt-2">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft &uuml;ber Herkunft, Empf&auml;nger und Zweck Ihrer
                  gespeicherten personenbezogenen Daten zu erhalten. Sie haben au&szlig;erdem ein Recht, die Berichtigung oder
                  L&ouml;schung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
                  k&ouml;nnen Sie diese Einwilligung jederzeit f&uuml;r die Zukunft widerrufen. Au&szlig;erdem haben Sie das Recht,
                  unter bestimmten Umst&auml;nden die Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen Daten zu
                  verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zust&auml;ndigen Aufsichtsbeh&ouml;rde zu.
                </p>
                <p className="mt-2">
                  Hierzu sowie zu weiteren Fragen zum Thema Datenschutz k&ouml;nnen Sie sich jederzeit an uns wenden.
                </p>

                <h3 className="text-xl font-bold mt-4">Analyse-Tools und Tools von Dritt&shy;anbietern</h3> 
                <p className="mt-2">
                  Beim Besuch dieser Website kann Ihr Surf-
                  Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit sogenannten Analyseprogrammen.</p>
                <p className="mt-2">
                  Detaillierte Informationen zu diesen Analyseprogrammen finden Sie in der folgenden
                  Datenschutzerkl&auml;rung.
                </p>

              </div>

              <div>
                <h2 className="text-2xl font-bold mt-6">2. Hosting</h2>
                <p className="mt-2">Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>

                <h3 className="text-xl font-bold mt-4">Externes Hosting</h3>
                <p className="mt-2">
                  Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser
                  Website erfasst werden, werden auf den Servern des Hosters / der Hoster gespeichert. Hierbei kann es sich
                  v.&nbsp;a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten,
                  Namen, Websitezugriffe und sonstige Daten, die &uuml;ber eine Website generiert werden, handeln.
                </p>
                <p className="mt-2">
                    Das externe Hosting erfolgt zum Zwecke der Vertragserf&uuml;llung gegen&uuml;ber unseren potenziellen und
                    bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten
                    Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO). Sofern
                    eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschlie&szlig;lich auf Grundlage von
                    Art. 6 Abs. 1 lit. a DSGVO und &sect; 25 Abs. 1 TDDDG, soweit die Einwilligung die Speicherung von Cookies oder
                    den Zugriff auf Informationen im Endger&auml;t des Nutzers (z.&nbsp;B. Device-Fingerprinting) im Sinne des
                    TDDDG umfasst. Die Einwilligung ist jederzeit widerrufbar.
                </p>
                <p className="mt-2">
                  Unser(e) Hoster wird bzw. werden Ihre Daten
                  nur insoweit verarbeiten, wie dies zur Erf&uuml;llung seiner Leistungspflichten erforderlich ist und unsere
                  Weisungen in Bezug auf diese Daten befolgen.
                </p> 
                <p className="mt-2">Wir setzen folgende(n) Hoster ein:</p>
                <p className="mt-2">
                  Vercel Inc.<br />
                  340 S Lemon Ave #4133<br />
                  Walnut, CA 91789<br />
                  USA
                </p>

                <h4 className="mt-3">Auftragsverarbeitung</h4>
                <p className="mt-2">Wir haben einen Vertrag &uuml;ber Auftragsverarbeitung (AVV) zur Nutzung
                  des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen
                  Vertrag, der gew&auml;hrleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach
                  unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.
                </p>

              </div>

              <div>
                <h2 className="text-2xl font-bold mt-6">3. Allgemeine Hinweise und Pflicht&shy;informationen</h2>
                <h3 className="text-xl font-bold mt-4">Datenschutz</h3> 
                <p className="mt-2">
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer pers&ouml;nlichen Daten sehr
                  ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
                  Datenschutzvorschriften sowie dieser Datenschutzerkl&auml;rung.
                </p>
                <p className="mt-2">
                  Wenn Sie diese Website benutzen,
                    werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie
                    pers&ouml;nlich identifiziert werden k&ouml;nnen. Die vorliegende Datenschutzerkl&auml;rung erl&auml;utert,
                    welche Daten wir erheben und wof&uuml;r wir sie nutzen. Sie erl&auml;utert auch, wie und zu welchem Zweck das
                    geschieht.
                </p>
                <p className="mt-2">Wir weisen darauf hin, dass die Daten&uuml;bertragung im Internet (z.&nbsp;B. bei der
                      Kommunikation per E-Mail) Sicherheitsl&uuml;cken aufweisen kann. Ein l&uuml;ckenloser Schutz der Daten vor
                      dem Zugriff durch Dritte ist nicht m&ouml;glich.
                </p>

                <h3 className="text-xl font-bold mt-4">Hinweis zur verantwortlichen Stelle</h3>
                <p className="mt-2">
                  Die verantwortliche Stelle f&uuml;r die Datenverarbeitung auf
                  dieser Website ist:
                </p>
                <p className="mt-2">TUM HN Hiking Club<br />
                  Bildungscampus 2<br />
                  74076 Heilbronn<br />
                  Germany
                </p>
                <p className="mt-2">
                  E-Mail: contact@tumhikingclub.com
                </p>
                <p className="mt-2">
                  Verantwortliche Stelle ist die nat&uuml;rliche oder juristische Person, die allein oder gemeinsam mit anderen
                  &uuml;ber die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z.&nbsp;B. Namen, E-Mail-
                  Adressen o. &Auml;.) entscheidet.
                </p>

                <h3 className="text-xl font-bold mt-4">Speicherdauer</h3> <p className="mt-2">Soweit innerhalb dieser Datenschutzerkl&auml;rung keine speziellere Speicherdauer
                  genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck f&uuml;r die Datenverarbeitung
                  entf&auml;llt. Wenn Sie ein berechtigtes L&ouml;schersuchen geltend machen oder eine Einwilligung zur
                  Datenverarbeitung widerrufen, werden Ihre Daten gel&ouml;scht, sofern wir keine anderen rechtlich
                  zul&auml;ssigen Gr&uuml;nde f&uuml;r die Speicherung Ihrer personenbezogenen Daten haben (z.&nbsp;B. steuer-
                  oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die L&ouml;schung nach Fortfall
                  dieser Gr&uuml;nde.</p>

                <h3 className="text-xl font-bold mt-4">Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website</h3> <p className="mt-2">Sofern Sie
                  in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art.
                  6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO
                  verarbeitet werden. Im Falle einer ausdr&uuml;cklichen Einwilligung in die &Uuml;bertragung personenbezogener
                  Daten in Drittstaaten erfolgt die Datenverarbeitung au&szlig;erdem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO.
                  Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in Ihr Endger&auml;t (z.&nbsp;B. via
                  Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zus&auml;tzlich auf Grundlage von &sect;
                  25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur Vertragserf&uuml;llung oder zur
                  Durchf&uuml;hrung vorvertraglicher Ma&szlig;nahmen erforderlich, verarbeiten wir Ihre Daten auf Grundlage des
                  Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erf&uuml;llung einer
                  rechtlichen Verpflichtung erforderlich sind auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung
                  kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. &Uuml;ber die
                  jeweils im Einzelfall einschl&auml;gigen Rechtsgrundlagen wird in den folgenden Abs&auml;tzen dieser
                  Datenschutzerkl&auml;rung informiert.</p>

                <h3 className="text-xl font-bold mt-4">Empf&auml;nger von personenbezogenen Daten</h3> <p className="mt-2">Im Rahmen unserer Gesch&auml;ftst&auml;tigkeit
                  arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei ist teilweise auch eine &Uuml;bermittlung von
                  personenbezogenen Daten an diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an
                  externe Stellen weiter, wenn dies im Rahmen einer Vertragserf&uuml;llung erforderlich ist, wenn wir gesetzlich
                  hierzu verpflichtet sind (z.&nbsp;B. Weitergabe von Daten an Steuerbeh&ouml;rden), wenn wir ein berechtigtes
                  Interesse nach Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die
                  Datenweitergabe erlaubt. Beim Einsatz von Auftragsverarbeitern geben wir personenbezogene Daten unserer
                  Kunden nur auf Grundlage eines g&uuml;ltigen Vertrags &uuml;ber Auftragsverarbeitung weiter. Im Falle einer
                  gemeinsamen Verarbeitung wird ein Vertrag &uuml;ber gemeinsame Verarbeitung geschlossen.</p>

                <h3 className="text-xl font-bold mt-4">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3> <p className="mt-2">Viele Datenverarbeitungsvorg&auml;nge sind
                  nur mit Ihrer ausdr&uuml;cklichen Einwilligung m&ouml;glich. Sie k&ouml;nnen eine bereits erteilte Einwilligung
                  jederzeit widerrufen. Die Rechtm&auml;&szlig;igkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom
                  Widerruf unber&uuml;hrt.</p>

                <h3 className="text-xl font-bold mt-4">Widerspruchsrecht gegen die Datenerhebung in besonderen F&auml;llen sowie gegen Direktwerbung (Art. 21
                  DSGVO)</h3> <p className="mt-2">WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F
                    DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GR&Uuml;NDEN, DIE SICH AUS IHRER
                    BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN
                    WIDERSPRUCH EINZULEGEN; DIES GILT AUCH F&Uuml;R EIN AUF DIESE BESTIMMUNGEN GEST&Uuml;TZTES
                    PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN
                    SIE DIESER DATENSCHUTZERKL&Auml;RUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE
                    BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR
                    K&Ouml;NNEN ZWINGENDE SCHUTZW&Uuml;RDIGE GR&Uuml;NDE F&Uuml;R DIE VERARBEITUNG
                    NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN &Uuml;BERWIEGEN ODER DIE
                    VERARBEITUNG DIENT DER GELTENDMACHUNG, AUS&Uuml;BUNG ODER VERTEIDIGUNG VON
                    RECHTSANSPR&Uuml;CHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).</p> <p className="mt-2">WERDEN IHRE
                      PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS
                      RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER
                      DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH F&Uuml;R DAS PROFILING,
                      SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN,
                      WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER
                      DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).</p>

                <h3 className="text-xl font-bold mt-4">Beschwerde&shy;recht bei der zust&auml;ndigen Aufsichts&shy;beh&ouml;rde</h3> <p className="mt-2">Im Falle von
                  Verst&ouml;&szlig;en gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer
                  Aufsichtsbeh&ouml;rde, insbesondere in dem Mitgliedstaat ihres gew&ouml;hnlichen Aufenthalts, ihres
                  Arbeitsplatzes oder des Orts des mutma&szlig;lichen Versto&szlig;es zu. Das Beschwerderecht besteht
                  unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.</p>

                <h3 className="text-xl font-bold mt-4">Recht auf Daten&shy;&uuml;bertrag&shy;barkeit</h3> <p className="mt-2">Sie haben das Recht, Daten, die wir auf Grundlage
                  Ihrer Einwilligung oder in Erf&uuml;llung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in
                  einem g&auml;ngigen, maschinenlesbaren Format aush&auml;ndigen zu lassen. Sofern Sie die direkte
                  &Uuml;bertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch
                  machbar ist.</p>

                <h3 className="text-xl font-bold mt-4">Auskunft, Berichtigung und L&ouml;schung</h3> <p className="mt-2">Sie haben im Rahmen der geltenden gesetzlichen
                  Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft &uuml;ber Ihre gespeicherten personenbezogenen
                  Daten, deren Herkunft und Empf&auml;nger und den Zweck der Datenverarbeitung und ggf. ein Recht auf
                  Berichtigung oder L&ouml;schung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene
                  Daten k&ouml;nnen Sie sich jederzeit an uns wenden.</p>

                <h3 className="text-xl font-bold mt-4">Recht auf Einschr&auml;nkung der Verarbeitung</h3> <p className="mt-2">Sie haben das Recht, die Einschr&auml;nkung der
                  Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu k&ouml;nnen Sie sich jederzeit an uns wenden.
                  Das Recht auf Einschr&auml;nkung der Verarbeitung besteht in folgenden F&auml;llen:</p> <ul> <li>Wenn Sie die
                    Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, ben&ouml;tigen wir in der Regel Zeit,
                    um dies zu &uuml;berpr&uuml;fen. F&uuml;r die Dauer der Pr&uuml;fung haben Sie das Recht, die
                    Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</li> <li>Wenn die
                      Verarbeitung Ihrer personenbezogenen Daten unrechtm&auml;&szlig;ig geschah/geschieht, k&ouml;nnen Sie statt
                      der L&ouml;schung die Einschr&auml;nkung der Datenverarbeitung verlangen.</li> <li>Wenn wir Ihre
                        personenbezogenen Daten nicht mehr ben&ouml;tigen, Sie sie jedoch zur Aus&uuml;bung, Verteidigung oder
                        Geltendmachung von Rechtsanspr&uuml;chen ben&ouml;tigen, haben Sie das Recht, statt der L&ouml;schung die
                        Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</li> <li>Wenn Sie einen
                          Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abw&auml;gung zwischen Ihren und unseren
                          Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen &uuml;berwiegen, haben Sie das
                          Recht, die Einschr&auml;nkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</li> </ul>
                <p className="mt-2">Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschr&auml;nkt haben, d&uuml;rfen diese
                  Daten &ndash; von ihrer Speicherung abgesehen &ndash; nur mit Ihrer Einwilligung oder zur Geltendmachung,
                  Aus&uuml;bung oder Verteidigung von Rechtsanspr&uuml;chen oder zum Schutz der Rechte einer anderen
                  nat&uuml;rlichen oder juristischen Person oder aus Gr&uuml;nden eines wichtigen &ouml;ffentlichen Interesses der
                  Europ&auml;ischen Union oder eines Mitgliedstaats verarbeitet werden.</p>
                
                <h3 className="text-xl font-bold mt-4">SSL- bzw. TLS-Verschl&uuml;sselung</h3> <p className="mt-2">Diese Seite nutzt aus Sicherheitsgr&uuml;nden und zum Schutz
                  der &Uuml;bertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als
                  Seitenbetreiber senden, eine SSL- bzw. TLS-Verschl&uuml;sselung. Eine verschl&uuml;sselte Verbindung erkennen
                  Sie daran, dass die Adresszeile des Browsers von &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt und
                  an dem Schloss-Symbol in Ihrer Browserzeile.</p> <p className="mt-2">Wenn die SSL- bzw. TLS-Verschl&uuml;sselung aktiviert ist,
                    k&ouml;nnen die Daten, die Sie an uns &uuml;bermitteln, nicht von Dritten mitgelesen werden.</p>

              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold mt-6">4. Datenerfassung auf dieser Website</h2>
                <h3 className="text-xl font-bold mt-4">Cookies</h3> <p className="mt-2">Unsere Internetseiten verwenden so genannte &bdquo;Cookies&ldquo;. Cookies sind kleine
                  Datenpakete und richten auf Ihrem Endger&auml;t keinen Schaden an. Sie werden entweder vor&uuml;bergehend
                  f&uuml;r die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endger&auml;t
                  gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gel&ouml;scht. Permanente Cookies
                  bleiben auf Ihrem Endger&auml;t gespeichert, bis Sie diese selbst l&ouml;schen oder eine automatische
                  L&ouml;schung durch Ihren Webbrowser erfolgt.</p> <p className="mt-2">Cookies k&ouml;nnen von uns (First-Party-Cookies) oder
                    von Drittunternehmen stammen (sog. Third-Party-Cookies). Third-Party-Cookies erm&ouml;glichen die Einbindung
                    bestimmter Dienstleistungen von Drittunternehmen innerhalb von Webseiten (z.&nbsp;B. Cookies zur Abwicklung
                    von Zahlungsdienstleistungen).</p> <p className="mt-2">Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch
                      notwendig, da bestimmte Webseitenfunktionen ohne diese nicht funktionieren w&uuml;rden (z.&nbsp;B. die
                      Warenkorbfunktion oder die Anzeige von Videos). Andere Cookies k&ouml;nnen zur Auswertung des
                      Nutzerverhaltens oder zu Werbezwecken verwendet werden.</p> <p className="mt-2">Cookies, die zur Durchf&uuml;hrung des
                        elektronischen Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen erw&uuml;nschter Funktionen
                        (z.&nbsp;B. f&uuml;r die Warenkorbfunktion) oder zur Optimierung der Website (z.&nbsp;B. Cookies zur Messung
                        des Webpublikums) erforderlich sind (notwendige Cookies), werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
                        gespeichert, sofern keine andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat ein berechtigtes
                        Interesse an der Speicherung von notwendigen Cookies zur technisch fehlerfreien und optimierten Bereitstellung
                        seiner Dienste. Sofern eine Einwilligung zur Speicherung von Cookies und vergleichbaren
                        Wiedererkennungstechnologien abgefragt wurde, erfolgt die Verarbeitung ausschlie&szlig;lich auf Grundlage dieser
                        Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und &sect; 25 Abs. 1 TDDDG); die Einwilligung ist jederzeit widerrufbar.</p>
                <p className="mt-2">Sie k&ouml;nnen Ihren Browser so einstellen, dass Sie &uuml;ber das Setzen von Cookies informiert werden und
                  Cookies nur im Einzelfall erlauben, die Annahme von Cookies f&uuml;r bestimmte F&auml;lle oder generell
                  ausschlie&szlig;en sowie das automatische L&ouml;schen der Cookies beim Schlie&szlig;en des Browsers aktivieren.
                  Bei der Deaktivierung von Cookies kann die Funktionalit&auml;t dieser Website eingeschr&auml;nkt sein.</p>
                <p className="mt-2">Welche Cookies und Dienste auf dieser Website eingesetzt werden, k&ouml;nnen Sie dieser
                  Datenschutzerkl&auml;rung entnehmen.</p>

                <h3 className="text-xl font-bold mt-4">Server-Log-Dateien</h3> <p className="mt-2">Der Provider der Seiten erhebt und speichert automatisch Informationen in so
                  genannten Server-Log-Dateien, die Ihr Browser automatisch an uns &uuml;bermittelt. Dies sind:</p> <ul>
                  <li>Browsertyp und Browserversion</li> <li>verwendetes Betriebssystem</li> <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li> <li>Uhrzeit der Serveranfrage</li> <li>IP-Adresse</li> </ul>
                <p className="mt-2">Eine Zusammenf&uuml;hrung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.</p> <p className="mt-2">Die
                  Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein
                  berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website &ndash;
                  hierzu m&uuml;ssen die Server-Log-Files erfasst werden.</p>

                <h3 className="text-xl font-bold mt-4">Anfrage per E-Mail, Telefon oder Telefax</h3> <p className="mt-2">Wenn Sie uns per E-Mail, Telefon oder Telefax
                  kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage)
                  zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne
                  Ihre Einwilligung weiter.</p> <p className="mt-2">Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
                    DSGVO, sofern Ihre Anfrage mit der Erf&uuml;llung eines Vertrags zusammenh&auml;ngt oder zur
                    Durchf&uuml;hrung vorvertraglicher Ma&szlig;nahmen erforderlich ist. In allen &uuml;brigen F&auml;llen beruht
                    die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten
                    Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt
                    wurde; die Einwilligung ist jederzeit widerrufbar.</p> <p className="mt-2">Die von Ihnen an uns per Kontaktanfragen
                      &uuml;bersandten Daten verbleiben bei uns, bis Sie uns zur L&ouml;schung auffordern, Ihre Einwilligung zur
                      Speicherung widerrufen oder der Zweck f&uuml;r die Datenspeicherung entf&auml;llt (z.&nbsp;B. nach
                      abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen &ndash; insbesondere
                      gesetzliche Aufbewahrungsfristen &ndash; bleiben unber&uuml;hrt.</p>

              </div>
              <p>Quelle: <a href="https://www.e-recht24.de">https://www.e-recht24.de</a></p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
