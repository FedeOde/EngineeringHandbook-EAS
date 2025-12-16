import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DrawingStroke, Point, DrawingToolConfig } from '../services/StickyNoteTypes';

interface DrawingCanvasProps {
  strokes: DrawingStroke[];
  onStrokesChange: (strokes: DrawingStroke[]) => void;
  toolConfig: DrawingToolConfig;
  width?: number;
  height?: number;
}

/**
 * Drawing canvas component with touch input handling
 * Captures touch gestures and renders strokes on an SVG canvas
 */
export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  strokes,
  onStrokesChange,
  toolConfig,
  width = Dimensions.get('window').width,
  height = 400,
}) => {
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentStroke([{ x: locationX, y: locationY }]);
      },

      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentStroke((prev) => [...prev, { x: locationX, y: locationY }]);
      },

      onPanResponderRelease: () => {
        if (currentStroke.length > 0) {
          const newStroke: DrawingStroke = {
            points: currentStroke,
            color: toolConfig.tool === 'eraser' ? '#FFFFFF' : toolConfig.color,
            width: toolConfig.tool === 'eraser' ? toolConfig.width * 2 : toolConfig.width,
          };

          onStrokesChange([...strokes, newStroke]);
          setCurrentStroke([]);
        }
      },

      onPanResponderTerminate: () => {
        setCurrentStroke([]);
      },
    })
  ).current;

  /**
   * Converts an array of points to an SVG path string
   */
  const pointsToPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  return (
    <View style={[styles.container, { width, height }]} {...panResponder.panHandlers}>
      <Svg width={width} height={height} style={styles.svg}>
        {/* Render saved strokes */}
        {strokes.map((stroke, index) => (
          <Path
            key={`stroke-${index}`}
            d={pointsToPath(stroke.points)}
            stroke={stroke.color}
            strokeWidth={stroke.width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        
        {/* Render current stroke being drawn */}
        {currentStroke.length > 0 && (
          <Path
            d={pointsToPath(currentStroke)}
            stroke={toolConfig.tool === 'eraser' ? '#FFFFFF' : toolConfig.color}
            strokeWidth={
              toolConfig.tool === 'eraser' ? toolConfig.width * 2 : toolConfig.width
            }
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    overflow: 'hidden',
  },
  svg: {
    backgroundColor: '#FFFFFF',
  },
});
