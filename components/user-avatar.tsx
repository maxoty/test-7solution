"use client";

import Image from "next/image";
import { useState } from "react";

type UserAvatarProps = {
  src: string;
  name: string;
  fallbackText: string;
};

export default function UserAvatar({
  src,
  name,
  fallbackText,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        aria-label={`${name} profile image unavailable`}
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        role="img"
      >
        {fallbackText || "?"}
      </span>
    );
  }

  return (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
      <Image
        alt={name}
        className="object-cover"
        fill
        onError={() => setHasError(true)}
        sizes="48px"
        src={src}
      />
    </span>
  );
}
