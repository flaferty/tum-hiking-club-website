import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { HikeCard } from "@/features/hikes/HikeCard";
import { HikeDetailModal } from "@/features/hikes/HikeDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, MapPin, History } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Hike } from "@/lib/types";
import { useAuth } from "@/features/auth/AuthContext";
import { useHikes } from "@/features/hikes/useHikes";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-mountains.jpg";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import HikingMap from "@/features/hikes/HikingMap";

type FilterType = "all" | "upcoming" | "completed";

export default function Index() {
  const { isAdmin } = useAuth();
  const { data: hikes = [], isLoading } = useHikes();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedHike, setSelectedHike] = useState<Hike | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pastHikesOpen, setPastHikesOpen] = useState(false);

  const filteredHikes = hikes.filter((hike) => {
    if (filter === "all") return true;
    return hike.status === filter;
  });

  const upcomingHikes = hikes.filter((h) => h.status === "upcoming");
  const pastHikes = hikes.filter((h) => h.status === "completed");
  const upcomingCount = upcomingHikes.length;
  const pastCount = pastHikes.length;

  const handleHikeSelect = (hike: Hike) => {
    setSelectedHike(hike);
    setIsModalOpen(true);
  };

   {/* Upcoming Adventures */}
   const UpcomingSection = (
    <section className="container mx-auto px-4 ">
      <h2 className="mb-6 font-heading text-2xl font-bold md:text-3xl">
        Upcoming Adventures
      </h2>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-4">
              <Skeleton className="h-48 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : upcomingHikes.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full overflow-hidden">
          {upcomingHikes.map((hike, index) => (
            <div
              key={hike.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <HikeCard hike={hike} onClick={() => handleHikeSelect(hike)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground">No upcoming hikes scheduled.</p>
        </div>
      )}
    </section>
  );

  {/* Past Adventures - Collapsible */}
  const PastSection = pastHikes.length > 0 && (
    <section className="container mx-auto px-4 pb-16">
      <Collapsible open={pastHikesOpen} onOpenChange={setPastHikesOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <History className="h-4 w-4" />
            Past Adventures
            <Badge variant="secondary" className="ml-1">
              {pastCount}
            </Badge>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                pastHikesOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pastHikes.map((hike, index) => (
              <div
                key={hike.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <HikeCard hike={hike} onClick={() => handleHikeSelect(hike)} />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );

  const SectionDivider = (
    <div className="mx-auto px-4">
      <div className="my-14 h-px bg-border/60" />
    </div>
  );

  const scrollToMap = () => {
    document
      .getElementById("hiking-map")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mountain/60 via-mountain/40 to-background" />

        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 bg-card/20 text-white backdrop-blur-sm border-card/30 pl-2 pr-4 py-1 flex items-center gap-2"
          >
            <img
              src="/images/logo/logo.jpg"
              alt="TUM HN Hiking Club Logo"
              className="h-6 w-6 object-contain rounded-md"
            />
            TUM HN Hiking Community
          </Badge>

          <h1 className="mb-4 font-heading text-4xl font-bold text-white md:text-6xl lg:text-7xl animate-fade-in">
            Pick a trail.
            <br />
            <span className="text-white">We’ll bring the people.</span>
          </h1>

          <p
            className="mb-8 max-w-2xl text-lg text-gray-300 md:text-xl animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Join fellow TUM students on unforgettable hiking adventures through
            Germany's most stunning landscapes
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section id="hiking-map" className="container mx-auto px-4 py-12">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Hiking Map
            </h2>
            <p className="text-muted-foreground">
              Click on a marker to view hike details and enroll
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <Link to="/admin/add-hike">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Hike
                </Button>
              </Link>
            )}

            <div className="flex rounded-lg border border-border bg-card p-1">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "ghost"}
                size="sm"
                className="gap-1"
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                >
                  {upcomingCount}
                </Badge>
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setFilter("completed");
                  setPastHikesOpen(true);
                }}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[400px] md:h-[500px] rounded-xl bg-muted flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground animate-pulse" />
          </div>
        ) : (
          <ErrorBoundary
            fallback={
              <div className="h-[400px] md:h-[500px] rounded-xl border border-border bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Map failed to load.
                  </p>
                </div>
              </div>
            }
          >
            <HikingMap
              hikes={filteredHikes}
              selectedHikeId={selectedHike?.id || null}
              onHikeSelect={handleHikeSelect}
              className="h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg"
            />
          </ErrorBoundary>
        )}
      </section>

      {filter === "completed" ? (
        <>
          {PastSection}
          {SectionDivider}
          {UpcomingSection}
        </>
      ) : (
        <>
          {UpcomingSection}
          {SectionDivider}
          {PastSection}
        </>
      )}

      {/* Hike Detail Modal */}
      <HikeDetailModal
        hike={selectedHike}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHike(null);
        }}
      />
    </div>
  );
}
