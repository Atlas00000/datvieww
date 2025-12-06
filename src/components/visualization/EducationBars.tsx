"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type EducationBarsProps = { height?: number };

export default function EducationBars({ height = 160 }: EducationBarsProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const data = useMemo(() => {
    const map = d3.rollup(
      displayData,
      (v) => v.length,
      (d) => d.education
    );
    const entries = Array.from(map, ([education, value]) => ({ education: String(education), value }));
    return entries.sort((a, b) => b.value - a.value);
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 28, left: 100 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.education))
      .range([0, innerH])
      .padding(0.25);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) ?? 1])
      .nice()
      .range([0, innerW]);

    g.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('y', (d) => y(d.education) as number)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .attr('rx', 8)
      .attr('fill', 'var(--color-primary)')
      .transition()
      .duration(900)
      .attr('width', (d) => x(d.value));

    const xAxis = d3.axisBottom(x).ticks(3).tickSize(-innerH).tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).tickSizeOuter(0);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-600'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-100'))
      .call((s) => s.select('.domain').attr('class', 'stroke-gray-300'));

    g.append('g')
      .call(yAxis as any)
      .call((s) => s.selectAll('text').attr('class', 'text-xs fill-gray-700'))
      .call((s) => s.selectAll('line').attr('class', 'stroke-gray-200'))
      .call((s) => s.select('.domain').attr('class', 'stroke-gray-300'));

    // Crosshair line (horizontal for horizontal bars)
    const hy = g.append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Enhanced tooltip with data breakdown
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    const total = d3.sum(data, (d) => d.value) || 1;

    g.selectAll('rect')
      .on('mouseenter', () => {
        hy.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', () => {
        hy.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', function (event, d: any) {
        const hyPos = (y(d.education) as number) + y.bandwidth() / 2;
        hy.attr('y1', hyPos).attr('y2', hyPos);

        const pct = (d.value / total) * 100;

        // Update tooltip with detailed breakdown
        tipTitle.text('Education Level Distribution');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        data.forEach((item) => {
          const itemPct = (item.value / total) * 100;
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          row.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.education}: ${item.value} (${itemPct.toFixed(1)}%)`);
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
          tip.attr('transform', `translate(${Math.min(innerW - (tipWidth + 20), mx + 10)},${Math.max(12, my - tipHeight - 20)})`);
        }
      });
  }, [data, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


