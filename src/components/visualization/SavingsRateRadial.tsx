"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type Props = { height?: number };

// Radial gauge showing distribution of savings rates (stacked ring)
export default function SavingsRateRadial({ height = 240 }: Props) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const counts = useMemo(() => {
    const cats = ['Low', 'Medium', 'High', 'Very High'] as const;
    const c = Object.fromEntries(cats.map((k) => [k, 0])) as Record<(typeof cats)[number], number>;
    for (const d of displayData) {
      // Derive proxy savings rate: higher incomeLevel and lower priceSensitivity -> higher savings
      const inc = d.incomeLevel; // Low | Medium | High
      const ps = d.priceSensitivity; // Low | Medium | High | Very High
      let score = 0;
      score += inc === 'High' ? 2 : inc === 'Medium' ? 1 : 0;
      score += ps === 'Low' ? 2 : ps === 'Medium' ? 1 : 0;
      const bucket = score >= 3 ? 'Very High' : score === 2 ? 'High' : score === 1 ? 'Medium' : 'Low';
      c[bucket as (typeof cats)[number]] += 1;
    }
    return { cats: cats as unknown as string[], values: cats.map((k) => ({ k, v: c[k] })) };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 500;
    const radius = Math.min(width, height) / 2 - 8;
    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);
    const color = d3.scaleOrdinal<string>().domain(counts.cats).range(['#E5E7EB', '#CBD5E1', '#93C5FD', '#34D399']);

    const pie = d3.pie<any>().value((d: any) => d.v).sort(null);
    const arc = d3.arc<any>().innerRadius(radius * 0.55).outerRadius(radius);

    const arcs = g.selectAll('path').data(pie(counts.values)).join('path')
      .attr('fill', (d: any) => color(d.data.k) as string)
      .attr('d', arc as any).attr('opacity', 0)
      .transition().duration(700).attr('opacity', 1);

    // Center label
    const total = d3.sum(counts.values, (d: any) => d.v) || 1;
    const high = counts.values.find((v: any) => v.k === 'High')?.v || 0;
    const pct = Math.round((high / total) * 100);
    g.append('text').attr('text-anchor', 'middle').attr('class', 'text-lg fill-gray-900 font-semibold').attr('y', 6).text(`${pct}% High`);

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${8},${8})`);
    counts.cats.forEach((k, i) => {
      const row = legend.append('g').attr('transform', `translate(0,${i * 16})`).attr('cursor', 'pointer');
      row.append('rect').attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', color(k) as string);
      row.append('text').attr('x', 16).attr('y', 9).attr('class', 'text-[11px] fill-gray-700').text(`${k}`);
      row.on('pointerenter', () => g.selectAll('path').attr('opacity', (d: any) => (d.data.k === k ? 1 : 0.35)) )
         .on('pointerleave', () => g.selectAll('path').attr('opacity', 1));
    });
  }, [counts, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


