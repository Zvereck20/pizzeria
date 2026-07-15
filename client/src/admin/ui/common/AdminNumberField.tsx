import {
  forwardRef,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { TextField, type TextFieldProps } from "@mui/material";

interface AdminNumberFieldProps
  extends Omit<TextFieldProps, "children" | "inputRef" | "type"> {
  helperText?: ReactNode;
}

const selectInputValue = (
  event:
    | FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    | MouseEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  event.currentTarget.select();
};

export const AdminNumberField = forwardRef<HTMLInputElement, AdminNumberFieldProps>(
  ({ inputProps, ...props }, ref) => (
    <TextField
      {...props}
      type="number"
      inputRef={ref}
      inputProps={{
        ...inputProps,
        onFocus: selectInputValue,
        onClick: selectInputValue,
      }}
    />
  ),
);

AdminNumberField.displayName = "AdminNumberField";
