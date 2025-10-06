"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type EcomBoxPlotProps = { height?: number };

export default function EcomBoxPlot({ height = 220 }: EcomBoxPlotProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const grouped = useMemo(() => {
    const order = ['Rare', 'Occasional', 'Frequent', 'Daily'] as const;
    const map = d3.group(displayData, (d) => d.ecommerceFrequency);
    const stats = order.map((k) => {
      const vals = (map.get(k) || []).map((d) => d.digitalEngagementScore).sort(d3.ascending);
      if (vals.length === 0) return { key: k, q1: 0, q2: 0, q3: 0, min: 0, max: 0 };
      const q1 = d3.quantile(vals, 0.25)!;
      const q2 = d3.quantile(vals, 0.5)!;
      const q3 = d3.quantile(vals, 0.75)!;
      const min = vals[0];
      const max = vals[vals.length - 1];
      return { key: k, q1, q2, q3, min, max };
    });
    return stats;
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 32, left: 36 };
    const width = ref.current.clientWidth || 560;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(grouped.map((d) => d.key)).range([0, innerW]).padding(0.3);
    const y = d3.scaleLinear().domain([0, 100]).nice().range([innerH, 0]);

    // Boxes
    const box = g
      .append('g')
      .selectAll('g')
      .data(grouped)
      .join('g')
      .attr('transform', (d) => `translate(${x(d.key)},0)`);

    box
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => y(d.q3))
      .attr('width', x.bandwidth())
      .attr('height', (d) => Math.max(0, y(d.q1) - y(d.q3)))
      .attr('rx', 6)
      .attr('fill', 'var(--color-primary)')
      .attr('fill-opacity', 0.2)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.5);

    // Medians
    box
      .append('line')
      .attr('x1', 0)
      .attr('x2', x.bandwidth())
      .attr('y1', (d) => y(d.q2))
      .attr('y2', (d) => y(d.q2))
      .attr('stroke', 'var(--color-secondary)')
      .attr('stroke-width', 2);

    // Whiskers
    box
      .append('line')
      .attr('x1', x.bandwidth() / 2)
      .attr('x2', x.bandwidth() / 2)
      .attr('y1', (d) => y(d.min))
      .attr('y2', (d) => y(d.max))
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.6);

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(4).tickSize(-innerW).tickSizeOuter(0);

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

    // Hover tooltip (quartiles)
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    g.selectAll('rect')
      .on('mouseenter', () => tip.style('display', null))
      .on('mouseleave', () => tip.style('display', 'none'))
      .on('mousemove', function (event, d: any) {
        // parent group holds datum with quartiles
        const parent: any = (this as any).parentNode.__data__;
        const label = parent?.key || '';
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${label}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Q1: ${Math.round(parent.q1)}  Median: ${Math.round(parent.q2)}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Q3: ${Math.round(parent.q3)}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event);
        tip.attr('transform', `translate(${Math.min(innerW - (bbox.width + 20), mx + 8)},${Math.max(12, my - 10)})`);
      });
  }, [grouped, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


