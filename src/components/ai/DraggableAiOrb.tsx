import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, View, type LayoutChangeEvent } from 'react-native';

import { AiOrb } from './AiOrb';
import { clampOrbPosition, defaultOrbPosition, isOrbDrag, type OrbArea, type OrbPoint } from './orb-position';

interface DraggableAiOrbProps {
  /** Opens the AI assistant. Called for a tap only, never at the end of a drag. */
  onPress: () => void;
  /** Space the orb must stay clear of at the top (status bar / notch). */
  reservedTop?: number;
  /** Space the orb must stay clear of at the bottom (tab bar). */
  reservedBottom?: number;
  size?: 60 | 40;
}

/**
 * The AI orb the user can drag anywhere inside the visible area (`orb-position`
 * clamps it away from the status bar, the tab bar and the screen edges). It stays
 * where it is released for as long as this component is mounted; a tap without
 * movement still calls `onPress`. Mount it once in the layout that owns the area,
 * so every screen of that layout shares one position. Plain `PanResponder`, no
 * gesture library.
 */
export function DraggableAiOrb({ onPress, reservedTop = 0, reservedBottom = 0, size = 60 }: DraggableAiOrbProps) {
  const [area, setArea] = useState<OrbArea | null>(null);
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const resting = useRef<OrbPoint | null>(null);
  const dragged = useRef(false);
  // the pan handlers are created once: they read the latest values through this ref
  const live = useRef({ area, reservedTop, reservedBottom, size, onPress });
  live.current = { area, reservedTop, reservedBottom, size, onPress };

  const clamp = (point: OrbPoint): OrbPoint => {
    const l = live.current;
    return l.area ? clampOrbPosition(point, l.area, l.size, l.reservedTop, l.reservedBottom) : point;
  };

  // first layout → default corner; later layout / inset changes → re-clamp where it is now
  useEffect(() => {
    if (!area) return;
    const base = resting.current ?? defaultOrbPosition(area, size, reservedBottom);
    resting.current = clampOrbPosition(base, area, size, reservedTop, reservedBottom);
    translate.setValue(resting.current);
  }, [area, reservedTop, reservedBottom, size, translate]);

  const pan = useRef(
    PanResponder.create({
      // the orb's own press handles a plain tap; the drag takes over once the finger moves
      onMoveShouldSetPanResponderCapture: (_, g) => isOrbDrag(g.dx, g.dy),
      onPanResponderGrant: () => {
        dragged.current = true;
      },
      onPanResponderMove: (_, g) => {
        const from = resting.current;
        if (from) translate.setValue(clamp({ x: from.x + g.dx, y: from.y + g.dy }));
      },
      onPanResponderRelease: (_, g) => {
        const from = resting.current;
        if (from) {
          resting.current = clamp({ x: from.x + g.dx, y: from.y + g.dy });
          translate.setValue(resting.current);
        }
        setTimeout(() => (dragged.current = false), 0);
      },
      onPanResponderTerminate: () => {
        setTimeout(() => (dragged.current = false), 0);
      },
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    // a tab layout covered by a stack screen can report 0 x 0: keep the last real area and position
    if (width <= 0 || height <= 0) return;
    setArea((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
  };

  return (
    // the layer covers the area but lets every touch outside the orb through
    <View pointerEvents="box-none" onLayout={onLayout} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}>
      {area ? (
        <Animated.View
          {...pan.panHandlers}
          style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, transform: translate.getTranslateTransform() }}>
          <AiOrb floating={false} size={size} onPress={() => (dragged.current ? undefined : live.current.onPress())} />
        </Animated.View>
      ) : null}
    </View>
  );
}
