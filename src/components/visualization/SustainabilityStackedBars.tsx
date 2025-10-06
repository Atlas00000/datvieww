"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type SustainabilityStackedBarsProps = { height?: number };

export default function SustainabilityStackedBars({ height = 200 }: SustainabilityStackedBarsProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const data = useMemo(() => {
    const regions = Array.from(new Set(displayData.map((d) => d.region)));
    const levels = ['Low', 'Medium', 'High', 'Very High'] as const;
    const counts = d3.rollup(
      displayData,
      (v) => {
        const bucket: Record<(typeof levels)[number], number> = { Low: 0, Medium: 0, High: 0, 'Very High': 0 };
        for (const r of v) bucket[r.environmentalConsciousness as (typeof levels)[number]] += 1;
        return bucket;
      },
      (d) => d.region
    );
    const rows = regions.map((r) => ({ region: r, ...(counts.get(r) || { Low: 0, Medium: 0, High: 0, 'Very High': 0 }) }));
    return { rows, keys: levels as unknown as string[] };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 10, right: 10, bottom: 28, left: 36 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.rows.map((d) => d.region)).range([0, innerW]).padding(0.2);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.rows, (d) => (d.Low as number) + (d.Medium as number) + (d.High as number) + (d['Very High'] as number)) ?? 1])
      .nice()
      .range([innerH, 0]);

    const color = d3.scaleOrdinal<string, string>()
      .domain(data.keys)
      .range(['#93c5fd', '#86efac', '#67e8f9', '#fca5a5']);

    const stacked = d3.stack<any>().keys(data.keys)(data.rows as any);

    const barsG = g.append('g')
      .selectAll('g')
      .data(stacked)
      .join('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (d: any) => x(d.data.region) as number)
      .attr('y', innerH)
      .attr('height', 0)
      .attr('width', x.bandwidth())
      .attr('rx', 6)
      .transition()
      .duration(900)
      .attr('y', (d: any) => y(d[1]))
      .attr('height', (d: any) => y(d[0]) - y(d[1]));

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(3).tickSize(-innerW).tickSizeOuter(0);
    g.append('g').attr('transform', `translate(0,${innerH})`).call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'));
    g.append('g').call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'));

    // Crosshair + tooltip
    const cx = g.append('line')
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');

    const centers = data.rows.map((d) => (x(d.region) as number) + x.bandwidth() / 2);

    const overlay = g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', innerW).attr('height', innerH)
      .attr('fill', 'transparent')
      .on('mouseenter', () => { cx.style('display', null); tip.style('display', null); })
      .on('mouseleave', () => { cx.style('display', 'none'); tip.style('display', 'none'); })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        // find nearest band center
        const idx = d3.bisectCenter(centers, mx);
        const region = data.rows[idx]?.region;
        if (!region) return;
        const cxPos = (x(region) as number) + x.bandwidth() / 2;
        cx.attr('x1', cxPos).attr('x2', cxPos);
        // compose stacked summary for region
        const r = data.rows[idx] as any;
        const text = `Region: ${region}\nLow: ${r.Low}  Medium: ${r.Medium}\nHigh: ${r.High}  Very High: ${r['Very High']}`;
        tipText.selectAll('tspan').remove();
        text.split('\n').forEach((line, i) => {
          tipText.append('tspan').attr('x', 0).attr('dy', i === 0 ? 0 : 12).text(line);
        });
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const tx = Math.min(innerW - (bbox.width + 20), cxPos + 8);
        const ty = 12;
        tip.attr('transform', `translate(${tx},${ty})`);
      });
  }, [data, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


