import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Warehouse } from '../types';

interface WarehouseVizProps {
  warehouses: Warehouse[];
}

const WarehouseViz: React.FC<WarehouseVizProps> = ({ warehouses }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !warehouses.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const yScale = d3.scaleBand()
      .domain(warehouses.map(d => d.name))
      .range([0, innerHeight])
      .padding(0.3);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(warehouses, d => d.capacity) || 10000])
      .range([0, innerWidth]);

    // Background Bars (Capacity)
    g.selectAll(".capacity-bar")
      .data(warehouses)
      .enter()
      .append("rect")
      .attr("class", "capacity-bar")
      .attr("y", d => yScale(d.name)!)
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("width", d => xScale(d.capacity))
      .attr("fill", "#e2e8f0")
      .attr("rx", 4);

    // Foreground Bars (Used)
    g.selectAll(".used-bar")
      .data(warehouses)
      .enter()
      .append("rect")
      .attr("class", "used-bar")
      .attr("y", d => yScale(d.name)!)
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("width", 0) // Animate from 0
      .attr("fill", d => {
        const usage = d.used / d.capacity;
        return usage > 0.85 ? "#ef4444" : "#6366f1";
      })
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .attr("width", d => xScale(d.used));

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(yScale).tickSize(0))
      .select(".domain").remove();
      
    // Labels
    g.selectAll(".label")
        .data(warehouses)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.used) + 5)
        .attr("y", d => yScale(d.name)! + yScale.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => `${Math.round((d.used / d.capacity) * 100)}%`)
        .attr("font-size", "12px")
        .attr("fill", "#64748b");

  }, [warehouses]);

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Warehouse Capacity (Real-time)</h3>
      <div className="w-full h-[200px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default WarehouseViz;