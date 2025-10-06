"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type Props = { height?: number };

// Replaces the scatter with an aggregated heatmap: Income Level × Spending Band
export default function IncomeSpendingHeatmap({ height = 240 }: Props) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const { matrix, incomeLevels, spendBands, maxVal } = useMemo(() => {
    const incomeLevels = ['Low', 'Medium', 'High'] as const;
    const priceMap: Record<string, number> = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };
    // Derive numeric "spending index" similar to the previous scatter logic
    const spendingIndex = (d: any) => Math.min(100, d.digitalEngagementScore + (priceMap[d.priceSensitivity] || 2) * 5);
    const band = (v: number) => (v < 40 ? 'Low' : v < 70 ? 'Medium' : 'High');
    const spendBands = ['Low', 'Medium', 'High'] as const;

    const map = new Map<string, Record<(typeof spendBands)[number], number>>();
    for (const inc of incomeLevels) map.set(inc, { Low: 0, Medium: 0, High: 0 });
    for (const row of displayData) {
      const inc = row.incomeLevel as (typeof incomeLevels)[number];
      const sb = band(spendingIndex(row)) as (typeof spendBands)[number];
      map.get(inc)![sb] += 1;
    }
    const matrix = incomeLevels.flatMap((inc, i) =>
      spendBands.map((sb, j) => ({ inc, sb, i, j, value: map.get(inc)![sb] }))
    );
    const maxVal = d3.max(matrix, (m) => m.value) ?? 1;
    return { matrix, incomeLevels: incomeLevels as unknown as string[], spendBands: spendBands as unknown as string[], maxVal };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 28, right: 10, bottom: 28, left: 80 };
    const width = ref.current.clientWidth || 500;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(spendBands).range([0, innerW]).padding(0.1);
    const y = d3.scaleBand().domain(incomeLevels).range([0, innerH]).padding(0.1);
    const color = d3.scaleSequential(d3.interpolateViridis).domain([0, maxVal]);

    g.selectAll('rect')
      .data(matrix)
      .join('rect')
      .attr('x', (d: any) => x(d.sb) as number)
      .attr('y', (d: any) => y(d.inc) as number)
      .attr('rx', 6)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', (d: any) => color(d.value))
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    // Labels
    g.selectAll('text.val')
      .data(matrix)
      .join('text')
      .attr('class', 'val text-[10px] fill-gray-800')
      .attr('x', (d: any) => (x(d.sb) as number) + x.bandwidth() / 2)
      .attr('y', (d: any) => (y(d.inc) as number) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.value);

    // Tooltip
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    const show = function (event: any, d: any) {
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`Spending: ${d.sb}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Income: ${d.inc}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${d.value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event);
        tip.attr('transform', `translate(${Math.min(innerW - (bbox.width + 20), mx + 8)},${Math.max(12, my - 10)})`);
    } as any;
    g.selectAll('rect')
      .on('pointerenter', function () { d3.select(this).attr('stroke', 'var(--color-primary)').attr('stroke-width', 1.5); tip.style('display', null); })
      .on('pointerleave', function () { d3.select(this).attr('stroke', 'none'); tip.style('display', 'none'); })
      .on('pointermove', show)
      .on('touchstart', show)
      .on('touchmove', show);

    // Axes labels
    g.append('g').attr('transform', `translate(0,${-8})`).selectAll('text').data(spendBands).join('text')
      .attr('class', 'text-xs fill-gray-600').attr('x', (d) => (x(d) as number) + x.bandwidth() / 2).attr('y', 0).attr('text-anchor', 'middle').text((d) => d);
    g.append('g').selectAll('text').data(incomeLevels).join('text')
      .attr('class', 'text-xs fill-gray-600').attr('x', -10).attr('y', (d) => (y(d) as number) + y.bandwidth() / 2 + 3).attr('text-anchor', 'end').text((d) => d);
  }, [matrix, incomeLevels, spendBands, maxVal, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


