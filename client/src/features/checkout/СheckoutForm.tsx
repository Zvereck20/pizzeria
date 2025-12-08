import type { FC } from "react";
import { useMemo } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMask from "react-input-mask";
import { checkoutSchema, type CheckoutFormValues } from "./validation";
import { useCart, QuantityControl } from "@/features";
import { generate30MinSlots } from "./timeSlots";

import {
  Input,
  Button,
  // Label,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  // Checkbox,
} from "@/components";

import { formatPrice } from "@/lib/format";

// селектор магазинов из стора — подправь под свой проект
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { CheckoutAddressField } from "./address/СheckoutAddressField";
// const selectStores = (s: RootState) => s.store.items; // пример

export const CheckoutForm: FC<{
  onSubmitOrder: (payload: CheckoutFormValues) => void;
}> = ({ onSubmitOrder }) => {
  const { total } = useCart();
  //   const stores = useSelector(selectStores);

  const timeOptions = useMemo(() => generate30MinSlots(10, 23), []);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CheckoutFormValues>({
    mode: "onTouched",
    resolver: yupResolver(checkoutSchema), // ← без <...>
    defaultValues: {
      orderType: "delivery",
      fullName: "",
      phone: "",
      address: { street: "", building: "", appartment: "", entrance: "", floor: "" }, // либо null, если хочешь скрывать inputs
      storeId: null,
      timeMode: "asap",
      scheduledTime: null,
      persons: 1,
      paymentMethod: "cash",
      cashNeedChange: false,
      cashGiven: null,
      comment: null,
      consent: false,
    },
  });

  const orderType = watch("orderType"); // delivery | pickup
  const timeMode = watch("timeMode");
  const persons = watch("persons");
  const paymentMethod = watch("paymentMethod");
  const cashNeedChange = watch("cashNeedChange");

  const onIncPersons = () =>
    setValue("persons", Math.min(20, (persons ?? 1) + 1), { shouldValidate: true });
  const onDecPersons = () =>
    setValue("persons", Math.max(1, (persons ?? 1) - 1), { shouldValidate: true });

  const onSubmit: SubmitHandler<CheckoutFormValues> = (data) => {
    if (data.paymentMethod === "online") {
      //переход на модуль оплаты банка
    }

    onSubmitOrder(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Тип заказа */}
      <div className="space-y-2">
        {/* <Label>Тип заказа</Label> */}
        <Controller
          name="orderType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              className="flex gap-4"
              value={field.value}
              onValueChange={field.onChange}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="delivery" value="delivery" />
                {/* <Label htmlFor="delivery">Доставка</Label> */}
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pickup" value="pickup" />
                {/* <Label htmlFor="pickup">Самовывоз</Label> */}
              </div>
            </RadioGroup>
          )}
        />
      </div>
      <Separator />
      {/* Контакты */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {/* <Label htmlFor="fullName">Имя</Label> */}
          <Input id="fullName" placeholder="Иван" {...register("fullName")} />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          {/* <Label htmlFor="phone">Телефон</Label> */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputMask
                {...field}
                mask="+7 (999) 999-99-99"
                maskChar="_"
                alwaysShowMask={false}
              >
                {(inputProps: any) => (
                  <Input
                    {...inputProps}
                    type="tel"
                    placeholder="+7 (999) 999-99-99"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                )}
              </InputMask>
            )}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>
      </div>
      {/* Адрес (доставка) */}
      {orderType === "delivery" && <CheckoutAddressField control={control} />}
      {/* Заведение (самовывоз) */}
      {orderType === "pickup" && (
        <div className="max-w-md">
          {/* <Label>Заведение</Label> */}
          <Controller
            name="storeId"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите заведение" />
                </SelectTrigger>
                <SelectContent>
                  {/* {stores.map((s: any) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))} */}
                  привет
                </SelectContent>
              </Select>
            )}
          />
          {errors.storeId && (
            <p className="mt-1 text-sm text-red-600">{errors.storeId.message}</p>
          )}
        </div>
      )}
      <Separator />
      {/* Время */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          {/* <Label>Время</Label> */}
          <Controller
            name="timeMode"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex gap-4 mt-2"
                value={field.value}
                onValueChange={field.onChange}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="asap" value="asap" />
                  {/* <Label htmlFor="asap">Как можно скорее</Label> */}
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="scheduled" value="scheduled" />
                  {/* <Label htmlFor="scheduled">Другое время</Label> */}
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {timeMode === "scheduled" && (
          <div>
            {/* <Label>Выберите время</Label> */}
            <Controller
              name="scheduledTime"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Например, 18:30" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.scheduledTime && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduledTime.message}</p>
            )}
          </div>
        )}
      </div>
      {/* Количество персон */}
      <div className="max-w-sm">
        {/* <Label>Количество персон</Label> */}
        <div className="mt-2">
          <QuantityControl
            value={persons ?? 1}
            onInc={onIncPersons}
            onDec={onDecPersons}
          />
        </div>
        {errors.persons && (
          <p className="mt-1 text-sm text-red-600">{errors.persons.message}</p>
        )}
      </div>
      <Separator />
      {/* // === Оплата === */}
      <div className="space-y-2">
        {/* <Label>Оплата</Label> */}
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup
              className="flex flex-col gap-2 sm:flex-row sm:gap-6"
              value={field.value}
              onValueChange={field.onChange}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pm-cash" value="cash" />
                {/* <Label htmlFor="pm-cash">Наличными при получении</Label> */}
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pm-online" value="online" />
                {/* <Label htmlFor="pm-online">Онлайн оплата</Label> */}
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="pm-card" value="card" />
                {/* <Label htmlFor="pm-card">Картой курьеру</Label> */}
              </div>
            </RadioGroup>
          )}
        />
        {errors.paymentMethod && (
          <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
        )}

        {/* Наличными: нужна сдача */}
        {paymentMethod === "cash" && (
          <div className="grid gap-3 sm:grid-cols-[auto_200px] sm:items-center">
            <div className="flex items-center gap-2">
              {/* <Controller
                name="cashNeedChange"
                control={control}
                render={({ field }) => <Checkbox id="need-change" checked={field.value} onCheckedChange={field.onChange} />}
              />
              <Label htmlFor="need-change">Нужна сдача с</Label> */}
            </div>

            {cashNeedChange && (
              <div>
                <Input
                  type="number"
                  step="1"
                  placeholder="Сумма, ₽"
                  {...register("cashGiven")}
                />
                {errors.cashGiven && (
                  <p className="mt-1 text-sm text-red-600">{errors.cashGiven.message}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Separator />
      <div className="space-y-2">
        {/* <Label htmlFor="comment">Комментарий к заказу</Label> */}
        <Textarea
          id="comment"
          placeholder="Например: без лука, позвонить за 10 минут"
          {...register("comment")}
        />
        {errors.comment && (
          <p className="text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>
      <Separator />
      <div className="flex items-start gap-2">
        {/* <Controller
          name="consent"
          control={control}
          render={({ field }) => <Checkbox id="consent" checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label htmlFor="consent" className="text-sm text-muted-foreground">
          Я согласен на обработку персональных данных
        </Label> */}
      </div>
      {errors.consent && <p className="text-sm text-red-600">{errors.consent.message}</p>}
      {/* Итог + submit */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg font-semibold">
          Итого к оплате: <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
        <Button
          variant="submit"
          type="submit"
          disabled={isSubmitting || !watch("consent")}
        >
          Оформить заказ
        </Button>
      </div>
    </form>
  );
};
