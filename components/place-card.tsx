import Link from "next/link";
import Image from "next/image";
import { MapPin, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Place = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  coverUrl?: string | null;
  category?: string;
  tags?: string[];
  views?: number;
  isFree?: boolean;
};

type Props = {
  place: Place;
  className?: string;
  priority?: boolean;
};

export function PlaceCard({ place, className, priority = false }: Props) {
  return (
    <Link href={`/mesta/${place.slug}`} className={cn("group block", className)}>
      <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {place.coverUrl ? (
            <Image
              src={place.coverUrl}
              alt={place.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center sunrise-gradient">
              <MapPin className="h-12 w-12 text-primary/40" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            {place.category && (
              <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                {place.category}
              </Badge>
            )}
            {place.isFree && (
              <Badge className="bg-ochre-500 text-white hover:bg-ochre-500">
                Бесплатно
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="space-y-3 p-4">
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
            {place.title}
          </h3>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {place.shortDesc}
          </p>

          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {typeof place.views === "number" && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {place.views.toLocaleString("ru-RU")}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
