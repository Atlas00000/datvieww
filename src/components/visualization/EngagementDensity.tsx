"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type EngagementDensityProps = { height?: number };

export default function EngagementDensity({ height = 220 }: EngagementDensityProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const scores = useMemo(() => displayData.map((d) => d.digitalEngagementScore), [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 32 };
    const width = ref.current.clientWidth || 500;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]).nice();

    // Kernel density estimate
    const kdeX = d3.range(0, 100.01, 1);
    const kernel = (u: number) => (Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0);
    const bandwidth = 6;
    const density = kdeX.map((x0) => {
      const sum = scores.reduce((acc, v) => acc + kernel((x0 - v) / bandwidth), 0);
      return { x: x0, y: sum / (scores.length * bandwidth) };
    });
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(density, (d) => d.y) ?? 1])
      .nice()
      .range([innerH, 0]);

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveCatmullRom.alpha(0.6));

    const path = g.append('path')
      .datum(density)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-width', 2)
      .attr('d', line as any)
      .attr('stroke-dasharray', function () {
        const len = (this as SVGPathElement).getTotalLength();
        return `${len} ${len}`;
      })
      .attr('stroke-dashoffset', function () {
        const len = (this as SVGPathElement).getTotalLength();
        return String(len);
      })
      .transition()
      .duration(900)
      .attr('stroke-dashoffset', 0);

    const xAxis = d3.axisBottom(x).ticks(6).tickSizeOuter(0);
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

    // Hover tracker along density curve
    const tracker = g.append('circle').attr('r', 4).attr('fill', 'var(--color-primary)').style('display', 'none');
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');
    g.append('rect').attr('x', 0).attr('y', 0).attr('width', innerW).attr('height', innerH).attr('fill', 'transparent')
      .on('mouseenter', () => { tracker.style('display', null); tip.style('display', null); })
      .on('mouseleave', () => { tracker.style('display', 'none'); tip.style('display', 'none'); })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const xVal = Math.max(0, Math.min(100, x.invert(mx)));
        // Find nearest density sample
        const idx = d3.bisector((d: any) => d.x).center(density as any, xVal);
        const d = (density as any)[idx];
        const px = x(d.x); const py = y(d.y);
        tracker.attr('cx', px).attr('cy', py);
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`Score: ${Math.round(d.x)}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Density: ${d.y.toFixed(3)}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        tip.attr('transform', `translate(${Math.min(innerW - (bbox.width + 20), px + 8)},${Math.max(12, py - 10)})`);
      });
  }, [scores, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


