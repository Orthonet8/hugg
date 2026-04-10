import type { Department, NotificationType } from "../types";

export const departmentStyles: Record<
  Department,
  {
    badge: string;
    chip: string;
    dot: string;
    border: string;
  }
> = {
  ትምህርት: {
    badge:
      "bg-[color:var(--dept-edu-bg)] text-[color:var(--dept-edu-text)] border border-[color:color-mix(in_srgb,var(--dept-edu-dot)_40%,transparent)]",
    chip: "data-[active=true]:bg-[color:var(--dept-edu-chip-bg)] data-[active=true]:text-[color:var(--dept-edu-chip-text)]",
    dot: "bg-[color:var(--dept-edu-dot)]",
    border: "border-[color:var(--dept-edu-dot)]",
  },
  መዝሙር: {
    badge:
      "bg-[color:var(--dept-song-bg)] text-[color:var(--dept-song-text)] border border-[color:color-mix(in_srgb,var(--dept-song-dot)_40%,transparent)]",
    chip: "data-[active=true]:bg-[color:var(--dept-song-chip-bg)] data-[active=true]:text-[color:var(--dept-song-chip-text)]",
    dot: "bg-[color:var(--dept-song-dot)]",
    border: "border-[color:var(--dept-song-dot)]",
  },
  ልማት: {
    badge:
      "bg-[color:var(--dept-dev-bg)] text-[color:var(--dept-dev-text)] border border-[color:color-mix(in_srgb,var(--dept-dev-dot)_40%,transparent)]",
    chip: "data-[active=true]:bg-[color:var(--dept-dev-chip-bg)] data-[active=true]:text-[color:var(--dept-dev-chip-text)]",
    dot: "bg-[color:var(--dept-dev-dot)]",
    border: "border-[color:var(--dept-dev-dot)]",
  },
  "አባላት ጉዳይ": {
    badge:
      "bg-[color:var(--dept-member-bg)] text-[color:var(--dept-member-text)] border border-[color:color-mix(in_srgb,var(--dept-member-dot)_40%,transparent)]",
    chip: "data-[active=true]:bg-[color:var(--dept-member-chip-bg)] data-[active=true]:text-[color:var(--dept-member-chip-text)]",
    dot: "bg-[color:var(--dept-member-dot)]",
    border: "border-[color:var(--dept-member-dot)]",
  },
  ፋይናንስ: {
    badge:
      "bg-[color:var(--dept-finance-bg)] text-[color:var(--dept-finance-text)] border border-[color:color-mix(in_srgb,var(--dept-finance-dot)_40%,transparent)]",
    chip: "data-[active=true]:bg-[color:var(--dept-finance-chip-bg)] data-[active=true]:text-[color:var(--dept-finance-chip-text)]",
    dot: "bg-[color:var(--dept-finance-dot)]",
    border: "border-[color:var(--dept-finance-dot)]",
  },
};

export const notificationTypeLabel: Record<NotificationType, string> = {
  news: "ዜና",
  event: "ዝግጅት",
};
