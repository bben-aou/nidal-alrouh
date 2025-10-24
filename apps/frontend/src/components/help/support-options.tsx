'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockSupportOptions, type SupportOption } from '@/lib/mock-data/help';

interface SupportOptionsProps {
  options?: SupportOption[];
}

export function SupportOptions({
  options = mockSupportOptions,
}: Readonly<SupportOptionsProps>) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {options.map((option, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent className="p-6">
            <div
              className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-4`}
            >
              <option.icon className={`h-6 w-6 ${option.color}`} />
            </div>
            <h3 className="font-semibold mb-2">{option.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {option.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {option.availability}
              </span>
              <Button size="sm">{option.action}</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
