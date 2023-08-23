import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LassoChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const data = [
      { x: -4, y: 14, id: 1 },
      { x: -26, y: -49, id: 2 },
      { x: 28, y: 11, id: 3 },
      { x: 0, y: -30, id: 4 },
      { x: 6.9, y: -63, id: 5 }
    ];
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data.map((d) => d.x)))
      .range([50, 550]);
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data.map((d) => d.y)))
      .range([50, 350]);

    const svg = d3.select(chartRef.current);

    const circles = svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("id", (d) => {
        return "dot-" + d.id;
      })
      .attr("cx", (d) => {
        return xScale(d.x);
      })
      .attr("cy", (d) => {
        return yScale(d.y);
      })
      .attr("r", 10)
      .attr("opacity", 0.5)
      .attr("fill", 'steelblue');

    let coords = [];
    const lineGenerator = d3.line();

    const pointInPolygon = function (point, vs) {
      var x = point[0],
        y = point[1];
      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0],
          yi = vs[i][1];
        var xj = vs[j][0],
          yj = vs[j][1];
        var intersect =
          yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    };

    function drawPath() {
      svg.select("#lasso")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "#00000054")
        .attr("d", lineGenerator(coords));
    }

    function dragStart() {
      coords = [];
      circles.attr("fill", "steelblue");
      svg.select("#lasso").remove();
      svg.append("path")
        .attr("id", "lasso");
    }

    function dragMove(event) {
      let mouseX = event.sourceEvent.offsetX;
      let mouseY = event.sourceEvent.offsetY;
      coords.push([mouseX, mouseY]);
      drawPath();
    }

    function dragEnd() {
      let selectedDots = [];
      circles.each((d, i) => {
        let point = [
          xScale(d.x),
          yScale(d.y),
        ];
        if (pointInPolygon(point, coords)) {
          svg.select("#dot-" + d.id).attr("fill", "red");
          selectedDots.push(d.id);
        }
      });
      console.log(`select: ${selectedDots}`);
    }

    const drag = d3
      .drag()
      .on("start", dragStart)
      .on("drag", dragMove)
      .on("end", dragEnd);

    svg.call(drag);
  }, []);

  return (
    <div>
      <svg ref={chartRef} id="chart" width={600} height={400}></svg>
    </div>
  );
};

export default LassoChart;
