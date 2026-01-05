import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RecoveryChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 1. Setup dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG content if any
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 2. Parse and Sort Data
    const parsedData = data.map(d => ({
      date: new Date(d["Cycle start time"]),
      value: d["Recovery score %"]
    })).sort((a, b) => a.date - b.date);

    // 3. Create Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // 4. Create Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5));

    g.append("g")
      .call(d3.axisLeft(yScale));

    // 5. Draw the Line
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .defined(d => d.value !== null && !isNaN(d.value))
      .curve(d3.curveMonotoneX); // Smooth WHOOP-style curve

    g.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#00ff00") // WHOOP Green
      .attr("stroke-width", 3)
      .attr("d", line);

  }, [data]);

  return (
    <div style={{ backgroundColor: '#121212', padding: '20px', borderRadius: '12px' }}>
      <h2 style={{ color: 'white' }}>Recovery Trends</h2>
      <svg ref={svgRef} width={800} height={400}></svg>
    </div>
  );
};

export default RecoveryChart;