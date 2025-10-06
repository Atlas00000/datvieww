"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type FitnessBarProps = { height?: number };

export default function FitnessBar({ height = 200 }: FitnessBarProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const data = useMemo(() => {
    const order = ['Low', 'Medium', 'High'] as const;
    const map = d3.rollup(displayData, (v) => v.length, (d) => d.fitnessLevel);
    return order.map((k) => ({ key: k as string, value: map.get(k) ?? 0 }));
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 30, left: 36 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.map((d) => d.key)).range([0, innerW]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) ?? 1]).nice().range([innerH, 0]);

    const bars = g.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.key) as number)
      .attr('y', innerH)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 6)
      .attr('fill', 'var(--color-secondary)')
      .transition().duration(900)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => innerH - y(d.value));

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(3).tickSize(-innerW).tickSizeOuter(0);
    g.append('g').attr('transform', `translate(0,${innerH})`).call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'));
    g.append('g').call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'));

    // Crosshair + tooltip on bands
    const cx = g.append('line')
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');

    const centers = data.map((d) => (x(d.key) as number) + x.bandwidth() / 2);
    g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', innerW).attr('height', innerH)
      .attr('fill', 'transparent')
      .on('mouseenter', () => { cx.style('display', null); tip.style('display', null); })
      .on('mouseleave', () => { cx.style('display', 'none'); tip.style('display', 'none'); })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const idx = d3.bisectCenter(centers, mx);
        const row = data[idx]; if (!row) return;
        const cxPos = (x(row.key) as number) + x.bandwidth() / 2;
        cx.attr('x1', cxPos).attr('x2', cxPos);
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(row.key);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${row.value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const tx = Math.min(innerW - (bbox.width + 20), cxPos + 8);
        tip.attr('transform', `translate(${tx},12)`);
      });
  }, [data, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


