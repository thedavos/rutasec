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

type ResourceSiteIconProps = {
  iconUrl: string | null;
  resourceType: ResourceType;
};

export function ResourceSiteIcon({ iconUrl, resourceType }: ResourceSiteIconProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const FallbackIcon = resourceTypeIcons[resourceType];
  const showImage = Boolean(iconUrl) && !imageFailed;

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border-subtle)] bg-[var(--surface-raised)]",
      )}
      aria-hidden={showImage}
    >
      {showImage ? (
        <img
          src={iconUrl!}
          alt=""
          width={32}
          height={32}
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <FallbackIcon
          className="size-4 text-[var(--text-secondary)]"
          aria-label={resourceTypeLabel(resourceType)}
        />
      )}
    </div>
  );
}
