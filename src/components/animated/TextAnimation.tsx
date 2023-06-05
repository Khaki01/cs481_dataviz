import React, { PropsWithChildren } from 'react';
import { useSpring, animated } from 'react-spring';
import Typography, { TypographyProps } from '@mui/material/Typography';

const TextAnimation = ({
  children,
  ...typographyProps
}: PropsWithChildren<TypographyProps>) => {
  const animation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });
  return (
    <animated.div style={animation}>
      <Typography {...typographyProps}>{children}</Typography>
    </animated.div>
  );
};

export default TextAnimation;
