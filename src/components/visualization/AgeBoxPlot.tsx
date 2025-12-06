"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type AgeBoxPlotProps = { height?: number };

export default function AgeBoxPlot({ height = 180 }: AgeBoxPlotProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const stats = useMemo(() => {
    const ages = displayData.map((d) => d.age).sort(d3.ascending);
    const q1 = d3.quantile(ages, 0.25) ?? 0;
    const q2 = d3.quantile(ages, 0.5) ?? 0;
    const q3 = d3.quantile(ages, 0.75) ?? 0;
    const min = ages[0] ?? 0;
    const max = ages[ages.length - 1] ?? 0;
    return { min, q1, q2, q3, max };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 10, right: 12, bottom: 26, left: 36 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([stats.min - 2, stats.max + 2]).nice().range([0, innerW]);

    // Box
    const boxH = Math.min(40, innerH * 0.45);
    const centerY = innerH / 2;
    g.append('rect')
      .attr('x', x(stats.q1))
      .attr('y', centerY - boxH / 2)
      .attr('width', Math.max(0, x(stats.q3) - x(stats.q1)))
      .attr('height', boxH)
      .attr('rx', 8)
      .attr('fill', 'var(--color-primary)')
      .attr('fill-opacity', 0.15)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.5);

    // Median
    g.append('line')
      .attr('x1', x(stats.q2))
      .attr('x2', x(stats.q2))
      .attr('y1', centerY - boxH / 2)
      .attr('y2', centerY + boxH / 2)
      .attr('stroke', 'var(--color-secondary)')
      .attr('stroke-width', 2);

    // Whiskers
    g.append('line')
      .attr('x1', x(stats.min))
      .attr('x2', x(stats.max))
      .attr('y1', centerY)
      .attr('y2', centerY)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.6);
    g.append('line')
      .attr('x1', x(stats.min))
      .attr('x2', x(stats.min))
      .attr('y1', centerY - boxH / 3)
      .attr('y2', centerY + boxH / 3)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.6);
    g.append('line')
      .attr('x1', x(stats.max))
      .attr('x2', x(stats.max))
      .attr('y1', centerY - boxH / 3)
      .attr('y2', centerY + boxH / 3)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.6);

    const xAxis = d3.axisBottom(x).ticks(6).tickSizeOuter(0);
    g.append('g').attr('transform', `translate(0,${innerH})`).call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-200'))
      .call((s) => s.select('.domain').attr('class', 'stroke-gray-300'));

    // Crosshair line
    const vx = g.append('line')
      .attr('y1', 0)
      .attr('y2', innerH)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Interactive handle + enhanced tooltip
    const handle = g.append('circle').attr('r', 5).attr('fill', 'var(--color-primary)').style('display', 'none');
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    g.append('rect').attr('x', 0).attr('y', centerY - boxH / 2 - 10).attr('width', innerW).attr('height', boxH + 20).attr('fill', 'transparent')
      .on('mouseenter', () => {
        vx.style('display', null);
        handle.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', () => {
        vx.style('display', 'none');
        handle.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const age = Math.round(x.invert(mx));
        vx.attr('x1', mx).attr('x2', mx);
        handle.attr('cx', mx).attr('cy', centerY);

        // Update tooltip with detailed breakdown
        tipTitle.text('Age Distribution Statistics');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        const breakdown = [
          { label: 'Min', value: Math.round(stats.min).toString() },
          { label: 'Q1 (25%)', value: Math.round(stats.q1).toString() },
          { label: 'Median (50%)', value: Math.round(stats.q2).toString() },
          { label: 'Q3 (75%)', value: Math.round(stats.q3).toString() },
          { label: 'Max', value: Math.round(stats.max).toString() },
          { label: 'IQR', value: Math.round(stats.q3 - stats.q1).toString() },
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
          const tipWidth = Math.max(bbox.width + 20, 200);
          const tipHeight = bbox.height + 40;
          tipBg
            .attr('width', tipWidth)
            .attr('height', tipHeight)
            .attr('x', -tipWidth / 2)
            .attr('y', -tipHeight - 10);
          
          tipTitle.attr('x', -tipWidth / 2 + 10).attr('y', 14);
          tipContent.attr('transform', `translate(${-tipWidth / 2 + 10}, 20)`);
          
          const tx = Math.min(innerW - (tipWidth + 20), mx + 10);
          tip.attr('transform', `translate(${tx},${centerY - boxH / 2 - tipHeight - 20})`);
        }
      });
  }, [stats, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


