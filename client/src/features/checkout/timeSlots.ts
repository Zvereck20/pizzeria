/** Генерация слотов: шаг 30 мин, от ближайших 30 минут до конца дня (или до closeHour). */
export const generate30MinSlots = (openHour = 10, closeHour = 22): string[] => {
  const slots: string[] = [];
  const now = new Date();
  const start = new Date();

  // старт — ближайшие 30 минут в будущем
  const minutes = now.getMinutes();
  const rounded = minutes <= 30 ? 30 : 60;
  start.setMinutes(rounded, 0, 0);

  // если сейчас раньше открытия — начнём с openHour
  if (now.getHours() < openHour) {
    start.setHours(openHour, 0, 0, 0);
  }

  const end = new Date();
  end.setHours(closeHour, 0, 0, 0);

  const cur = new Date(start);
  while (cur <= end) {
    const hh = String(cur.getHours()).padStart(2, "0");
    const mm = String(cur.getMinutes()).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
    cur.setMinutes(cur.getMinutes() + 30);
  }
  return slots;
};
