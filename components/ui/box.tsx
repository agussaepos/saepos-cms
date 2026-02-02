import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, as: Component = "div", children, ...props }, ref) => {
    const Comp = Component as any;
    return (
      <Comp ref={ref} className={cn(className)} {...props}>
        {children}
      </Comp>
    );
  },
);

Box.displayName = "Box";

export { Box };
