"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type FitnessPieProps = { height?: number };

export default function FitnessPie({ height = 200 }: FitnessPieProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const parts = useMemo(() => {
    const order = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'];
    const map = d3.rollup(displayData, (v) => v.length, (d) => d.fitnessLevel);
    return order.map((k) => ({ key: k, value: map.get(k) ?? 0 })).filter((d) => d.value > 0);
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 360;
    const radius = Math.min(width, height) / 2 - 6;

    const svg = d3.select(ref.current).attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const color = d3.scaleOrdinal<string, string>()
      .domain(parts.map((d) => d.key))
      .range(['#93c5fd', '#86efac', '#67e8f9', '#fca5a5', '#fde047']);

    const pie = d3.pie<any>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(0).outerRadius(radius);

    const g = svg.append('g');
    const paths = g.selectAll('path').data(pie(parts)).join('path')
      .attr('fill', (d) => color(d.data.key))
      .attr('d', (d) => arc({ ...d, endAngle: d.startAngle }) as string)
      .attr('opacity', 0.9)
      .transition().duration(800)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return (t) => arc({ ...d, endAngle: i(t) } as any) as string;
      });

    const labelArc = d3.arc().innerRadius(radius * 0.7).outerRadius(radius * 0.7);
    const labels = g.selectAll('text').data(pie(parts)).join('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-[10px] fill-gray-800')
      .text((d) => d.data.key);

    g.selectAll('path')
      .on('mouseenter', function () { d3.select(this).attr('opacity', 1); })
      .on('mouseleave', function () { d3.select(this).attr('opacity', 0.9); });

    // Center callout updates on hover
    const total = d3.sum(parts, (d) => d.value) || 1;
    const center = svg.append('g').attr('transform', 'translate(0,0)');
    const centerBg = center.append('circle').attr('r', 24).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const centerText = center.append('text').attr('class', 'text-[11px] fill-gray-800 font-medium').attr('text-anchor', 'middle').attr('y', 4).text('Fitness');

    g.selectAll('path')
      .on('mousemove', function (_event, d: any) {
        const pct = Math.round((d.data.value / total) * 100);
        centerText.text(`${d.data.key} ${pct}%`);
      })
      .on('mouseleave', function () {
        centerText.text('Fitness');
      });
  }, [parts, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


