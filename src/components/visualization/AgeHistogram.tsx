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
  }, [displayData, height]);

  return (
    <svg ref={ref} className="w-full" height={height} />
  );
}


