"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type HealthScoreGaugeProps = { height?: number };

export default function HealthScoreGauge({ height = 200 }: HealthScoreGaugeProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const score = useMemo(() => {
    const avg = d3.mean(displayData, (r) => r.healthScore) || 0;
    return avg; // already 0..100
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 360;
    const radius = Math.min(width, height) / 2 - 6;

    const svg = d3.select(ref.current).attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const arc = d3.arc().innerRadius(radius * 0.7).outerRadius(radius);
    const background = { startAngle: -Math.PI / 2, endAngle: Math.PI / 2 };
    const foreground = { startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 + (Math.PI * score) / 100 };

    svg.append('path').attr('d', arc(background as any) as any).attr('fill', '#e5e7eb');
    const fg = svg.append('path').attr('fill', 'url(#gaugeGrad)').attr('d', arc({ ...foreground, endAngle: background.startAngle } as any) as any);

    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'gaugeGrad').attr('x1', '0%').attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', 'var(--color-secondary)');
    grad.append('stop').attr('offset', '100%').attr('stop-color', 'var(--color-primary)');

    fg.transition().duration(900).attrTween('d', function () {
      const i = d3.interpolate(background.startAngle, foreground.endAngle as number);
      return (t) => arc({ startAngle: background.startAngle, endAngle: i(t) } as any) as any;
    });

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 8)
      .attr('class', 'text-xl fill-gray-900 font-bold')
      .text(`${Math.round(score)}%`);

    // Tick marks for readability
    const ticks = 5;
    const tickG = svg.append('g');
    for (let i = 0; i <= ticks; i++) {
      const a = -Math.PI / 2 + (Math.PI * i) / ticks;
      const x1 = Math.cos(a) * (radius * 0.7 - 2);
      const y1 = Math.sin(a) * (radius * 0.7 - 2);
      const x2 = Math.cos(a) * (radius * 0.7 - 8);
      const y2 = Math.sin(a) * (radius * 0.7 - 8);
      tickG.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2).attr('stroke', '#e5e7eb');
    }
  }, [score, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


