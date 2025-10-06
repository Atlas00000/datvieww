"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type WellnessTrendProps = { height?: number };

export default function WellnessTrend({ height = 220 }: WellnessTrendProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const series = useMemo(() => {
    // Approximate a wellness score: (healthStatus ordinal + sleep + inverse stress + fitness level index)
    const hsMap: Record<string, number> = { Poor: 1, Fair: 2, Good: 3, Excellent: 4 };
    const fitMap: Record<string, number> = { Sedentary: 1, Light: 2, Moderate: 3, Active: 4, 'Very Active': 5 };
    const stressMap: Record<string, number> = { 'Very High': 1, High: 2, Medium: 3, Low: 4 };
    const sleepMap: Record<string, number> = { Poor: 1, Fair: 2, Good: 3, Excellent: 4 };

    const bins = [18, 26, 36, 46, 56, 66];
    const bucket = (age: number) => bins.findIndex((b) => age < b);
    const grouped = d3.group(displayData, (d) => bucket(d.age));
    const points = Array.from(grouped, ([key, rows]) => {
      const score = d3.mean(rows, (r) => r.wellnessScore) || 0;
      const label = key === 0 ? '18-25' : key === 1 ? '26-35' : key === 2 ? '36-45' : key === 3 ? '46-55' : key === 4 ? '56-65' : '65+';
      return { x: label, y: score };
    });
    return points;
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 36 };
    const width = ref.current.clientWidth || 560;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().domain(series.map((d) => d.x)).range([0, innerW]).padding(0.5);
    const y = d3.scaleLinear().domain([0.5, 4.5]).nice().range([innerH, 0]);

    const area = d3
      .area<{ x: string; y: number }>()
      .x((d) => x(d.x) as number)
      .y0(() => innerH)
      .y1((d) => y(d.y))
      .curve(d3.curveCatmullRom.alpha(0.6));
    const line = d3
      .line<{ x: string; y: number }>()
      .x((d) => x(d.x) as number)
      .y((d) => y(d.y))
      .curve(d3.curveCatmullRom.alpha(0.6));

    g.append('path').datum(series).attr('fill', 'var(--color-primary)').attr('fill-opacity', 0.15).attr('d', area as any);
    g.append('path').datum(series).attr('stroke', 'var(--color-primary)').attr('stroke-width', 2).attr('fill', 'none').attr('d', line as any);

    const dots = g.selectAll('circle').data(series).join('circle')
      .attr('cx', (d) => x(d.x) as number)
      .attr('cy', innerH)
      .attr('r', 0)
      .attr('fill', 'var(--color-primary)')
      .transition().duration(600)
      .attr('cy', (d) => y(d.y))
      .attr('r', 4);

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(4).tickSize(-innerW).tickSizeOuter(0)
      .tickFormat((v) => (v === 1 ? 'Poor' : v === 2 ? 'Fair' : v === 3 ? 'Good' : 'Excellent') as any);

    g.append('g').attr('transform', `translate(0,${innerH})`).call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'));
    g.append('g').call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'));

    // Crosshair + value tooltip
    const vx = g.append('line').attr('y1', 0).attr('y2', innerH).attr('stroke', 'var(--color-primary)').attr('stroke-opacity', 0.25).attr('stroke-dasharray', '4,4').style('display', 'none');
    const vy = g.append('line').attr('x1', 0).attr('x2', innerW).attr('stroke', 'var(--color-primary)').attr('stroke-opacity', 0.25).attr('stroke-dasharray', '4,4').style('display', 'none');
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    const centers = series.map((d) => x(d.x) as number);
    g.append('rect').attr('x', 0).attr('y', 0).attr('width', innerW).attr('height', innerH).attr('fill', 'transparent')
      .on('mouseenter', () => { vx.style('display', null); vy.style('display', null); tip.style('display', null); })
      .on('mouseleave', () => { vx.style('display', 'none'); vy.style('display', 'none'); tip.style('display', 'none'); })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event);
        const idx = d3.bisectCenter(centers, mx);
        const d = series[idx]; if (!d) return;
        const px = x(d.x) as number; const py = y(d.y);
        vx.attr('x1', px).attr('x2', px); vy.attr('y1', py).attr('y2', py);
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${d.x}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Score: ${d.y.toFixed(2)}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const tx = Math.min(innerW - (bbox.width + 20), px + 10);
        const ty = Math.max(12, py - 10);
        tip.attr('transform', `translate(${tx},${ty})`);
      });
  }, [series, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


