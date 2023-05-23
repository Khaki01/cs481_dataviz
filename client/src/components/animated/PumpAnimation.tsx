import { animated, useSpring } from 'react-spring';
import React, { PropsWithChildren, useCallback, useEffect } from 'react';

const PumpAnimation = ({ children }: PropsWithChildren) => {
  const [isBooped, setIsBooped] = React.useState(false);
  const rotation = 0;
  const timing = 150;
  const scale = 1;
  const x = 0;
  const y = 10;
  const animationProps = useSpring({
    display: 'inline-block',
    transform: isBooped
      ? `translate(${x}px, ${y}px)
         rotate(${rotation}deg)
         scale(${scale})`
      : `translate(0px, 0px)
         rotate(0deg)
         scale(1)`,

    config: { tension: 300, friction: 10 },
  });
  useEffect(() => {
    if (!isBooped) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setIsBooped(false);
    }, timing);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isBooped, timing]);
  const trigger = useCallback(() => {
    setIsBooped(true);
  }, []);
  return (
    <animated.span onMouseEnter={trigger} style={animationProps}>
      {children}
    </animated.span>
  );
};

export default PumpAnimation;
