import { Link, useLocation } from "react-router-dom";
import { Instagram, Activity, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  if (location.pathname === "/auth") return null;

  return (
    <footer className="border-t border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">

          {/* Social List */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-foreground leading-tight">
              Our Social Media
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              
              <a 
                href="https://www.instagram.com/tum.hiking.club/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-[#E1306C]"
              >
                <Instagram className="h-5 w-5" />
                <span className="font-medium">Instagram</span>
              </a>
              
              <a 
                href="https://strava.app.link/1baOJxDklZb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-[#FC4C02]"
              >
                <Activity className="h-5 w-5" />
                <span className="font-medium">Strava</span>
              </a>

               <a 
                href="mailto:hiking@tum.de"
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">Email</span>
              </a>
              
            </div>
          </div>

          {/* Address Text & Logo */}
          <div className="flex gap-6 items-center">
            <div className="text-right text-sm text-muted-foreground space-y-1">
              <h3 className="font-heading font-bold text-foreground text-lg leading-tight">
                TUM HN Hiking Club
              </h3>
              <p>Bildungscampus 2</p>
              <p>74076 Heilbronn</p>
              <p>
                <a href="mailto:hiking@tum.de" className="hover:text-primary transition-colors">
                  hiking@tum.de
                </a>
              </p>
              <p className="text-xs opacity-60 pt-2">
                &copy; {currentYear}
              </p>
            </div>

            <Link to="/" className="shrink-0">
              <img 
                src="/images/logo/logo-no-bg.png" 
                alt="Logo" 
                className="h-32 w-32 object-contain" 
              />
            </Link>
            
          </div>

        </div>
      </div>
    </footer>
  );
}