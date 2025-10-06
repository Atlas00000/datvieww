"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type SocialScatterProps = { height?: number };

export default function SocialScatter({ height = 200 }: SocialScatterProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const points = useMemo(() => {
    // Use ecommerceFrequency as proxy for digital activity cadence
    const freqMap: Record<'Rare' | 'Occasional' | 'Frequent' | 'Daily', number> = {
      Rare: 1, Occasional: 2, Frequent: 3, Daily: 4,
    };
    return displayData.map((d) => ({
      x: d.digitalEngagementScore,
      y: freqMap[d.ecommerceFrequency as 'Rare' | 'Occasional' | 'Frequent' | 'Daily'] ?? 2,
      label: d.id,
    }));
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 32 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]).nice();
    const y = d3.scaleLinear().domain([0.5, 4.5]).range([innerH, 0]).nice();

    // Points
    const dots = g.append('g')
      .selectAll('circle')
      .data(points)
      .join('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', innerH)
      .attr('r', 0)
      .attr('fill', 'var(--color-primary)')
      .attr('fill-opacity', 0.5)
      .transition()
      .duration(700)
      .attr('cy', (d) => y(d.y))
      .attr('r', 4.5)
      .selection();

    const xAxis = d3.axisBottom(x).ticks(5).tickSizeOuter(0);
    const yAxis = d3
      .axisLeft(y)
      .ticks(4)
      .tickFormat((v) => (v === 1 ? 'Rare' : v === 2 ? 'Occasional' : v === 3 ? 'Frequent' : 'Daily') as any)
      .tickSize(-innerW)
      .tickSizeOuter(0);

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

    // Crosshair + tooltip
    const vx = g.append('line').attr('y1', 0).attr('y2', innerH).attr('stroke', 'var(--color-primary)').attr('stroke-opacity', 0.25).attr('stroke-dasharray', '4,4').style('display', 'none');
    const vy = g.append('line').attr('x1', 0).attr('x2', innerW).attr('stroke', 'var(--color-primary)').attr('stroke-opacity', 0.25).attr('stroke-dasharray', '4,4').style('display', 'none');
    const focus = g.append('circle').attr('r', 6).attr('fill', 'none').attr('stroke', 'var(--color-primary)').attr('stroke-width', 2).style('display', 'none');
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');

    g.append('rect').attr('x', 0).attr('y', 0).attr('width', innerW).attr('height', innerH).attr('fill', 'transparent')
      .on('mouseenter', () => { vx.style('display', null); vy.style('display', null); focus.style('display', null); tip.style('display', null); })
      .on('mouseleave', () => { vx.style('display', 'none'); vy.style('display', 'none'); focus.style('display', 'none'); tip.style('display', 'none'); })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event);
        // find nearest point
        let best: any = null;
        for (const p of points) {
          const px = x(p.x); const py = y(p.y);
          const d2 = (px - mx) * (px - mx) + (py - my) * (py - my);
          if (!best || d2 < best.d2) best = { px, py, p, d2 };
        }
        if (!best) return;
        vx.attr('x1', best.px).attr('x2', best.px);
        vy.attr('y1', best.py).attr('y2', best.py);
        focus.attr('cx', best.px).attr('cy', best.py);
        tipText.selectAll('tspan').remove();
        const usageLabel = best.p.y === 1 ? 'Rare' : best.p.y === 2 ? 'Occasional' : best.p.y === 3 ? 'Frequent' : 'Daily';
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`Engagement: ${Math.round(best.p.x)}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Usage: ${usageLabel}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const tx = Math.min(innerW - (bbox.width + 20), best.px + 10);
        const ty = Math.max(12, best.py - 10);
        tip.attr('transform', `translate(${tx},${ty})`);
      });
  }, [points, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


