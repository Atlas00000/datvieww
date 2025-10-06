"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type ShoppingSunburstProps = { height?: number };

export default function ShoppingSunburst({ height = 260 }: ShoppingSunburstProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const rootData = useMemo(() => {
    const channelGroups = d3.group(displayData, (d) => d.shoppingChannel);
    const children = Array.from(channelGroups, ([channel, rows]) => {
      const byRegion = d3.rollup(rows, (v) => v.length, (r) => r.region);
      return {
        name: channel,
        children: Array.from(byRegion, ([region, value]) => ({ name: region, value })),
      };
    });
    return { name: 'Shopping', children } as any;
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 560;
    const radius = Math.min(width, height) / 2 - 6;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const root = d3
      .hierarchy<any>(rootData)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<any>().size([2 * Math.PI, radius]);
    partition(root);

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(['Online', 'In-store', 'Mixed', 'Catalog'])
      .range([
        'var(--color-primary)',
        'var(--color-secondary)',
        'var(--color-info)',
        'var(--color-accent)'
      ]);

    const arc = d3
      .arc<d3.HierarchyRectangularNode<any>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    const nodes = svg
      .append('g')
      .selectAll('path')
      .data((root.descendants().filter((d) => d.depth) as unknown) as d3.HierarchyRectangularNode<any>[]) 
      .join('path')
      .attr('fill', (d) => (d.depth === 1 ? color(d.data.name) : color(d.parent?.data.name || 'Online')))
      .attr('fill-opacity', (d) => (d.depth === 1 ? 0.22 : 0.18))
      .attr('d', (d) => arc({ ...(d as any), x1: (d as any).x0 } as any) as string)
      .attr('stroke', 'white')
      .attr('stroke-opacity', 0.6)
      .transition()
      .duration(800)
      .attrTween('d', function (d) {
        const i = d3.interpolate((d as any).x0, (d as any).x1);
        return (t) => arc({ ...(d as any), x1: i(t) } as any) as string;
      });

    // Labels for first ring
    const label = svg
      .append('g')
      .selectAll('text')
      .data(root.descendants().filter((d) => d.depth === 1))
      .join('text')
      .attr('class', 'text-xs fill-gray-800')
      .attr('transform', (d) => {
        const node = d as any;
        const x = ((node.x0 + node.x1) / 2) * (180 / Math.PI);
        const y = (node.y0 + node.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('text-anchor', 'middle')
      .text((d) => d.data.name);

    // Tooltip
    const tip = svg.append('g');
    tip.style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');

    svg.selectAll('path')
      .on('mouseenter', () => tip.style('display', null))
      .on('mouseleave', () => tip.style('display', 'none'))
      .on('mousemove', function (event: any, d: any) {
        const label = d.depth === 1 ? d.data.name : `${d.parent?.data.name} → ${d.data.name}`;
        const value = d.value;
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(label);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`Count: ${value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event, svg.node() as any);
        tip.attr('transform', `translate(${mx + 10 - width / 2},${my - height / 2})`);
      });
  }, [rootData, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


