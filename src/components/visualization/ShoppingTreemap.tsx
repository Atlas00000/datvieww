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

    // Enhanced tooltip with data breakdown
    const tip = svg.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    // Calculate total for percentage breakdown
    const total = d3.sum(root.leaves(), (d: any) => d.value || 0) || 1;
    const channelTotals = new Map<string, number>();
    root.leaves().forEach((d: any) => {
      const channel = d.parent?.data.name || 'Unknown';
      channelTotals.set(channel, (channelTotals.get(channel) || 0) + (d.value || 0));
    });

    nodes.on('mouseenter', function (event, d: any) {
        // Highlight the hovered cell
        d3.select(this).select('rect')
          .attr('stroke', 'var(--color-primary)')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.8);
        
        tip.style('display', null);
      })
      .on('mouseleave', function () {
        d3.select(this).select('rect')
          .attr('stroke', 'var(--color-primary)')
          .attr('stroke-width', 0)
          .attr('stroke-opacity', 0.06);
        tip.style('display', 'none');
      })
      .on('mousemove', function (event, d: any) {
        const channel = d.parent?.data.name || 'Unknown';
        const region = d.data.name;
        const value = d.data.value || 0;
        const channelTotal = channelTotals.get(channel) || 1;
        const regionPct = (value / channelTotal) * 100;
        const overallPct = (value / total) * 100;

        // Update tooltip with detailed breakdown
        tipTitle.text('Shopping Channel Breakdown');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        const breakdown = [
          { label: 'Channel', value: channel, color: color(channel) },
          { label: 'Region', value: region },
          { label: 'Count', value: value.toString() },
          { label: 'Channel %', value: `${regionPct.toFixed(1)}%` },
          { label: 'Overall %', value: `${overallPct.toFixed(1)}%` },
        ];

        breakdown.forEach((item, idx) => {
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          if (item.color) {
            row.append('rect')
              .attr('width', 12)
              .attr('height', 12)
              .attr('fill', item.color)
              .attr('rx', 2);
          }
          row.append('text')
            .attr('x', item.color ? 16 : 0)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.label}: ${item.value}`);
          yOffset += 16;
        });

        const bbox = tipContent.node()?.getBBox();
        if (bbox) {
          const tipWidth = Math.max(bbox.width + 20, 200);
          const tipHeight = bbox.height + 40;
          tipBg
            .attr('width', tipWidth)
            .attr('height', tipHeight)
            .attr('x', -tipWidth / 2)
            .attr('y', -tipHeight - 10);
          
          tipTitle.attr('x', -tipWidth / 2 + 10).attr('y', 14);
          tipContent.attr('transform', `translate(${-tipWidth / 2 + 10}, 20)`);
          
          const [mx, my] = d3.pointer(event, svg.node() as any);
          tip.attr('transform', `translate(${mx + 10 - width / 2},${my - height / 2 - tipHeight - 20})`);
        }
      });
  }, [rootData, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


