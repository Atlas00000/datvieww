"use client";

import { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export default function Reveal({ children, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null as any);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current as unknown as HTMLElement;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Comp: any = as;
  return (
    <Comp ref={ref} className={`reveal ${className}`}>
      {children}
    </Comp>
  );
}


