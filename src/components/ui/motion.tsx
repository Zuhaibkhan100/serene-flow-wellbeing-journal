
import { HTMLMotionProps, motion as framerMotion } from "framer-motion";

type MotionDivProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

// Simple motion component wrapper
const motion = {
  div: ({ children, ...props }: MotionDivProps) => {
    return (
      <framerMotion.div {...props}>
        {children}
      </framerMotion.div>
    );
  },
  h1: ({ children, ...props }: HTMLMotionProps<"h1">) => {
    return (
      <framerMotion.h1 {...props}>
        {children}
      </framerMotion.h1>
    );
  },
  h2: ({ children, ...props }: HTMLMotionProps<"h2">) => {
    return (
      <framerMotion.h2 {...props}>
        {children}
      </framerMotion.h2>
    );
  },
  span: ({ children, ...props }: HTMLMotionProps<"span">) => {
    return (
      <framerMotion.span {...props}>
        {children}
      </framerMotion.span>
    );
  }
};

export { motion };
