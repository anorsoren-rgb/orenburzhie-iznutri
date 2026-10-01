import Link from "next/link";
import Image from "next/image";
import { MapPin, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PlaceCardProps = {
  place: {
    id: string;
    slug: string;
    title: string;
    shortDesc: string;
    coverUrl: string | null;
    category?: string;
    views: number;
    isFree: boolean;
  };
  priority?: boolean;
};

export function PlaceCard({ place, priority }: PlaceCardProps) {
  return (
    <Link href={`/mesta/${place.slug}`} className="group block">
      <Card className="h-full overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {place.coverUrl ? (
            <Image
              src={place.coverUrl}
              alt={place.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center sunrise-gradient dark:sunrise-gradient-dark">
              <MapPin className="h-12 w-12 text-primary/30 sm:h-16 sm:w-16" />
            </div>
          )}

          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
            {place.category && (
              <Badge
                variant="secondary"
                className="bg-white/90 text-xs text-foreground backdrop-blur-sm"
              >
                {place.category}
              </Badge>
            )}
            {place.isFree && (
              <Badge className="bg-ochre-500 text-xs text-white hover:bg-ochre-500">
                Бесплатно
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="space-y-2 p-4 sm:p-5">
          <h3 className="font-display text-base font-semibold leading-tight transition-colors group-hover:text-primary sm:text-lg">
            {place.title}
          </h3>

          {place.shortDesc && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {place.shortDesc}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            <span>{place.views} просмотров</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}