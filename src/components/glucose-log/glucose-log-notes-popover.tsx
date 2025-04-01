// components/glucose-log/glucose-log-notes.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface GlucoseLogNotesProps {
  notes: string | null | undefined;
}

export function GlucoseLogNotesPopover({ notes }: GlucoseLogNotesProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [notes, textRef?.current?.clientWidth]);

  if (!notes) {
    return <span>-</span>;
  }

  return (
    <div className="flex items-center justify-center">
      {isTruncated ? (
        <Popover>
          <PopoverTrigger asChild>
            <p
              ref={textRef}
              className="text-muted-foreground cursor-pointer truncate text-xs hover:underline"
              title={notes}
            >
              {notes}
            </p>
          </PopoverTrigger>
          <PopoverContent className="text-muted-foreground max-w-xs text-sm break-words">
            {notes}
          </PopoverContent>
        </Popover>
      ) : (
        <p ref={textRef} className="text-muted-foreground truncate text-xs">
          {notes}
        </p>
      )}
    </div>
  );
}
