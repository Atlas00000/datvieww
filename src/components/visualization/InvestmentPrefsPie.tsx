"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type InvestmentPrefsPieProps = { height?: number; donut?: boolean };

export default function InvestmentPrefsPie({ height = 200, donut = false }: InvestmentPrefsPieProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const parts = useMemo(() => {
    const groups = d3.group(displayData, (d) => d.investmentExperience);
    const ordered = ['None', 'Beginner', 'Intermediate', 'Advanced'] as const;
    return ordered.map((k) => ({ key: k as string, value: (groups.get(k) || []).length })).filter((d) => d.value > 0);
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 360;
    const radius = Math.min(width, height) / 2 - 6;
    const svg = d3.select(ref.current).attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const color = d3.scaleOrdinal<string, string>()
      .domain(parts.map((d) => d.key))
      .range(['#93c5fd', '#86efac', '#67e8f9', '#fca5a5']);

    const pie = d3.pie<any>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(donut ? radius * 0.6 : 0).outerRadius(radius);

    const g = svg.append('g');
    const arcs = g.selectAll('path').data(pie(parts)).join('path')
      .attr('fill', (d) => color(d.data.key))
      .attr('d', (d) => arc({ ...d, endAngle: d.startAngle }) as string)
      .attr('opacity', 0.9)
      .transition().duration(800)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return (t) => arc({ ...d, endAngle: i(t) } as any) as string;
      });

    const labelArc = d3.arc<d3.PieArcDatum<any>>()
      .innerRadius(radius * (donut ? 0.85 : 0.7))
      .outerRadius(radius * (donut ? 0.85 : 0.7));
    const labels = g.selectAll('text').data(pie(parts)).join('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d as any)})`)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-[10px] fill-gray-800')
      .text((d) => d.data.key);

    // Emphasis on hover
    g.selectAll('path')
      .on('mouseenter', function () { d3.select(this).attr('opacity', 1); })
      .on('mouseleave', function () { d3.select(this).attr('opacity', 0.9); });
  }, [parts, donut, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


