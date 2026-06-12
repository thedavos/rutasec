import {
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  Newspaper,
  Play,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import type { ResourceType } from "#/modules/catalog/domain/entities/resource";
import { resourceTypeLabel } from "#/shared/i18n/resource-labels";
import { cn } from "#/shared/utils";

const resourceTypeIcons: Record<ResourceType, LucideIcon> = {
  course: GraduationCap,
  book: BookOpen,
  documentation: FileText,
  video: Play,
  lab: FlaskConical,
  tool: Wrench,
  article: Newspaper,
};

const iconSizes = {
  sm: {
    box: "size-8 rounded-md",
    fallback: "size-4",
    pixels: 32,
  },
  md: {
    box: "size-10 rounded-lg sm:size-12",
    fallback: "size-5 sm:size-6",
    pixels: 48,
  },
  lg: {
    box: "size-12 rounded-xl sm:size-16",
    fallback: "size-6 sm:size-8",
    pixels: 64,
  },
} as const;

type ResourceSiteIconProps = {
  iconUrl: string | null;
  resourceType: ResourceType;
  size?: keyof typeof iconSizes;
  className?: string;
};

export function ResourceSiteIcon({
  iconUrl,
  resourceType,
  size = "sm",
  className,
}: ResourceSiteIconProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const FallbackIcon = resourceTypeIcons[resourceType];
  const showImage = Boolean(iconUrl) && !imageFailed;
  const dimensions = iconSizes[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-raised)]",
        dimensions.box,
        className,
      )}
      aria-hidden={showImage}
    >
      {showImage ? (
        <img
          src={iconUrl!}
          alt=""
          width={dimensions.pixels}
          height={dimensions.pixels}
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <FallbackIcon
          className={cn("text-[var(--text-secondary)]", dimensions.fallback)}
          aria-label={resourceTypeLabel(resourceType)}
        />
      )}
    </div>
  );
}
