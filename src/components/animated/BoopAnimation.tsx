import React, { PropsWithChildren, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const BoopAnimation = ({ children }: PropsWithChildren) => {
  const [isBooped, setIsBooped] = React.useState(false);
  const rotation = 30;
  const timing = 150;
  const animationProps = useSpring({
    display: 'inline-block',
    transform: isBooped ? `rotate(${rotation}deg)` : `rotate(0deg)`,
    config: {
      tension: 300,
      friction: 10,
    },
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
  const trigger = () => {
    setIsBooped(true);
  };
  return (
    <animated.span onMouseEnter={trigger} style={animationProps}>
      {children}
    </animated.span>
  );
};

export default BoopAnimation;
