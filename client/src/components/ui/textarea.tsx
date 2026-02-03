import { FC, forwardRef } from "react";

type TextareaProps = React.ComponentProps<"textarea">;

export const Textarea: FC<TextareaProps> = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => <textarea ref={ref} {...props} />,
);
