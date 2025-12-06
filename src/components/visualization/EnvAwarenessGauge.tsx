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

  const breakdown = useMemo(() => {
    const levels = ['Low', 'Medium', 'High', 'Very High'] as const;
    const counts = d3.rollup(displayData, (v) => v.length, (d) => d.environmentalConsciousness as string);
    return levels.map((level) => ({
      level,
      count: counts.get(level) || 0,
      percentage: ((counts.get(level) || 0) / displayData.length) * 100,
    }));
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

    // Interactive overlay with crosshair and tooltip
    const tip = svg.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    // Crosshair indicator (radial line from center)
    const crosshair = svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -radius * 0.7)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Hover overlay
    const overlay = svg.append('circle')
      .attr('r', radius)
      .attr('fill', 'transparent')
      .attr('cursor', 'pointer')
      .on('mouseenter', () => {
        crosshair.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', () => {
        crosshair.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, svg.node());
        const angle = Math.atan2(my, mx);
        const normalizedAngle = angle + Math.PI / 2; // Adjust for gauge start
        
        // Update crosshair position
        const crosshairLength = radius * 0.7;
        crosshair
          .attr('x2', Math.cos(angle) * crosshairLength)
          .attr('y2', Math.sin(angle) * crosshairLength);

        // Update tooltip with breakdown data
        tipTitle.text('Environmental Awareness Breakdown');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        breakdown.forEach((item, idx) => {
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          row.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', idx === 0 ? '#93c5fd' : idx === 1 ? '#86efac' : idx === 2 ? '#67e8f9' : '#fca5a5')
            .attr('rx', 2);
          row.append('text')
            .attr('x', 16)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.level}: ${item.count} (${item.percentage.toFixed(1)}%)`);
          yOffset += 16;
        });

        const bbox = tipContent.node()?.getBBox();
        if (bbox) {
          const tipWidth = Math.max(bbox.width + 20, 180);
          const tipHeight = bbox.height + 40;
          tipBg
            .attr('width', tipWidth)
            .attr('height', tipHeight)
            .attr('x', -tipWidth / 2)
            .attr('y', -tipHeight - 10);
          
          tipTitle.attr('x', -tipWidth / 2 + 10).attr('y', 14);
          tipContent.attr('transform', `translate(${-tipWidth / 2 + 10}, 20)`);
          
          // Position tooltip above gauge
          tip.attr('transform', `translate(${mx}, ${my - radius - tipHeight - 20})`);
        }
      });
  }, [score, height, breakdown]);

  return <svg ref={ref} className="w-full" height={height} />;
}


