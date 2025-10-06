"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type GenderPieProps = {
  donut?: boolean;
  height?: number;
};

export default function GenderPie({ donut = false, height = 160 }: GenderPieProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const counts = useMemo(() => {
    const map = d3.rollup(
      displayData,
      (v) => v.length,
      (d) => d.gender
    );
    return Array.from(map, ([key, value]) => ({ key, value }));
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 320;
    const radius = Math.min(width, height) / 2 - 4;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(counts.map((d) => String(d.key)))
      .range([
        'var(--color-primary)',
        'var(--color-secondary)',
        'var(--color-info)',
        'var(--color-accent)',
      ]);

    const pie = d3.pie<{ key: string | unknown; value: number }>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<{ key: string | unknown; value: number }>>()
      .innerRadius(donut ? radius * 0.6 : 0)
      .outerRadius(radius);

    const g = svg.append('g');

    const arcs = g.selectAll('path')
      .data(pie(counts))
      .join('path')
      .attr('fill', (d) => color(String(d.data.key)))
      .attr('d', (d) => arc({ ...d, endAngle: d.startAngle }) as string)
      .attr('opacity', 0.9)
      .transition()
      .duration(900)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          const current = { ...d, endAngle: i(t) } as any;
          return arc(current) as string;
        };
      });

    // Labels
    const labelArc = d3.arc<d3.PieArcDatum<any>>().innerRadius(radius * 0.72).outerRadius(radius * 0.72);
    const labels = g.selectAll('text')
      .data(pie(counts))
      .join('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d as any)})`)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs fill-gray-700')
      .text((d) => `${String(d.data.key)} (${d.data.value})`)
      .attr('opacity', 0)
      .transition()
      .delay(400)
      .duration(500)
      .attr('opacity', 1);

    // Emphasis and tooltip
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    g.selectAll('path')
      .on('mouseenter', function (_event, d: any) {
        d3.select(this).attr('opacity', 1);
        tip.style('display', null);
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${d.data.key}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${d.data.value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 12).attr('height', bbox.height + 10).attr('x', -6).attr('y', -bbox.height);
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svg.node() as any);
        tip.attr('transform', `translate(${mx},${my})`);
      })
      .on('mouseleave', function () { d3.select(this).attr('opacity', 0.9); tip.style('display', 'none'); });
  }, [counts, donut, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


