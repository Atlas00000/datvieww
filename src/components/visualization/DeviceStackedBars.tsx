"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type DeviceStackedBarsProps = { height?: number };

export default function DeviceStackedBars({ height = 200 }: DeviceStackedBarsProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[] | null>(null);

  const data = useMemo(() => {
    // Group by region and count primaryDevice categories for stacked bars
    const regions = Array.from(new Set(displayData.map((d) => d.region)));
    const devices = ['Desktop', 'Mobile', 'Tablet'] as const;
    const counts = d3.rollup(
      displayData,
      (v) => {
        const init: Record<(typeof devices)[number], number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
        for (const r of v) init[r.device as (typeof devices)[number]] += 1;
        return init;
      },
      (d) => d.region
    );
    const rows = regions.map((r) => ({ region: r, ...(counts.get(r) || { Desktop: 0, Mobile: 0, Tablet: 0 }) }));
    return { rows, keys: devices as unknown as string[] };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 10, right: 10, bottom: 28, left: 36 };
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
      .domain(data.rows.map((d) => d.region))
      .range([0, innerW])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.rows, (d) => (d.Desktop as number) + (d.Mobile as number) + (d.Tablet as number)) ?? 1])
      .nice()
      .range([innerH, 0]);

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(data.keys)
      .range(['var(--color-primary)', 'var(--color-secondary)', 'var(--color-info)']);

    const keys = activeKeys ?? data.keys;
    const stacked = d3.stack<any>().keys(keys)(data.rows as any);

    const segments = g.append('g')
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

    // Tooltip per segment
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    g.selectAll('rect')
      .on('mouseenter', () => tip.style('display', null))
      .on('mouseleave', () => tip.style('display', 'none'))
      .on('mousemove', function (event: any, d: any) {
        const region = d.data.region;
        const value = Math.round(d[1] - d[0]);
        // find series key by fill color context (approx by y range label)
        let seriesLabel = '';
        // parent node holds datum for stack series; retrieve if available
        const parent: any = (this as any).parentNode.__data__;
        seriesLabel = parent?.key || '';
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${seriesLabel}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`${region}: ${value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event);
        const tx = Math.min(innerW - (bbox.width + 20), mx + 10);
        const ty = Math.max(12, my - 10);
        tip.attr('transform', `translate(${tx},${ty})`);
      });

    // Legend toggles
    const legend = svg.append('g').attr('transform', `translate(${margin.left},${height - 8})`);
    const items = legend
      .selectAll('g')
      .data(data.keys)
      .join('g')
      .attr('transform', (_d, i) => `translate(${i * 120},-4)`) // simple layout
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        setActiveKeys((prev) => {
          const current = prev ?? data.keys;
          return current.includes(d) ? current.filter((k) => k !== d) : [...current, d];
        });
      });
    items
      .append('rect')
      .attr('width', 14)
      .attr('height', 14)
      .attr('rx', 3)
      .attr('fill', (d) => color(d))
      .attr('fill-opacity', (d) => (keys.includes(d) ? 0.9 : 0.2))
      .attr('stroke', '#e5e7eb');
    items
      .append('text')
      .attr('x', 20)
      .attr('y', 11)
      .attr('class', 'text-xs fill-gray-700')
      .text((d) => d);
  }, [data, height, activeKeys]);

  return <svg ref={ref} className="w-full" height={height} />;
}


