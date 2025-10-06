"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type DeviceRegionHeatmapProps = { height?: number };

export default function DeviceRegionHeatmap({ height = 220 }: DeviceRegionHeatmapProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const { matrix, regions, devices, maxVal } = useMemo(() => {
    const regions = Array.from(new Set(displayData.map((d) => d.region)));
    const devices = ['Desktop', 'Mobile', 'Tablet'] as const;
    const map = new Map<string, Record<(typeof devices)[number], number>>();
    for (const r of regions) map.set(r, { Desktop: 0, Mobile: 0, Tablet: 0 });
    for (const row of displayData) {
      const r = row.region;
      const dev = row.primaryDevice as (typeof devices)[number];
      map.get(r)![dev] += 1;
    }
    const matrix = regions.flatMap((r, i) =>
      devices.map((d, j) => ({ r, d, i, j, value: map.get(r)![d] }))
    );
    const maxVal = d3.max(matrix, (m) => m.value) ?? 1;
    return { matrix, regions, devices: devices as unknown as string[], maxVal };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 28, right: 10, bottom: 28, left: 80 };
    const width = ref.current.clientWidth || 500;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(devices).range([0, innerW]).padding(0.1);
    const y = d3.scaleBand().domain(regions).range([0, innerH]).padding(0.1);
    const color = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, maxVal]);

    const cells = g
      .selectAll('rect')
      .data(matrix)
      .join('rect')
      .attr('x', (d: any) => x(d.d) as number)
      .attr('y', (d: any) => y(d.r) as number)
      .attr('rx', 6)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', (d: any) => color(d.value))
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    // Value labels
    g.selectAll('text.val')
      .data(matrix)
      .join('text')
      .attr('class', 'val text-[10px] fill-gray-800')
      .attr('x', (d: any) => (x(d.d) as number) + x.bandwidth() / 2)
      .attr('y', (d: any) => (y(d.r) as number) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.value);

    // Hover outline + tooltip
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    g.selectAll('rect')
      .on('mouseenter', function () { d3.select(this).attr('stroke', 'var(--color-primary)').attr('stroke-width', 1.5); tip.style('display', null); })
      .on('mouseleave', function () { d3.select(this).attr('stroke', 'none'); tip.style('display', 'none'); })
      .on('mousemove', function (event, d: any) {
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${d.d} × ${d.r}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${d.value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event);
        tip.attr('transform', `translate(${Math.min(innerW - (bbox.width + 20), mx + 8)},${Math.max(12, my - 10)})`);
      });

    // Axes labels
    g.append('g')
      .attr('transform', `translate(0,${-8})`)
      .selectAll('text')
      .data(devices)
      .join('text')
      .attr('class', 'text-xs fill-gray-600')
      .attr('x', (d) => (x(d) as number) + x.bandwidth() / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .text((d) => d);

    g.append('g')
      .selectAll('text')
      .data(regions)
      .join('text')
      .attr('class', 'text-xs fill-gray-600')
      .attr('x', -10)
      .attr('y', (d) => (y(d) as number) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'end')
      .text((d) => d);
  }, [matrix, regions, devices, maxVal, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


