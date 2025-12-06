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

  const breakdown = useMemo(() => {
    const ranges = [
      { label: 'Poor (0-40)', min: 0, max: 40 },
      { label: 'Fair (41-60)', min: 41, max: 60 },
      { label: 'Good (61-80)', min: 61, max: 80 },
      { label: 'Excellent (81-100)', min: 81, max: 100 },
    ];
    return ranges.map((range) => {
      const count = displayData.filter((d) => d.healthScore >= range.min && d.healthScore <= range.max).length;
      return {
        label: range.label,
        count,
        percentage: (count / displayData.length) * 100,
      };
    });
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
        
        // Update crosshair position
        const crosshairLength = radius * 0.7;
        crosshair
          .attr('x2', Math.cos(angle) * crosshairLength)
          .attr('y2', Math.sin(angle) * crosshairLength);

        // Update tooltip with breakdown data
        tipTitle.text('Health Score Distribution');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        breakdown.forEach((item, idx) => {
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          row.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', idx === 0 ? '#fca5a5' : idx === 1 ? '#fde047' : idx === 2 ? '#86efac' : '#67e8f9')
            .attr('rx', 2);
          row.append('text')
            .attr('x', 16)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.label}: ${item.count} (${item.percentage.toFixed(1)}%)`);
          yOffset += 16;
        });

        const bbox = tipContent.node()?.getBBox();
        if (bbox) {
          const tipWidth = Math.max(bbox.width + 20, 200);
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


