'use client';

import { Smile, SmilePlus, Meh, Frown, AlertCircle } from 'lucide-react';

import { useMoodMapping } from '@/hooks/use-mood-mapping';

interface ReflectionMoodBadgeProps {
  mood: string;
}

export function ReflectionMoodBadge({
  mood,
}: Readonly<ReflectionMoodBadgeProps>) {
  const { getMoodLabel, getMoodColor, getMoodIcon } = useMoodMapping();

  const renderMoodIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      smile: <Smile className="h-5 w-5" />,
      'smile-plus': <SmilePlus className="h-5 w-5" />,
      meh: <Meh className="h-5 w-5" />,
      frown: <Frown className="h-5 w-5" />,
      'alert-circle': <AlertCircle className="h-5 w-5" />,
    };
    return iconMap[iconName] || <Meh className="h-5 w-5" />;
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full bg-muted ${getMoodColor(mood)}`}
    >
      {renderMoodIcon(getMoodIcon(mood))}
      <span className="font-medium">{getMoodLabel(mood)}</span>
    </div>
  );
}
