import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import io from 'socket.io-client';
import { Typography, Box, Card, CardMedia, Stack } from '@mui/material';


const LassoChartL = ({embeddings, imagePaths}) => {
  const chartRef = useRef(null);
  const socketRef = useRef(); 
  const [imageData, setImageData] = useState("");
  const [selectedDots, setSelectedDots] = useState([]);

  useEffect(() => {
    const data = [];
    
    socketRef.current = io.connect('http://localhost:5001');

    for(let i = 0; embeddings[i]; i++) {
        let tempObj = {
            x: embeddings[i][0],
            y: embeddings[i][1],
            id: i
        }
        data.push(tempObj)
    }

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
      .attr("fill", 'steelblue')
      .on('mouseenter', function (event) {
        d3.select(this)
            .transition()
            .duration(100)
            .attr('r', 20) // Increase radius on hover
            .attr('stroke-width', 3) // Increase border width on hover
            .attr('stroke', 'red'); // Change border color on hover
        })
        .on('mouseleave', function (event) {
            d3.select(this)
            .transition()
            .duration(10)
            .attr('r', 10) // Restore original radius on mouse leave
            .attr('stroke-width', 0) // Increase border width on hover
            .attr('stroke', null); // Change border color on hover
            let indexes = [];
            indexes.push(parseInt(this.id.slice(3,)));
            socketRef.current.emit('points', {index: indexes});
            console.log(parseInt(this.id.slice(3,)))
        });

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
      let indexes = [];
      let D, I;
      circles.each((d, i) => {
        D = d;
        I = i;
        let point = [
          xScale(d.x),
          yScale(d.y),
        ];
        if (pointInPolygon(point, coords)) {
          svg.select("#dot-" + d.id).attr("fill", "red");
          selectedDots.push(d.id);
          indexes.push(i)
        }
      });
      setSelectedDots(selectedDots); // Update the state with selected point IDs
      socketRef.current.emit('points', {index: indexes});
      console.log(`select: ${selectedDots}`);
    }

    socketRef.current.on('image_data', (data) => {
        console.log('Received image data:', data);  
        setImageData(data);
    });

    const drag = d3
      .drag()
      .on("start", dragStart)
      .on("drag", dragMove)
      .on("end", dragEnd);

    svg.call(drag);
  }, []);

  return (
    <Stack direction="row" flex={4} p={2}>
      <svg ref={chartRef} id="chart" width={1000} height={500}></svg>
      <Card>
        <CardMedia 
          component="img"
          src={`data:image/jpg;base64,${imageData}`}
          alt={`Image for point ${selectedDots.index}`}
        />
      </Card>
    </Stack>
  );
};

export default LassoChartL;
