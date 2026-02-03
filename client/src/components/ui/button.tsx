import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "classic" | "ingredients" | "add-card" | "submit";
}

export const Button: FC<ButtonProps> = ({
  variant,
  disabled,
  children,
  className,
  ...props
}) => (
  <button
    className={`button button--${variant} ${className ? className : ""}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
