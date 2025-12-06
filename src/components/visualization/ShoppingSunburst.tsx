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

    // Enhanced tooltip with data breakdown
    const tip = svg.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    // Crosshair indicator (radial line from center)
    const crosshair = svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -radius)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Calculate total for percentage breakdown
    const total = root.value || 1;

    svg.selectAll('path')
      .on('mouseenter', function (event: any, d: any) {
        d3.select(this).attr('stroke', 'var(--color-primary)').attr('stroke-width', 2);
        
        // Show crosshair
        const angle = ((d.x0 + d.x1) / 2);
        const midRadius = (d.y0 + d.y1) / 2;
        crosshair
          .attr('x2', Math.cos(angle - Math.PI / 2) * midRadius)
          .attr('y2', Math.sin(angle - Math.PI / 2) * midRadius)
          .style('display', null);
        
        tip.style('display', null);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', 'white').attr('stroke-width', 0);
        crosshair.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', function (event: any, d: any) {
        const channel = d.depth === 1 ? d.data.name : d.parent?.data.name || 'Unknown';
        const region = d.depth === 2 ? d.data.name : '';
        const value = d.value || 0;
        const pct = (value / total) * 100;

        // Update tooltip with detailed breakdown
        tipTitle.text('Shopping Channel Distribution');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        const breakdown = [
          { label: 'Channel', value: channel, color: color(channel) },
          ...(region ? [{ label: 'Region', value: region }] : []),
          { label: 'Count', value: value.toString() },
          { label: 'Percentage', value: `${pct.toFixed(1)}%` },
        ];

        breakdown.forEach((item: any) => {
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


