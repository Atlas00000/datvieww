"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type EcommerceBarProps = { height?: number };

export default function EcommerceBar({ height = 200 }: EcommerceBarProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const data = useMemo(() => {
    const order = ['Never', 'Rarely', 'Monthly', 'Weekly', 'Daily'];
    const map = d3.rollup(
      displayData,
      (v) => v.length,
      (d) => d.ecommerceFrequency
    );
    return order.map((k) => ({ key: k, value: map.get(k) ?? 0 }));
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 32 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.key))
      .range([0, innerW])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 1])
      .nice()
      .range([innerH, 0]);

    const bars = g.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.key) as number)
      .attr('y', innerH)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 6)
      .attr('fill', 'var(--color-accent)')
      .transition()
      .duration(900)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => innerH - y(d.value));

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
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

    // Tooltip with percent share
    const total = d3.sum(data, (d) => d.value) || 1;
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    g.selectAll('rect.hover')
      .data([]);
    g.selectAll('rect.hit')
      .data(data)
      .join('rect')
      .attr('class', 'hit')
      .attr('x', (d) => x(d.key) as number)
      .attr('y', 0)
      .attr('width', x.bandwidth())
      .attr('height', innerH)
      .attr('fill', 'transparent')
      .on('mouseenter', () => tip.style('display', null))
      .on('mouseleave', () => tip.style('display', 'none'))
      .on('mousemove', function (event, d) {
        const val = d.value;
        const pct = Math.round((val / total) * 100);
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(d.key);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${val} (${pct}%)`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event);
        tip.attr('transform', `translate(${Math.min(innerW - (bbox.width + 20), mx + 8)},${Math.max(12, my - 10)})`);
      });
  }, [data, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


