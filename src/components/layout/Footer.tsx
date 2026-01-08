import { Link, useLocation } from "react-router-dom";
import { Instagram, Activity, Mail } from "lucide-react";

function MountainMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024.5 576"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="#096fb1"
        d="M 268.414062 253.976562 L 35.398438 394.597656 L 269.953125 227.769531 L 312.097656 262.320312 L 447.320312 154.039062 L 471.371094 178.179688 L 615.738281 57.871094 L 748.027344 229.265625 L 805.167969 229.265625 L 988.542969 412.648438 L 806.609375 256.296875 L 774.359375 288.609375 L 787.136719 254.757812 L 740.144531 254.757812 L 616.105469 92.839844 L 426.296875 245.757812 L 439.078125 204.425781 L 229.707031 362.679688 L 298.164062 277.84375 Z M 268.414062 253.976562 "
      />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  if (location.pathname === "/auth") return null;

  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-card/80 backdrop-blur-md">
      {/* Exact mountains from logo (background) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <MountainMark
          className="
            absolute bottom-[-290px] left-[60%] -translate-x-1/2
            w-[1050px] sm:w-[1250px] md:w-[1000px]
            opacity-[0.4]
          "
        />  
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-10">
        <div className="flex gap-10  flex-col md:flex-row justify-between items-center md:gap-12">
          {/* Left: Brand block (stacked) */}
          <div className="flex flex-col gap-5 ">
            <div className="flex items-center flex-col md:flex-row  items-center gap-2 pt-2">
              <Link to="/" className="shrink-0" aria-label="Go to homepage">
                <img
                  src="/images/logo/logo-no-bg-cropped.png"
                  alt="Logo"
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain"
                />
              </Link>

              <div className="space-y-1">
                <h3 className="font-heading font-bold text-xl text-foreground text-center md:text-start ">
                  TUM HN Hiking Club
                </h3>

                <p className="text-sm text-muted-foreground">
                  Exploring nature together around Heilbronn
                </p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1 flex flex-col items-center md:items-start ">
              <p>TUM HN Hiking Club</p>
              <p>Bildungscampus 2</p>
              <p>74076 Heilbronn, DE</p>
              <p>
                <a
                  href="mailto:contact@tumhikingclub.com"
                  className="hover:text-primary transition-colors"
                >
                  contact@tumhikingclub.com
                </a>
              </p>
              <p className="text-xs opacity-60 pt-2">&copy; {currentYear}</p>
            </div>
          </div>

          {/* Right: Social links */}
          <div className="md:pl-10 ">
            <h3 className="font-heading font-bold text-lg text-foreground">
              Our Social Media
            </h3>

            <div className="mt-4 flex flex-col gap-2 text-sm  items-center md:items-start pb-24 md:pb-0">
              <a
                href="https://www.instagram.com/tum.hiking.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2 -mx-3 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-[#E1306C]"
              >
                <Instagram className="h-5 w-5 shrink-0" />
                <span className="font-medium">Instagram</span>
              </a>

              <a
                href="https://strava.app.link/1baOJxDklZb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2 -mx-3 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-[#FC4C02]"
              >
                <Activity className="h-5 w-5 shrink-0" />
                <span className="font-medium">Strava</span>
              </a>

              <a
                href="mailto:contact@tumhikingclub.com"
                className="flex items-center gap-3 rounded-lg px-3 py-2 -mx-3 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-primary"
              >
                <Mail className="h-5 w-5 shrink-0" />
                <span className="font-medium">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
