"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type EnvAwarenessGaugeProps = { height?: number };

export default function EnvAwarenessGauge({ height = 200 }: EnvAwarenessGaugeProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const score = useMemo(() => {
    const map: Record<string, number> = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };
    const avg = d3.mean(displayData, (r) => map[r.environmentalConsciousness]) || 0;
    return (avg / 4) * 100;
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 360;
    const radius = Math.min(width, height) / 2 - 6;
    const svg = d3.select(ref.current).attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const arc = d3.arc().innerRadius(radius * 0.7).outerRadius(radius);
    const bg = { startAngle: -Math.PI / 2, endAngle: Math.PI / 2 };
    const fgEnd = -Math.PI / 2 + (Math.PI * score) / 100;
    svg.append('path').attr('d', arc(bg as any) as any).attr('fill', '#e5e7eb');
    const fg = svg.append('path').attr('fill', 'url(#envGrad)').attr('d', arc({ startAngle: bg.startAngle, endAngle: bg.startAngle } as any) as any)
      .attr('filter', 'url(#glow)');

    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'envGrad').attr('x1', '0%').attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', 'var(--color-info)');
    grad.append('stop').attr('offset', '100%').attr('stop-color', 'var(--color-secondary)');

    // subtle glow
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', 2).attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    fg.transition().duration(900).attrTween('d', function () {
      const i = d3.interpolate(bg.startAngle, fgEnd);
      return (t) => arc({ startAngle: bg.startAngle, endAngle: i(t) } as any) as any;
    });

    svg.append('text').attr('text-anchor', 'middle').attr('y', 8).attr('class', 'text-xl fill-gray-900 font-bold').text(`${Math.round(score)}%`);
  }, [score, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


