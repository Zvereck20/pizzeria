import { useMemo, type FC } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputMask } from "@react-input/mask";
import Select from "react-select";
import {
  type CheckoutFormValues,
  useCart,
  QuantityControl,
  checkoutSchema,
  generate30MinSlots,
  TimeSlot,
} from "@/features";
import { CheckoutAddressField } from "./address/components/СheckoutAddressField";
import { Input, Textarea, InputRadio } from "@/components";
import { useGetStoresQuery } from "../stores/storeApi";

export const CheckoutForm: FC<{
  onSubmitOrder: (payload: CheckoutFormValues) => void;
}> = ({ onSubmitOrder }) => {
  const { total } = useCart();
  const { data: stores, isSuccess, isError } = useGetStoresQuery();

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
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      orderType: "delivery",
      fullName: "",
      phone: "",
      address: {
        city: "",
        street: "",
        building: "",
        appartment: "",
        entrance: "",
        floor: "",
      },
      storeId: null,
      timeMode: "asap",
      scheduledTime: null,
      persons: 1,
      paymentMethod: "cash",
      cashGiven: null,
      comment: null,
      consent: false,
    },
  });

  const orderType = watch("orderType");
  const timeMode = watch("timeMode");
  const persons = watch("persons");
  const paymentMethod = watch("paymentMethod");
  const cashGiven = watch("cashGiven");

  const onIncPersons = () =>
    setValue("persons", Math.min(20, (persons ?? 1) + 1), { shouldValidate: true });
  const onDecPersons = () =>
    setValue("persons", Math.max(1, (persons ?? 1) - 1), { shouldValidate: true });

  const onSubmit: SubmitHandler<CheckoutFormValues> = (data, e) => {
    e?.preventDefault();
    // if (data.paymentMethod === "online") {
    //   //переход на модуль оплаты банка
    // }

    onSubmitOrder(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="checkout">
      <h3 className="checkout__title">Оформление заказа</h3>
      <Controller
        name="orderType"
        control={control}
        render={({ field }) => (
          <div className="checkout__wrap">
            <InputRadio
              id="delivery"
              label="Доставка"
              value="delivery"
              checked={field.value === "delivery"}
              onChange={() => field.onChange("delivery")}
            />
            <InputRadio
              id="pickup"
              label="Самовывоз"
              value="pickup"
              checked={field.value === "pickup"}
              onChange={() => field.onChange("pickup")}
            />
          </div>
        )}
      />
      {orderType === "pickup" && (
        <div className="checkout__stores">
          <h3 className="checkout__title">Выберите заведение</h3>
          <Controller
            name="storeId"
            control={control}
            render={({ field }) => (
              <div className="checkout__wrap">
                {stores
                  ?.filter((el) => el.isActive === true)
                  .reverse()
                  .map(({ _id, name, address }) => (
                    <InputRadio
                      key={name}
                      id={name}
                      label={address}
                      value={_id}
                      checked={field.value === _id}
                      onChange={() => field.onChange(_id)}
                    />
                  ))}
              </div>
            )}
          />
          {errors.storeId && <p className="checkout__error">{errors.storeId.message}</p>}
        </div>
      )}
      <ul className="checkout__container">
        <li>
          <label htmlFor="fullName">Имя</label>
          <Input id="fullName" placeholder="Иван" {...register("fullName")} />
          {errors.fullName && (
            <p className="checkout__error">{errors.fullName.message}</p>
          )}
        </li>
        <li>
          <label htmlFor="phone">Телефон</label>
          <InputMask
            mask="+7 (___) ___-__-__"
            replacement={{ _: /\d/ }}
            {...register("phone")}
            placeholder="+7 (___) ___-__-__"
          />
          {errors.phone && <p className="checkout__error">{errors.phone.message}</p>}
        </li>
      </ul>

      {orderType === "delivery" && (
        <div className="checkout__wrap">
          <CheckoutAddressField control={control} />
          {errors.address && (
            <p className="checkout__error">Не верно указан адрес доставки</p>
          )}
        </div>
      )}
      <div className="checkout__wrap">
        <h4>Время доставки</h4>
        <Controller
          name="timeMode"
          control={control}
          render={({ field }) => (
            <div className="checkout__time">
              <InputRadio
                id="asap"
                label="Как можно скорее"
                value="asap"
                checked={field.value === "asap"}
                onChange={() => field.onChange("asap")}
              />
              <InputRadio
                id="scheduled"
                label="Другое время"
                value="scheduled"
                checked={field.value === "scheduled"}
                onChange={() => field.onChange("scheduled")}
              />
            </div>
          )}
        />
      </div>
      {timeMode === "scheduled" && (
        <div className="checkout__wrap">
          <h4>Выберите время</h4>
          <Controller
            name="scheduledTime"
            control={control}
            render={({ field }) => {
              const currentOption =
                timeOptions.find((opt) => opt.value === field.value) || null;

              return (
                <Select<TimeSlot>
                  className="checkout__scheduled"
                  value={currentOption}
                  onChange={(selected) => field.onChange(selected?.value ?? null)}
                  options={timeOptions}
                />
              );
            }}
          />
          {errors.scheduledTime && (
            <p className="checkout__error">{errors.scheduledTime.message}</p>
          )}
        </div>
      )}
      <div className="checkout__wrap">
        <h4>Количество персон</h4>
        <QuantityControl
          style="checkout__persons"
          value={persons ?? 1}
          onInc={onIncPersons}
          onDec={onDecPersons}
        />
        {errors.persons && <p className="checkout__error">{errors.persons.message}</p>}
      </div>

      <div className="checkout__payment">
        <h3 className="checkout__title">Способ оплаты</h3>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <div className="checkout__wrap">
              <InputRadio
                id="cash"
                label="cash"
                value="cash"
                checked={field.value === "cash"}
                onChange={() => field.onChange("cash")}
              />
              <InputRadio
                id="online"
                label="online"
                value="online"
                checked={field.value === "online"}
                onChange={() => field.onChange("online")}
              />
              <InputRadio
                id="card"
                label="card"
                value="card"
                checked={field.value === "card"}
                onChange={() => field.onChange("card")}
              />
            </div>
          )}
        />
        {errors.paymentMethod && (
          <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
        )}

        {paymentMethod === "cash" && (
          <div className="checkout__change">
            <label htmlFor="cashGiven">Нужна сдача с:</label>
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

      <div className="checkout__comment">
        <label htmlFor="comment">Комментарий к заказу</label>
        <Textarea
          id="comment"
          placeholder="Например: без лука, позвонить за 10 минут"
          {...register("comment")}
        />
        {errors.comment && (
          <p className="text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <div className="checkout__agree">
        <Input id="consent" type="checkbox" {...register("consent")} />
        <label htmlFor="consent" className="text-sm text-muted-foreground">
          Я согласен на обработку персональных данных
        </label>
        {errors.consent && (
          <p className="text-sm text-red-600">{errors.consent.message}</p>
        )}
      </div>

      <button
        className="checkout__submit"
        type="submit"
        disabled={isSubmitting || !watch("consent")}
      >
        Оформить заказ
      </button>
    </form>
  );
};
