"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type CausesHorizontalBarProps = { height?: number };

export default function CausesHorizontalBar({ height = 200 }: CausesHorizontalBarProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const data = useMemo(() => {
    // Use communityInvolvement as proxy for social causes support intensity per region
    const levels = ['Low', 'Medium', 'High', 'Very High'];
    const byLevel = d3.rollup(displayData, (v) => v.length, (d) => d.communityInvolvement);
    const rows = levels.map((k) => ({ key: k, value: byLevel.get(k) ?? 0 }));
    return rows.sort((a, b) => b.value - a.value);
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 100 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3.scaleBand().domain(data.map((d) => d.key)).range([0, innerH]).padding(0.25);
    const x = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) ?? 1]).nice().range([0, innerW]);

    const bars = g.append('g').selectAll('rect').data(data).join('rect')
      .attr('y', (d) => y(d.key) as number)
      .attr('x', 0).attr('height', y.bandwidth())
      .attr('width', 0).attr('rx', 8)
      .attr('fill', 'var(--color-info)')
      .transition().duration(900).attr('width', (d) => x(d.value));

    const xAxis = d3.axisBottom(x).ticks(3).tickSize(-innerH).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).tickSizeOuter(0);
    g.append('g').attr('transform', `translate(0,${innerH})`).call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'));
    g.append('g').call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-700'));

    // Hover tooltip and focus
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');

    g.selectAll('rect.focusable')
      .data([]);

    g.selectAll('rect.hit')
      .data(data)
      .join('rect')
      .attr('class', 'hit')
      .attr('x', 0)
      .attr('y', (d) => (y(d.key) as number))
      .attr('width', innerW)
      .attr('height', y.bandwidth())
      .attr('fill', 'transparent')
      .on('mouseenter', () => tip.style('display', null))
      .on('mouseleave', () => tip.style('display', 'none'))
      .on('mousemove', function (event, d) {
        const w = x(d.value);
        const yPos = (y(d.key) as number) + y.bandwidth() / 2;
        // Update tip text
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${d.key}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${d.value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const tx = Math.min(innerW - (bbox.width + 20), (w || 0) + 8);
        tip.attr('transform', `translate(${tx},${yPos - 6})`);
      });
  }, [data, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


