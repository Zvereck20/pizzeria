export interface TimeSlot {
  value: string;
  label: string;
}

export const generate30MinSlots = (openHour = 10, closeHour = 22): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  const start = new Date();
  start.setMinutes(60, 0, 0);

  if (now.getHours() < openHour) {
    start.setHours(openHour, 0, 0, 0);
  }

  const end = new Date();
  end.setHours(closeHour, 0, 0, 0);

  const cur = new Date(start);
  while (cur <= end) {
    const hh = String(cur.getHours()).padStart(2, "0");
    const mm = String(cur.getMinutes()).padStart(2, "0");
    slots.push({ value: `${hh}:${mm}`, label: `${hh}:${mm}` });

    cur.setMinutes(cur.getMinutes() + 30);
  }

  return slots;
};
