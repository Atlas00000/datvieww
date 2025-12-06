"use client";

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useVisualizationStore } from '@/stores/visualizationStore';

type DeviceStackedBarsProps = { height?: number };

export default function DeviceStackedBars({ height = 200 }: DeviceStackedBarsProps) {
  const { displayData } = useVisualizationStore();
  const ref = useRef<SVGSVGElement | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[] | null>(null);

  const data = useMemo(() => {
    // Group by region and count primaryDevice categories for stacked bars
    const regions = Array.from(new Set(displayData.map((d) => d.region)));
    const devices = ['Desktop', 'Mobile', 'Tablet'] as const;
    const counts = d3.rollup(
      displayData,
      (v) => {
        const init: Record<(typeof devices)[number], number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
        for (const r of v) init[r.device as (typeof devices)[number]] += 1;
        return init;
      },
      (d) => d.region
    );
    const rows = regions.map((r) => ({ region: r, ...(counts.get(r) || { Desktop: 0, Mobile: 0, Tablet: 0 }) }));
    return { rows, keys: devices as unknown as string[] };
  }, [displayData]);

  useEffect(() => {
    if (!ref.current) return;
    const margin = { top: 10, right: 10, bottom: 28, left: 36 };
    const width = ref.current.clientWidth || 420;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.rows.map((d) => d.region))
      .range([0, innerW])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.rows, (d) => (d.Desktop as number) + (d.Mobile as number) + (d.Tablet as number)) ?? 1])
      .nice()
      .range([innerH, 0]);

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(data.keys)
      .range(['var(--color-primary)', 'var(--color-secondary)', 'var(--color-info)']);

    const keys = activeKeys ?? data.keys;
    const stacked = d3.stack<any>().keys(keys)(data.rows as any);

    const segments = g.append('g')
      .selectAll('g')
      .data(stacked)
      .join('g')
      .attr('fill', (d) => color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (d: any) => x(d.data.region) as number)
      .attr('y', innerH)
      .attr('height', 0)
      .attr('width', x.bandwidth())
      .attr('rx', 6)
      .transition()
      .duration(900)
      .attr('y', (d: any) => y(d[1]))
      .attr('height', (d: any) => y(d[0]) - y(d[1]));

    const xAxis = d3.axisBottom(x).tickSizeOuter(0);
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
    const cx = g.append('line')
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

    const centers = data.rows.map((d) => (x(d.region) as number) + x.bandwidth() / 2);
    const totalByRegion = new Map(data.rows.map((d) => [d.region, (d.Desktop as number) + (d.Mobile as number) + (d.Tablet as number)]));

    g.selectAll('rect')
      .on('mouseenter', () => {
        cx.style('display', null);
        tip.style('display', null);
      })
      .on('mouseleave', () => {
        cx.style('display', 'none');
        tip.style('display', 'none');
      })
      .on('mousemove', function (event: any, d: any) {
        const region = d.data.region;
        const value = Math.round(d[1] - d[0]);
        const parent: any = (this as any).parentNode.__data__;
        const seriesLabel = parent?.key || '';
        const cxPos = (x(region) as number) + x.bandwidth() / 2;
        cx.attr('x1', cxPos).attr('x2', cxPos);

        const regionTotal = totalByRegion.get(region) || 1;
        const pct = (value / regionTotal) * 100;

        // Update tooltip with detailed breakdown
        tipTitle.text('Device Usage Breakdown');
        tipContent.selectAll('*').remove();
        
        let yOffset = 0;
        const breakdown = [
          { label: 'Region', value: region },
          { label: 'Device', value: seriesLabel, color: color(seriesLabel) },
          { label: 'Count', value: value.toString() },
          { label: 'Region %', value: `${pct.toFixed(1)}%` },
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
          
          const [mx, my] = d3.pointer(event);
          tip.attr('transform', `translate(${Math.min(innerW - (tipWidth + 20), cxPos + 10)},${Math.max(12, my - tipHeight - 20)})`);
        }
      });

    // Legend toggles
    const legend = svg.append('g').attr('transform', `translate(${margin.left},${height - 8})`);
    const items = legend
      .selectAll('g')
      .data(data.keys)
      .join('g')
      .attr('transform', (_d, i) => `translate(${i * 120},-4)`) // simple layout
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        setActiveKeys((prev) => {
          const current = prev ?? data.keys;
          return current.includes(d) ? current.filter((k) => k !== d) : [...current, d];
        });
      });
    items
      .append('rect')
      .attr('width', 14)
      .attr('height', 14)
      .attr('rx', 3)
      .attr('fill', (d) => color(d))
      .attr('fill-opacity', (d) => (keys.includes(d) ? 0.9 : 0.2))
      .attr('stroke', '#e5e7eb');
    items
      .append('text')
      .attr('x', 20)
      .attr('y', 11)
      .attr('class', 'text-xs fill-gray-700')
      .text((d) => d);
  }, [data, height, activeKeys]);

  return <svg ref={ref} className="w-full" height={height} />;
}


