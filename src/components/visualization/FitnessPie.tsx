"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type FitnessPieProps = { height?: number };

export default function FitnessPie({ height = 200 }: FitnessPieProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const parts = useMemo(() => {
    const order = ['Low', 'Medium', 'High'] as const;
    const map = d3.rollup(displayData, (v) => v.length, (d) => d.fitnessLevel);
    return order.map((k) => ({ key: k as string, value: map.get(k) ?? 0 })).filter((d) => d.value > 0);
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 360;
    const radius = Math.min(width, height) / 2 - 6;

    const svg = d3.select(ref.current).attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const color = d3.scaleOrdinal<string, string>()
      .domain(parts.map((d) => d.key))
      .range(['#93c5fd', '#86efac', '#67e8f9', '#fca5a5', '#fde047']);

    const pie = d3.pie<any>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(0).outerRadius(radius);

    const g = svg.append('g');
    const paths = g.selectAll('path').data(pie(parts)).join('path')
      .attr('fill', (d) => color(d.data.key))
      .attr('d', (d) => arc({ ...d, endAngle: d.startAngle }) as string)
      .attr('opacity', 0.9)
      .transition().duration(800)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return (t) => arc({ ...d, endAngle: i(t) } as any) as string;
      });

    const labelArc = d3.arc<d3.PieArcDatum<any>>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);
    const labels = g.selectAll('text').data(pie(parts)).join('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d as any)})`)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-[10px] fill-gray-800')
      .text((d) => d.data.key);

    // Interactive tooltip with data breakdown
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

    // Calculate percentages for breakdown
    const total = d3.sum(parts, (d) => d.value) || 1;
    const breakdown = parts.map((d) => ({
      key: d.key,
      value: d.value,
      percentage: (d.value / total) * 100,
      color: color(d.key),
    }));

    // Center callout updates on hover
    const center = svg.append('g').attr('transform', 'translate(0,0)');
    const centerBg = center.append('circle').attr('r', 24).attr('fill', 'white').attr('stroke', '#e5e7eb');
    const centerText = center.append('text').attr('class', 'text-[11px] fill-gray-800 font-medium').attr('text-anchor', 'middle').attr('y', 4).text('Fitness');

    // Enhanced hover with crosshair and tooltip
    g.selectAll('path')
      .on('mouseenter', function (event, d: any) {
        d3.select(this).attr('opacity', 1).attr('stroke', 'var(--color-primary)').attr('stroke-width', 2);
        
        // Show crosshair
        const centroid = arc.centroid(d as any);
        const angle = Math.atan2(centroid[1], centroid[0]);
        const crosshairLength = radius;
        crosshair
          .attr('x2', Math.cos(angle) * crosshairLength)
          .attr('y2', Math.sin(angle) * crosshairLength)
          .style('display', null);

        // Update center text
        const pct = Math.round((d.data.value / total) * 100);
        centerText.text(`${d.data.key} ${pct}%`);

        // Show tooltip with full breakdown
        tipTitle.text('Fitness Level Breakdown');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        breakdown.forEach((item) => {
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          row.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', item.color)
            .attr('rx', 2);
          row.append('text')
            .attr('x', 16)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.key}: ${item.value} (${item.percentage.toFixed(1)}%)`);
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
          
          // Position tooltip near the hovered segment
          const [mx, my] = d3.pointer(event, svg.node());
          tip.attr('transform', `translate(${mx}, ${my - radius - tipHeight - 20})`);
        }

        tip.style('display', null);
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 0.9).attr('stroke', 'none');
        crosshair.style('display', 'none');
        tip.style('display', 'none');
        centerText.text('Fitness');
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svg.node());
        const bbox = tipContent.node()?.getBBox();
        if (bbox) {
          const tipHeight = bbox.height + 40;
          tip.attr('transform', `translate(${mx}, ${my - radius - tipHeight - 20})`);
        }
      });
  }, [parts, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


