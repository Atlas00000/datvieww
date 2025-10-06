"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type ShoppingTreemapProps = { height?: number };

export default function ShoppingTreemap({ height = 240 }: ShoppingTreemapProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const rootData = useMemo(() => {
    // Build hierarchy: root -> shoppingChannel -> region with counts
    const channels = d3.group(displayData, (d) => d.shoppingChannel);
    const children = Array.from(channels, ([channel, rows]) => {
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
    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const color = d3.scaleOrdinal<string, string>()
      .domain(['Online', 'In-store', 'Mixed', 'Catalog'])
      .range([
        'var(--color-primary)',
        'var(--color-secondary)',
        'var(--color-info)',
        'var(--color-accent)'
      ]);

    const root = d3.hierarchy<any>(rootData).sum((d) => d.value || 0).sort((a, b) => (b.value || 0) - (a.value || 0));
    d3.treemap<any>().size([width, height]).paddingInner(6).round(true)(root);

    const nodes = svg
      .append('g')
      .selectAll('g')
      .data((root.leaves() as unknown) as d3.HierarchyRectangularNode<any>[]) 
      .join('g')
      .attr('transform', (d) => `translate(${(d as any).x0},${(d as any).y0})`);

    const rects = nodes
      .append('rect')
      .attr('rx', 10)
      .attr('width', (d) => Math.max(0, (d as any).x1 - (d as any).x0))
      .attr('height', (d) => Math.max(0, (d as any).y1 - (d as any).y0))
      .attr('fill', (d) => color(d.parent?.data.name || 'Online'))
      .attr('fill-opacity', 0.18)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.06)
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    nodes
      .append('text')
      .attr('x', 10)
      .attr('y', 18)
      .attr('class', 'text-xs fill-gray-800')
      .text((d) => `${d.data.name} (${d.data.value})`)
      .attr('opacity', 0)
      .transition()
      .delay(350)
      .duration(500)
      .attr('opacity', 1);

    // Tooltip on hover (channel → region)
    const tip = svg.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 6).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const tipText = tip.append('text').attr('class', 'text-[10px] fill-gray-800');

    nodes.on('mouseenter', () => tip.style('display', null))
      .on('mouseleave', () => tip.style('display', 'none'))
      .on('mousemove', function (event, d: any) {
        const channel = d.parent?.data.name;
        const region = d.data.name;
        const value = d.data.value;
        tipText.selectAll('tspan').remove();
        tipText.append('tspan').attr('x', 0).attr('dy', 0).text(`${channel}`);
        tipText.append('tspan').attr('x', 0).attr('dy', 12).text(`${region}: ${value}`);
        const bbox = (tipText.node() as SVGTextElement).getBBox();
        tipBg.attr('width', bbox.width + 16).attr('height', bbox.height + 12).attr('x', -8).attr('y', -bbox.height);
        const [mx, my] = d3.pointer(event, svg.node() as any);
        tip.attr('transform', `translate(${mx + 10 - width / 2},${my - height / 2})`);
      });
  }, [rootData, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


