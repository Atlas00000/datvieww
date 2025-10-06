"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type SleepStressHeatmapProps = { height?: number };

export default function SleepStressHeatmap({ height = 220 }: SleepStressHeatmapProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const grid = useMemo(() => {
    const cats = ['Poor', 'Fair', 'Good', 'Excellent'];
    const stress = ['Low', 'Medium', 'High', 'Very High'];
    const map = new Map<string, number>();
    for (const s of stress) for (const q of cats) map.set(`${q}|${s}`, 0);
    for (const d of displayData) {
      const key = `${d.sleepQuality}|${d.stressLevel}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    }
    const cells: { x: string; y: string; v: number }[] = [];
    for (const s of stress) for (const q of cats) cells.push({ x: q, y: s, v: map.get(`${q}|${s}`) || 0 });
    const maxV = d3.max(cells, (c) => c.v) ?? 1;
    return { cells, xCats: cats, yCats: stress, maxV };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 28, right: 10, bottom: 28, left: 70 };
    const width = ref.current.clientWidth || 500;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(grid.xCats).range([0, innerW]).padding(0.1);
    const y = d3.scaleBand().domain(grid.yCats).range([0, innerH]).padding(0.1);
    const color = d3.scaleSequential(d3.interpolateGreens).domain([0, grid.maxV]);

    const cells = g.selectAll('rect').data(grid.cells).join('rect')
      .attr('x', (d) => x(d.x) as number)
      .attr('y', (d) => y(d.y) as number)
      .attr('width', x.bandwidth()).attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', (d) => color(d.v))
      .attr('opacity', 0)
      .transition().duration(700)
      .attr('opacity', 1);

    g.selectAll('text.val').data(grid.cells).join('text')
      .attr('class', 'val text-[10px] fill-gray-800')
      .attr('x', (d) => (x(d.x) as number) + x.bandwidth() / 2)
      .attr('y', (d) => (y(d.y) as number) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'middle')
      .text((d) => d.v);

    g.append('g').attr('transform', `translate(0,${-8})`).selectAll('text')
      .data(grid.xCats).join('text')
      .attr('class', 'text-xs fill-gray-600')
      .attr('x', (d) => (x(d) as number) + x.bandwidth() / 2)
      .attr('y', 0).attr('text-anchor', 'middle').text((d) => d);

    g.append('g').selectAll('text').data(grid.yCats).join('text')
      .attr('class', 'text-xs fill-gray-600')
      .attr('x', -10).attr('y', (d) => (y(d) as number) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'end').text((d) => d);

    // Hover outline + tooltip
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    g.selectAll('rect')
      .on('mouseenter', function () { d3.select(this).attr('stroke', 'var(--color-primary)').attr('stroke-width', 1.5); tip.style('display', null); })
      .on('mouseleave', function () { d3.select(this).attr('stroke', 'none'); tip.style('display', 'none'); })
      .on('mousemove', function (event, d: any) {
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${d.x} × ${d.y}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${d.v}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event);
        tip.attr('transform', `translate(${Math.min(innerW - (bbox.width + 20), mx + 8)},${Math.max(12, my - 10)})`);
      });
  }, [grid, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


