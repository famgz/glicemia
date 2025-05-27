'use client';

import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  totalSize: number;
  offset: number;
  onChangeOffset: (offset: number) => void;
  perLoad?: number;
}

const DEFAULT_ITEMS_PER_LOAD = 10;

export default function InfiniteLoadingTrigger({
  totalSize,
  offset,
  onChangeOffset,
  perLoad = DEFAULT_ITEMS_PER_LOAD,
}: Props) {
  const [scrollTriggerRef, inView] = useInView({ delay: 500, threshold: 1 });

  const hasMoreItems = useMemo(() => totalSize > offset, [totalSize, offset]);

  useEffect(() => {
    if (inView && hasMoreItems) {
      onChangeOffset(offset + perLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasMoreItems]);

  return (
    <div className="text-muted-foreground flex-center w-full py-4 print:hidden">
      {hasMoreItems && <div ref={scrollTriggerRef}>Carregando...</div>}
    </div>
  );
}
