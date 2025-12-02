'use client';

interface HelperCardBioProps {
  bio: string;
}

export function HelperCardBio({ bio }: Readonly<HelperCardBioProps>) {
  return (
    <p className="text-xs text-muted-foreground/90 leading-relaxed line-clamp-4">
      {bio}
    </p>
  );
}
