'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

type Props = {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
};

export default function CounterAnimation({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '' 
}: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView) {
      hasAnimated.current = true;
      setCount(0);
      
      const startTime = Date.now();
      const endTime = startTime + duration;

      const updateCount = () => {
        const now = Date.now();
        const remaining = endTime - now;
        
        if (remaining <= 0) {
          setCount(end);
          return;
        }

        const progress = (duration - remaining) / duration;
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);

        requestAnimationFrame(updateCount);
      };

      requestAnimationFrame(updateCount);
    } else if (hasAnimated.current) {
      // Reset when out of view so it can animate again
      setCount(0);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
