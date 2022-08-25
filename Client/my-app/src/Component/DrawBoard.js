import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { Box } from '@chakra-ui/react';

const DrawBoard = ({ socket, profile }) => {
  const [lines, setLines] = useState([]);
  const [tool, setTool] = useState('pen');
  const isDrawing = useRef(false);
  const newDrawing = useRef(false);
  
  
  function begin(tool, point) {
    isDrawing.current = true;
    newDrawing.current = true;
    if (tool && point) {
      setLines(prev => {
        return [...prev, { tool, points: [point.x, point.y] }];
      });
    }
  }

  function drawing(point, tool) {
    if (!isDrawing.current) {
      return;
    }
    console.log('Drawing');
    console.log({ point, tool });
    let lastLine = lines[lines.length - 1];
    // add point
    if (lines.length === 0) {
      lastLine = { tool, points: [point.x, point.y] };
      lines.push(lastLine);
      setLines(lines.concat());
    } else {
      if (newDrawing.current) {
        lines.push({ tool, points: [point.x, point.y] });
        setLines(lines.concat());
        newDrawing.current = false;
      } else {
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
      }
    }
  }

  const handleMouseDown = e => {
    const pos = e.target.getStage().getPointerPosition();
    begin(tool, pos);
    socket.emit('start-drawing', { tool, pos, room: profile?.room });
  };
  const handleMouseMove = e => {
    // no drawing - skipping
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    drawing(point, tool);
    socket.emit('incomming-drawing', { point, tool, room: profile?.room });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    socket.emit('stop-drawing', { room: profile?.room });
  };

  useEffect(() => {
    if (socket) {
      console.log('Re initialized socket');
      const receiveDrawing = payload => {
        if (payload) {
          drawing(payload.point, payload.tool);
        }
      };
      const beginDrawing = payload => {
        if (payload) {
          console.log('This ran');
          const { pos } = payload;
          begin(payload.tool, pos);
        }
      };
      const cancelDrawing = () => {
        console.log('Cancel Drawing');
        isDrawing.current = false;
      };
      socket.on('drawing-from-server', receiveDrawing);
      socket.on('begin-drawing', beginDrawing);
      socket.on('cancel-drawing', cancelDrawing);
      return () => {
        socket.removeAllListeners();
        console.log('Removed all listeners');
      };
    }
  }, []);

  return (
    <Box
      borderWidth="10px"
      borderRadius="20px"
      borderColor={'teal'}
      marginLeft={'100px'}
    >
      <Stage
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text="Just start drawing" x={10} y={30} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000000"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
      <select
        value={tool}
        onChange={e => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
    </Box>
  );
};

export default DrawBoard;
