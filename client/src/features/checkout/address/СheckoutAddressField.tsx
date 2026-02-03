import type { FC } from "react";
import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import type { CheckoutFormValues } from "../validation";
import { AddressModal } from "./AddressModal";
import type { AddressValue } from "./types";
import { Input } from "@/components";

type Props = { control: Control<CheckoutFormValues>; disabled?: boolean };

export const CheckoutAddressField: FC<Props> = ({ control, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name="address"
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value as AddressValue | null;
        const display = value?.display ?? "";
        return (
          <div className="space-y-2">
            <label>Адрес доставки</label>
            <button
              type="button"
              className="block w-full"
              onClick={() => setOpen(true)}
              disabled={disabled}
            >
              <Input value={display} placeholder="Город, улица, дом" readOnly />
            </button>

            {fieldState.error && (
              <p className="text-sm text-red-600">{fieldState.error.message}</p>
            )}

            <AddressModal
              open={open}
              onOpenChange={setOpen}
              defaultValue={value ?? undefined}
              onConfirm={(addr) => {
                field.onChange(addr); // кладём объект в useForm
                setOpen(false);
              }}
            />
          </div>
        );
      }}
    />
  );
};
