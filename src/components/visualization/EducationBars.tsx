"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type EducationBarsProps = { height?: number };

export default function EducationBars({ height = 160 }: EducationBarsProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const data = useMemo(() => {
    const map = d3.rollup(
      displayData,
      (v) => v.length,
      (d) => d.education
    );
    const entries = Array.from(map, ([education, value]) => ({ education: String(education), value }));
    return entries.sort((a, b) => b.value - a.value);
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 100 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.education))
      .range([0, innerH])
      .padding(0.25);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 1])
      .nice()
      .range([0, innerW]);

    g.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('y', (d) => y(d.education) as number)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .attr('rx', 8)
      .attr('fill', 'var(--color-primary)')
      .transition()
      .duration(900)
      .attr('width', (d) => x(d.value));

    const xAxis = d3.axisBottom(x).ticks(3).tickSize(-innerH).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).tickSizeOuter(0);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'))
      .call((s) => s.select('.domain').attr('class', 'stroke-gray-300'));

    g.append('g')
      .call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-700'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-200'))
      .call((s) => s.select('.domain').attr('class', 'stroke-gray-300'));
  }, [data, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


