"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type GenderPieProps = {
  donut?: boolean;
  height?: number;
};

export default function GenderPie({ donut = false, height = 160 }: GenderPieProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const counts = useMemo(() => {
    const map = d3.rollup(
      displayData,
      (v) => v.length,
      (d) => d.gender
    );
    return Array.from(map, ([key, value]) => ({ key, value }));
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth || 320;
    const radius = Math.min(width, height) / 2 - 4;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(counts.map((d) => String(d.key)))
      .range([
        'var(--color-primary)',
        'var(--color-secondary)',
        'var(--color-info)',
        'var(--color-accent)',
      ]);

    const pie = d3.pie<{ key: string | unknown; value: number }>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<{ key: string | unknown; value: number }>>()
      .innerRadius(donut ? radius * 0.6 : 0)
      .outerRadius(radius);

    const g = svg.append('g');

    const arcs = g.selectAll('path')
      .data(pie(counts))
      .join('path')
      .attr('fill', (d) => color(String(d.data.key)))
      .attr('d', (d) => arc({ ...d, endAngle: d.startAngle }) as string)
      .attr('opacity', 0.9)
      .transition()
      .duration(900)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          const current = { ...d, endAngle: i(t) } as any;
          return arc(current) as string;
        };
      });

    // Labels
    const labelArc = d3.arc<d3.PieArcDatum<any>>().innerRadius(radius * 0.72).outerRadius(radius * 0.72);
    const labels = g.selectAll('text')
      .data(pie(counts))
      .join('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d as any)})`)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs fill-gray-700')
      .text((d) => `${String(d.data.key)} (${d.data.value})`)
      .attr('opacity', 0)
      .transition()
      .delay(400)
      .duration(500)
      .attr('opacity', 1);

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

    // Enhanced tooltip with data breakdown
    const tip = svg.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    const total = counts.reduce((sum, d) => sum + d.value, 0);
    const breakdown = counts.map((d) => ({
      key: String(d.key),
      value: d.value,
      percentage: (d.value / total) * 100,
      color: color(String(d.key)),
    }));

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

        // Show tooltip with full breakdown
        tipTitle.text('Gender Distribution Breakdown');
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
          
          const [mx, my] = d3.pointer(event, svg.node() as any);
          tip.attr('transform', `translate(${mx}, ${my - radius - tipHeight - 20})`);
        }

        tip.style('display', null);
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svg.node() as any);
        const bbox = tipContent.node()?.getBBox();
        if (bbox) {
          const tipHeight = bbox.height + 40;
          tip.attr('transform', `translate(${mx}, ${my - radius - tipHeight - 20})`);
        }
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 0.9).attr('stroke', 'none');
        crosshair.style('display', 'none');
        tip.style('display', 'none');
      });
  }, [counts, donut, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


