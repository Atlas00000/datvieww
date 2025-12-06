"use client";

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type AgeHistogramProps = {
  height?: number;
};

export default function AgeHistogram({ height = 160 }: AgeHistogramProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ages = displayData.map((d) => d.age);

    const margin = { top: 8, right: 8, bottom: 24, left: 28 };
    const width = ref.current.clientWidth || 360;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    const root = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([d3.min(ages) ?? 0, d3.max(ages) ?? 100])
      .nice()
      .range([0, innerW]);

    const bins = d3
      .bin<number, number>()
      .domain(x.domain() as [number, number])
      .thresholds(12)(ages);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (b) => b.length) ?? 1])
      .nice()
      .range([innerH, 0]);

    const bar = root
      .append('g')
      .attr('fill', 'currentColor')
      .selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', (d) => x(d.x0 as number) + 1)
      .attr('y', innerH)
      .attr('width', (d) => Math.max(0, x(d.x1 as number) - x(d.x0 as number) - 2))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('class', 'text-[var(--color-primary)]/80');

    bar
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(d.length))
      .attr('height', (d) => innerH - y(d.length));

    // Axes
    const xAxis = d3.axisBottom(x).ticks(6).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(3).tickSize(-innerW).tickSizeOuter(0);

    root
      .append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis as any)
      .call((g) => g.selectAll('text').attr('class', 'text-xs fill-gray-500'))
      .call((g) => g.selectAll('line').attr('class', 'stroke-gray-200'))
      .call((g) => g.select('.domain').attr('class', 'stroke-gray-300'));

    root
      .append('g')
      .call(yAxis as any)
      .call((g) => g.selectAll('text').attr('class', 'text-xs fill-gray-500'))
      .call((g) => g.selectAll('line').attr('class', 'stroke-gray-100'))
      .call((g) => g.select('.domain').attr('class', 'stroke-gray-300'));

    // Crosshair line
    const vx = root.append('line')
      .attr('y1', 0)
      .attr('y2', innerH)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Enhanced tooltip with data breakdown
    const tip = root.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    const total = ages.length;
    const ageRanges = [
      { label: '18-25', min: 18, max: 25 },
      { label: '26-35', min: 26, max: 35 },
      { label: '36-45', min: 36, max: 45 },
      { label: '46-55', min: 46, max: 55 },
      { label: '56+', min: 56, max: 100 },
    ];
    const breakdown = ageRanges.map((range) => {
      const count = ages.filter((a) => a >= range.min && a <= range.max).length;
      return { ...range, count, percentage: (count / total) * 100 };
    });

    root.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerW)
      .attr('height', innerH)
      .attr('fill', 'transparent')
      .on('mouseenter', () => {
        vx.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', () => {
        vx.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        vx.attr('x1', mx).attr('x2', mx);

        // Find nearest bin
        const xVal = x.invert(mx);
        const nearestBin = bins.reduce((prev, curr) => {
          const prevDist = Math.abs(xVal - ((prev.x0 as number) + (prev.x1 as number)) / 2);
          const currDist = Math.abs(xVal - ((curr.x0 as number) + (curr.x1 as number)) / 2);
          return currDist < prevDist ? curr : prev;
        });

        // Update tooltip with detailed breakdown
        tipTitle.text('Age Distribution Breakdown');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        breakdown.forEach((item, idx) => {
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          row.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', idx === 0 ? '#93c5fd' : idx === 1 ? '#86efac' : idx === 2 ? '#67e8f9' : idx === 3 ? '#fca5a5' : '#fde047')
            .attr('rx', 2);
          row.append('text')
            .attr('x', 16)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.label}: ${item.count} (${item.percentage.toFixed(1)}%)`);
          yOffset += 16;
        });

        // Add current bin info
        const binRange = `${Math.round(nearestBin.x0 as number)}-${Math.round(nearestBin.x1 as number)}`;
        const binPct = ((nearestBin.length / total) * 100).toFixed(1);
        tipContent.append('g').attr('transform', `translate(0, ${yOffset + 8})`)
          .append('text')
          .attr('x', 0)
          .attr('y', 10)
          .attr('class', 'text-xs fill-gray-900 font-semibold')
          .text(`Bin ${binRange}: ${nearestBin.length} (${binPct}%)`);

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
          
          tip.attr('transform', `translate(${Math.min(innerW - (tipWidth + 20), mx + 10)},${Math.max(12, innerH / 2 - tipHeight / 2)})`);
        }
      });
  }, [displayData, height]);

  return (
    <svg ref={ref} className="w-full" height={height} />
  );
}


