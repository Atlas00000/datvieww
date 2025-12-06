"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type EngagementDensityProps = { height?: number };

export default function EngagementDensity({ height = 220 }: EngagementDensityProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const scores = useMemo(() => displayData.map((d) => d.digitalEngagementScore), [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 32 };
    const width = ref.current.clientWidth || 500;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]).nice();

    // Kernel density estimate
    const kdeX = d3.range(0, 100.01, 1);
    const kernel = (u: number) => (Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0);
    const bandwidth = 6;
    const density = kdeX.map((x0) => {
      const sum = scores.reduce((acc, v) => acc + kernel((x0 - v) / bandwidth), 0);
      return { x: x0, y: sum / (scores.length * bandwidth) };
    });
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(density, (d) => d.y) ?? 1])
      .nice()
      .range([innerH, 0]);

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveCatmullRom.alpha(0.6));

    const path = g.append('path')
      .datum(density)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-width', 2)
      .attr('d', line as any)
      .attr('stroke-dasharray', function () {
        const len = (this as SVGPathElement).getTotalLength();
        return `${len} ${len}`;
      })
      .attr('stroke-dashoffset', function () {
        const len = (this as SVGPathElement).getTotalLength();
        return String(len);
      })
      .transition()
      .duration(900)
      .attr('stroke-dashoffset', 0);

    const xAxis = d3.axisBottom(x).ticks(6).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(3).tickSize(-innerW).tickSizeOuter(0);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-200'))
      .call((s) => s.select('.domain').attr('class', 'stroke-gray-300'));

    g.append('g')
      .call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'))
      .call((s) => s.select('.domain').attr('class', 'stroke-gray-300'));

    // Crosshair line
    const vx = g.append('line')
      .attr('y1', 0)
      .attr('y2', innerH)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Hover tracker along density curve
    const tracker = g.append('circle').attr('r', 4).attr('fill', 'var(--color-primary)').style('display', 'none');
    
    // Enhanced tooltip with data breakdown
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    // Calculate score distribution for breakdown
    const scoreRanges = [
      { label: 'Low (0-40)', min: 0, max: 40 },
      { label: 'Medium (41-60)', min: 41, max: 60 },
      { label: 'High (61-80)', min: 61, max: 80 },
      { label: 'Very High (81-100)', min: 81, max: 100 },
    ];
    const breakdown = scoreRanges.map((range) => {
      const count = scores.filter((s) => s >= range.min && s <= range.max).length;
      return { ...range, count, percentage: (count / scores.length) * 100 };
    });

    g.append('rect').attr('x', 0).attr('y', 0).attr('width', innerW).attr('height', innerH).attr('fill', 'transparent')
      .on('mouseenter', () => {
        vx.style('display', null);
        tracker.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', () => {
        vx.style('display', 'none');
        tracker.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const xVal = Math.max(0, Math.min(100, x.invert(mx)));
        vx.attr('x1', mx).attr('x2', mx);
        
        // Find nearest density sample
        const idx = d3.bisector((d: any) => d.x).center(density as any, xVal);
        const d = (density as any)[idx];
        const px = x(d.x);
        const py = y(d.y);
        tracker.attr('cx', px).attr('cy', py);

        // Update tooltip with detailed breakdown
        tipTitle.text('Engagement Score Distribution');
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
          const tipWidth = Math.max(bbox.width + 20, 220);
          const tipHeight = bbox.height + 40;
          tipBg
            .attr('width', tipWidth)
            .attr('height', tipHeight)
            .attr('x', -tipWidth / 2)
            .attr('y', -tipHeight - 10);
          
          tipTitle.attr('x', -tipWidth / 2 + 10).attr('y', 14);
          tipContent.attr('transform', `translate(${-tipWidth / 2 + 10}, 20)`);
          
          tip.attr('transform', `translate(${Math.min(innerW - (tipWidth + 20), px + 10)},${Math.max(12, py - tipHeight - 20)})`);
        }
      });
  }, [scores, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


