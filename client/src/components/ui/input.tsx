import { FC, forwardRef } from "react";

type InputProps = React.ComponentProps<"input">;

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ type, ...props }, ref) => <input type={type} ref={ref} {...props} />,
);
