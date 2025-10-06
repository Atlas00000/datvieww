"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type Props = { height?: number };

// Stacked bars: Risk Tolerance by Income Level
export default function RiskToleranceStacked({ height = 260 }: Props) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const dataset = useMemo(() => {
    const incomes = ['Low', 'Medium', 'High'] as const;
    const risks = ['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'] as const;
    const rows = incomes.map((inc) => {
      const row: any = { income: inc };
      for (const r of risks) row[r] = 0;
      return row;
    });
    const idx = new Map(incomes.map((i, k) => [i, k]));
    for (const d of displayData) {
      const r = rows[idx.get(d.incomeLevel as any)!];
      r[d.riskTolerance as any] += 1;
    }
    return { rows, incomes: incomes as unknown as string[], risks: risks as unknown as string[] };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 20, right: 10, bottom: 32, left: 40 };
    const width = ref.current.clientWidth || 500;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(dataset.incomes).range([0, innerW]).padding(0.2);
    const stackGen = d3.stack().keys(dataset.risks as any);
    const series = stackGen(dataset.rows as any);
    const y = d3.scaleLinear().domain([0, d3.max(dataset.rows, (r: any) => d3.sum(dataset.risks, (k: any) => r[k])) || 1]).nice().range([innerH, 0]);
    const color = d3.scaleOrdinal<string>().domain(dataset.risks).range(['#E5E7EB', '#93C5FD', '#34D399', '#FDE68A']);

    const groups = g.selectAll('g.layer').data(series).join('g').attr('class', 'layer').attr('fill', (d: any) => color(d.key) as string);
    groups.selectAll('rect')
      .data((d: any) => d)
      .join('rect')
      .attr('x', (d: any, i: number) => x(dataset.incomes[i]) as number)
      .attr('y', (d: any) => y(d[1]))
      .attr('height', (d: any) => Math.max(0, y(d[0]) - y(d[1])))
      .attr('width', x.bandwidth())
      .attr('rx', 6)
      .attr('opacity', 0)
      .transition().duration(700).attr('opacity', 1);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(4).tickSize(-innerW).tickSizeOuter(0);
    g.append('g').attr('transform', `translate(0,${innerH})`).call(xAxis as any).call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'));
    g.append('g').call(yAxis as any).call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600')).call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'));

    // Tooltip
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    const show = function (event: any, d: any) {
        const [y0, y1] = d;
        const i = (d as any).data.income;
        const key = (d as any).dataKey || (this.parentNode as any).__data__.key;
        const count = Math.round(y1 - y0);
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${key}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`${i}: ${count}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event);
        tip.attr('transform', `translate(${Math.min(innerW - (bbox.width + 20), mx + 8)},${Math.max(12, my - 10)})`);
    } as any;
    groups.selectAll('rect')
      .on('pointerenter', function () { d3.select(this).attr('stroke', 'var(--color-primary)').attr('stroke-width', 1.2); tip.style('display', null); })
      .on('pointerleave', function () { d3.select(this).attr('stroke', 'none'); tip.style('display', 'none'); })
      .on('pointermove', show)
      .on('touchstart', show)
      .on('touchmove', show);

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 110},${12})`);
    dataset.risks.forEach((r, idx) => {
      const row = legend.append('g').attr('transform', `translate(0,${idx * 16})`);
      row.append('rect').attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', color(r) as string);
      row.append('text').attr('x', 16).attr('y', 9).attr('class', 'text-[11px] fill-gray-700').text(r);
    });
  }, [dataset, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


