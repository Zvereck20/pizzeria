import { FC } from "react";

interface InputRadioProps {
  id: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export const InputRadio: FC<InputRadioProps> = ({
  id,
  label,
  value,
  checked,
  onChange,
}) => {
  return (
    <div className="radio">
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="radio-input"
      />
      <label htmlFor={id} className="radio-label">
        {label}
      </label>
    </div>
  );
};
