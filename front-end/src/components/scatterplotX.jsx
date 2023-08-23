import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import io from 'socket.io-client';
import { Typography, Box, Card, CardMedia, Stack } from '@mui/material';

const InteractiveScatterPlotX = ({ embeddings, labels, numClasses, imagePaths }) => {
  const plotRef = useRef(null);

  // State to keep track of the selected point and its image path
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredImagePath, setHoveredImagePath] = useState(null);
  const [imageData, setImageData] = useState("");
  const [selectedDots, setSelectedDots] = useState([]);
  const socketRef = useRef(); 
  const lassoRef = useRef(null);
  
  useEffect(() => {
    // D3 code to create the scatter plot
    // For simplicity, we are assuming `embeddings` contains 2D data points

    // Set up dimensions of the plot
    const width = 600;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    socketRef.current = io.connect('http://localhost:5001');

    // Create an SVG element
    const svg = d3
      .select(plotRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales for x and y axis (assuming `embeddings` contains 2D data)
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(embeddings, (d) => d[0]))
        .range([0, plotWidth]);
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(embeddings, (d) => d[1]))
        .range([plotHeight, 0]);

    // Create circle elements for each data point
    const circles = svg
        .selectAll('circle')
        .data(embeddings)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d[0]))
        .attr('cy', (d) => yScale(d[1]))
        .attr('r', 5) // Larger radius for more prominent circles
        .attr('fill', (d, i) => d3.schemeCategory10[labels[i]])
        .attr('stroke', 'black') // Add a black border
        .attr('stroke-width', 2) // Set the border width
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d, i) {
    d3.select(this)
      .transition()
      .duration(100)
      .attr('r', 10) // Increase radius on hover
      .attr('stroke-width', 3) // Increase border width on hover
      .attr('stroke', 'red'); // Change border color on hover
    })
    .on('mouseleave', function (event, d, i) {
        d3.select(this)
        .transition()
        .duration(100)
        .attr('r', 5) // Restore original radius on mouse leave
        .attr('stroke-width', 2) // Restore original border width on mouse leave
        .attr('stroke', 'black'); // Restore original border color on mouse leave
    });

    
    svg.selectAll('circle').each(function (d, i) {
        d3.select(this).on('mouseover', function (event) {
            console.log('Hovered over point:', d);
            console.log('Image path:', imagePaths[i]);
            setSelectedPoint({ index: i, data: d });
            setSelectedImagePath(imagePaths[i]);
        
            // Request the image data for the selected point from the server
            socketRef.current.emit('points', { index: i, data: d, imagePath: imagePaths[i]});
        });
    });

    socketRef.current.on('image_data', (data) => {
        console.log('Received image data:', data);
        setImageData(data.data.slice(2,-1));
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
          console.log("hiiiii")
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
            setSelectedDots(selectedDots); // Update the state with selected point IDs
            socketRef.current.emit('points', selectedDots);
            console.log(`select: ${selectedDots}`);
          }
      
    
        const drag = d3
          .drag()
          .on("start", dragStart)
          .on("drag", dragMove)
          .on("end", dragEnd);
    
        svg.call(drag);


  }, [embeddings, labels, numClasses, imagePaths]);

  return (
    <Stack direction="row" flex={4} p={2}>
      <svg ref={plotRef} width="1000" height="600" />
      {selectedPoint && (
        <Box>
            <Card>
            <Box p={2}>
                <Typography variant="h5">Selected Point:</Typography>
                <Typography variant="body1">Index: {selectedPoint.index}</Typography>
                <Typography variant="body1">Data: [{selectedPoint.data.join(', ')}]</Typography>
                <Typography variant="body1">Label: {labels[selectedPoint.index]}</Typography>
            </Box>
            {imageData && (
                <CardMedia
                component="img"
                src={`data:image/jpeg;base64,${imageData}`}
                alt={`Image for point ${selectedPoint.index}`}
                />
            )}
            </Card>
        </Box>
)}
    </Stack>
  );
};

export default InteractiveScatterPlotX;
