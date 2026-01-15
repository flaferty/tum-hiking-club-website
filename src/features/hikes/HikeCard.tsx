import { Hike, Difficulty } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface HikeCardProps {
  hike: Hike;
  onClick?: () => void;
}

const difficultyVariant: Record<Difficulty, "easy" | "moderate" | "hard" | "expert"> =
  {
    easy: "easy",
    moderate: "moderate",
    hard: "hard",
    expert: "expert",
  };

export function HikeCard({ hike, onClick }: HikeCardProps) {
  const spotsLeft = hike.max_participants - (hike.enrollment_count || 0);
  const dateStr = format(new Date(hike.date), "dd/MM/yyyy");

  const spotsLabel =
    hike.status === "upcoming" ? `${spotsLeft} spots left` : "Event ended";

  return (
    <Card
      onClick={onClick}
      className="
        group cursor-pointer overflow-hidden
        rounded-2xl border bg-card
        transition
        hover:shadow-lg
        focus-within:ring-2 focus-within:ring-ring
        w-full max-w-full
      "
    >
      {/* Media */}
      <div className="relative w-full aspect-[4/3] bg-muted shrink-0">
        {hike.image_url ? (
          <>
            <img
              src={hike.image_url}
              alt={hike.name}
              className="
                h-full w-full object-cover
                object-center
                transition-transform duration-500
                group-hover:scale-[1.03]
              "
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
                  "hidden"
                );
              }}
            />
            {/* Soft overlay to make badges feel grounded */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          </>
        ) : null}

        <div
          className={`${
            hike.image_url ? "hidden" : ""
          } flex h-full items-center justify-center bg-muted`}
        >
          <div className="flex items-center gap-2 text-muted-foreground/70">
            <ImageIcon className="h-10 w-10" />
            <span className="text-sm">No image</span>
          </div>
        </div>

        {/* Top-right date */}
        <div className="absolute right-3 top-3">
          <Badge className="bg-background/85 text-foreground backdrop-blur-sm border border-border/60">
            {dateStr}
          </Badge>
        </div>

        {/* Bottom-left status pill */}
        <div className="absolute left-3 bottom-3">
          <Badge
            variant="secondary"
            className="bg-background/85 text-foreground backdrop-blur-sm border border-border/60"
          >
            {spotsLabel}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold leading-snug line-clamp-2 min-w-0 flex-1 break-words">
            {hike.name}
          </h3>

          <Badge
            variant={difficultyVariant[hike.difficulty]}
            className="shrink-0 text-xs"
          >
            {hike.difficulty}
          </Badge>
        </div>

        {/* Optional location row (only if your Hike has it) */}
        {hike.location_name && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{hike.location_name}</span>
          </div>
        )}

        {hike.description ? (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 break-words overflow-hidden">
            {hike.description}
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground/80">
              {hike.distance} km
            </span>
            <span className="opacity-60">•</span>
            <span className="opacity-80">
              {hike.max_participants} max
            </span>
          </div>

          <span className="opacity-80">
            {hike.status === "upcoming" ? "Upcoming" : "Past"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
