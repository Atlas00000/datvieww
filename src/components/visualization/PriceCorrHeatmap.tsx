"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type PriceCorrHeatmapProps = { height?: number };

export default function PriceCorrHeatmap({ height = 240 }: PriceCorrHeatmapProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const grid = useMemo(() => {
    const xCats = ['Low', 'Medium', 'High', 'Very High'];
    const yCats = ['Low', 'Medium', 'High', 'Very High'];
    const map = new Map<string, number>();
    for (const x of xCats) for (const y of yCats) map.set(`${x}|${y}`, 0);
    for (const d of displayData) {
      const key = `${d.priceSensitivity}|${d.brandLoyalty}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    }
    const cells: { x: string; y: string; v: number }[] = [];
    for (const x of xCats) for (const y of yCats) cells.push({ x, y, v: map.get(`${x}|${y}`) || 0 });
    const maxV = d3.max(cells, (c) => c.v) ?? 1;
    return { cells, xCats, yCats, maxV };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 28, right: 10, bottom: 28, left: 60 };
    const width = ref.current.clientWidth || 560;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(grid.xCats).range([0, innerW]).padding(0.1);
    const y = d3.scaleBand().domain(grid.yCats).range([0, innerH]).padding(0.1);
    const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, grid.maxV]);

    const cells = g.selectAll('rect')
      .data(grid.cells)
      .join('rect')
      .attr('x', (d) => x(d.x) as number)
      .attr('y', (d) => y(d.y) as number)
      .attr('rx', 6)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', (d) => color(d.v))
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    g.selectAll('text.val')
      .data(grid.cells)
      .join('text')
      .attr('class', 'val text-[10px] fill-gray-800')
      .attr('x', (d) => (x(d.x) as number) + x.bandwidth() / 2)
      .attr('y', (d) => (y(d.y) as number) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'middle')
      .text((d) => d.v);

    // Crosshair lines
    const vx = g.append('line')
      .attr('y1', 0)
      .attr('y2', innerH)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');
    const vy = g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Enhanced hover tooltip with data breakdown
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    const total = d3.sum(grid.cells, (c) => c.v) || 1;

    g.selectAll('rect')
      .on('mouseenter', function () {
        d3.select(this).attr('stroke', 'var(--color-primary)').attr('stroke-width', 1.5);
        vx.style('display', null);
        vy.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', 'none');
        vx.style('display', 'none');
        vy.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', function (event, d: any) {
        // Update crosshair position
        const cellX = (x(d.x) as number) + x.bandwidth() / 2;
        const cellY = (y(d.y) as number) + y.bandwidth() / 2;
        vx.attr('x1', cellX).attr('x2', cellX);
        vy.attr('y1', cellY).attr('y2', cellY);

        // Update tooltip with detailed breakdown
        const pct = (d.v / total) * 100;
        tipTitle.text('Price Sensitivity × Brand Loyalty');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        const breakdown = [
          { label: 'Price Sensitivity', value: d.x },
          { label: 'Brand Loyalty', value: d.y },
          { label: 'Count', value: d.v.toString() },
          { label: 'Percentage', value: `${pct.toFixed(1)}%` },
        ];

        breakdown.forEach((item) => {
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          row.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.label}: ${item.value}`);
          yOffset += 16;
        });

        const bbox = tipContent.node()?.getBBox();
        if (bbox) {
          const tipWidth = Math.max(bbox.width + 20, 220);
          const tipHeight = bbox.height + 40;
          tipBg
            .attr('width', tipWidth)
            .attr('height', tipHeight)
            .attr('x', -tipWidth / 2)
            .attr('y', -tipHeight - 10);
          
          tipTitle.attr('x', -tipWidth / 2 + 10).attr('y', 14);
          tipContent.attr('transform', `translate(${-tipWidth / 2 + 10}, 20)`);
          
          const [mx, my] = d3.pointer(event);
          tip.attr('transform', `translate(${Math.min(innerW - (tipWidth + 20), mx + 8)},${Math.max(12, my - tipHeight - 20)})`);
        }
      });

    // Axes labels
    g.append('g')
      .attr('transform', `translate(0,${-8})`)
      .selectAll('text')
      .data(grid.xCats)
      .join('text')
      .attr('class', 'text-xs fill-gray-600')
      .attr('x', (d) => (x(d) as number) + x.bandwidth() / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .text((d) => d);

    g.append('g')
      .selectAll('text')
      .data(grid.yCats)
      .join('text')
      .attr('class', 'text-xs fill-gray-600')
      .attr('x', -10)
      .attr('y', (d) => (y(d) as number) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'end')
      .text((d) => d);
  }, [grid, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


