"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type IncomeChartProps = { height?: number };

export default function IncomeHistogramViolin({ height = 160 }: IncomeChartProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);

  const incomes = useMemo(() => {
    // Map income levels to approximate numeric buckets for visualization
    const map: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
    return displayData.map((d) => map[d.incomeLevel]);
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 8, right: 8, bottom: 24, left: 28 };
    const width = ref.current.clientWidth || 360;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0.5, 3.5]).range([0, innerW]);
    const bins = d3.bin().domain([0.5, 3.5]).thresholds([1, 2, 3])(incomes as number[]);
    const y = d3.scaleLinear().domain([0, d3.max(bins, (b) => b.length) ?? 1]).nice().range([innerH, 0]);

    // Histogram bars
    g.append('g')
      .attr('fill', 'var(--color-secondary)')
      .selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', (d) => x((d.x0 as number) + 0.05))
      .attr('y', innerH)
      .attr('width', (d) => x((d.x1 as number) - 0.1) - x(d.x0 as number))
      .attr('height', 0)
      .attr('rx', 6)
      .transition()
      .duration(900)
      .attr('y', (d) => y(d.length))
      .attr('height', (d) => innerH - y(d.length));

    // Simple violin overlay (kernel density approx.)
    const densityX = d3.scaleLinear().domain([1, 3]).range([0, innerW]);
    const kdeX = d3.range(1, 3.01, 0.05);
    const kernel = (u: number) => (Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0);
    const bandwidth = 0.3;
    const density = kdeX.map((x0) => {
      const sum = incomes.reduce((acc, v) => acc + kernel((x0 - (v as number)) / bandwidth), 0);
      return { x: x0, y: sum / (incomes.length * bandwidth) };
    });
    const maxD = d3.max(density, (d) => d.y) ?? 1;
    const densityY = d3.scaleLinear().domain([0, maxD]).range([0, innerH * 0.35]);
    const area = d3
      .area<{ x: number; y: number }>()
      .x((d) => densityX(d.x))
      .y0((d) => innerH / 2 - densityY(d.y))
      .y1((d) => innerH / 2 + densityY(d.y))
      .curve(d3.curveCatmullRom.alpha(0.7));

    g.append('path')
      .datum(density)
      .attr('fill', 'url(#gradIncome)')
      .attr('opacity', 0.8)
      .attr('d', area as any)
      .attr('transform', 'translate(0,0)')
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .attr('opacity', 1);

    // Gradient def
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'gradIncome').attr('x1', '0%').attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', 'var(--color-secondary)').attr('stop-opacity', 0.25);
    grad.append('stop').attr('offset', '100%').attr('stop-color', 'var(--color-info)').attr('stop-opacity', 0.25);

    const xAxis = d3
      .axisBottom(x)
      .tickFormat((v) => (v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High') as any)
      .tickSizeOuter(0);
    const yAxis = d3.axisLeft(y).ticks(3).tickSize(-innerW).tickSizeOuter(0);

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

    // Crosshair line
    const vx = g.append('line')
      .attr('y1', 0)
      .attr('y2', innerH)
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    // Enhanced tooltip with data breakdown
    const tip = g.append('g').style('display', 'none');
    const tipBg = tip.append('rect').attr('rx', 8).attr('fill', 'white').attr('stroke', '#e5e7eb').attr('stroke-width', 1);
    const tipTitle = tip.append('text').attr('class', 'text-sm fill-gray-900 font-bold').attr('x', 0).attr('y', 0);
    const tipContent = tip.append('g').attr('transform', 'translate(0, 20)');

    const total = incomes.length;
    const incomeBreakdown = [
      { label: 'Low', value: 1, count: incomes.filter((i) => i === 1).length },
      { label: 'Medium', value: 2, count: incomes.filter((i) => i === 2).length },
      { label: 'High', value: 3, count: incomes.filter((i) => i === 3).length },
    ].map((item) => ({
      ...item,
      percentage: (item.count / total) * 100,
    }));

    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', innerW)
      .attr('height', innerH)
      .attr('fill', 'transparent')
      .on('mouseenter', () => {
        vx.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', () => {
        vx.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        vx.attr('x1', mx).attr('x2', mx);

        // Find nearest bin
        const xVal = x.invert(mx);
        const nearestBin = bins.reduce((prev, curr) => {
          const prevDist = Math.abs(xVal - ((prev.x0 as number) + (prev.x1 as number)) / 2);
          const currDist = Math.abs(xVal - ((curr.x0 as number) + (curr.x1 as number)) / 2);
          return currDist < prevDist ? curr : prev;
        });

        // Update tooltip with detailed breakdown
        tipTitle.text('Income Distribution Breakdown');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        incomeBreakdown.forEach((item, idx) => {
          const row = tipContent.append('g').attr('transform', `translate(0, ${yOffset})`);
          row.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', idx === 0 ? '#fca5a5' : idx === 1 ? '#fde047' : '#86efac')
            .attr('rx', 2);
          row.append('text')
            .attr('x', 16)
            .attr('y', 10)
            .attr('class', 'text-xs fill-gray-700')
            .text(`${item.label}: ${item.count} (${item.percentage.toFixed(1)}%)`);
          yOffset += 16;
        });

        // Add current bin info
        const binLabel = nearestBin.x0 === 0.5 ? 'Low' : nearestBin.x0 === 1.5 ? 'Medium' : 'High';
        const binPct = ((nearestBin.length / total) * 100).toFixed(1);
        tipContent.append('g').attr('transform', `translate(0, ${yOffset + 8})`)
          .append('text')
          .attr('x', 0)
          .attr('y', 10)
          .attr('class', 'text-xs fill-gray-900 font-semibold')
          .text(`Bin ${binLabel}: ${nearestBin.length} (${binPct}%)`);

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
          
          tip.attr('transform', `translate(${Math.min(innerW - (tipWidth + 20), mx + 10)},${Math.max(12, innerH / 2 - tipHeight / 2)})`);
        }
      });
  }, [incomes, height]);

  return <svg ref={ref} className="w-full" height={height} />;
}


