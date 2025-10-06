"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type IncomeSpendingScatterProps = { height?: number };

export default function IncomeSpendingScatter({ height = 220 }: IncomeSpendingScatterProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const points = useMemo(() => {
    // Map incomeLevel to numeric; synthesize spending from engagement + price sensitivity
    const incMap: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
    const priceMap: Record<string, number> = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };
    return displayData.map((d) => ({
      x: incMap[d.incomeLevel],
      y: Math.min(100, d.digitalEngagementScore + (priceMap[d.priceSensitivity] || 2) * 5),
      s: d.brandLoyalty, // bubble color by brand loyalty
    }));
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 32, left: 36 };
    const width = ref.current.clientWidth || 500;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0.5, 3.5]).range([0, innerW]);
    const y = d3.scaleLinear().domain([0, 100]).nice().range([innerH, 0]);
    const color = d3.scaleOrdinal<string, string>()
      .domain(['Low', 'Medium', 'High', 'Very High'])
      .range(['#93c5fd', '#86efac', '#67e8f9', '#fca5a5']);

    const dots = g.append('g').selectAll('circle').data(points).join('circle')
      .attr('cx', (d) => x(d.x)).attr('cy', innerH)
      .attr('r', 0)
      .attr('fill', (d) => color(d.s))
      .attr('fill-opacity', 0.55)
      .transition().duration(600)
      .attr('cy', (d) => y(d.y))
      .attr('r', 5)
      .selection();

    const xAxis = d3.axisBottom(x).tickFormat((v) => (v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High') as any).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(4).tickSize(-innerW).tickSizeOuter(0);
    g.append('g').attr('transform', `translate(0,${innerH})`).call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'));
    g.append('g').call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'));

    // Crosshair + tooltip + focus
    const vx = g.append('line').attr('y1', 0).attr('y2', innerH).attr('stroke', 'var(--color-primary)').attr('stroke-opacity', 0.25).attr('stroke-dasharray', '4,4').style('display', 'none');
    const vy = g.append('line').attr('x1', 0).attr('x2', innerW).attr('stroke', 'var(--color-primary)').attr('stroke-opacity', 0.25).attr('stroke-dasharray', '4,4').style('display', 'none');
    const focus = g.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'var(--color-primary)').attr('stroke-width', 2).style('display', 'none');
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');

    const overlay = g.append('rect').attr('x', 0).attr('y', 0).attr('width', innerW).attr('height', innerH).attr('fill', 'transparent')
      .on('mouseenter', () => { vx.style('display', null); vy.style('display', null); focus.style('display', null); tip.style('display', null); })
      .on('mouseleave', () => { vx.style('display', 'none'); vy.style('display', 'none'); focus.style('display', 'none'); tip.style('display', 'none'); })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event);
        // find nearest point
        let best = null as null | { px: number; py: number; p: { x: number; y: number; s: string } };
        for (const p of points) {
          const px = x(p.x);
          const py = y(p.y);
          const dx = px - mx; const dy = py - my;
          const dist = dx * dx + dy * dy;
          if (!best || dist < ((best as any).dist || Infinity)) best = { px, py, p } as any, (best as any).dist = dist;
        }
        if (!best) return;
        vx.attr('x1', best.px).attr('x2', best.px);
        vy.attr('y1', best.py).attr('y2', best.py);
        focus.attr('cx', best.px).attr('cy', best.py);
        // tip content
        tipText.selectAll('tspan').remove();
        const incLabel = best.p.x === 1 ? 'Low' : best.p.x === 2 ? 'Medium' : 'High';
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`Income: ${incLabel}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Spending: ${Math.round(best.p.y)}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Brand Loyalty: ${best.p.s}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const tx = Math.min(innerW - (bbox.width + 20), best.px + 10);
        const ty = Math.max(12, best.py - 10);
        tip.attr('transform', `translate(${tx},${ty})`);
      });
  }, [points, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


