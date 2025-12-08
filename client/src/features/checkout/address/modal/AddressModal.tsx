import type { FC } from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button, Input, Label, Separator } from "@/components";
import type { AddressValue, GeoPoint } from "../types";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { MapPicker } from "./MapPicker";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultValue?: AddressValue;
  onConfirm: (value: AddressValue) => void;
};

export const AddressModal: FC<Props> = ({ open, onOpenChange, defaultValue, onConfirm }) => {
  const [city, setCity] = useState(defaultValue?.city ?? "");
  const [street, setStreet] = useState(defaultValue?.street ?? "");
  const [building, setBuilding] = useState(defaultValue?.building ?? "");
  const [appartment, setAppartment] = useState(defaultValue?.appartment ?? "");
  const [entrance, setEntrance] = useState(defaultValue?.entrance ?? "");
  const [floor, setFloor] = useState(defaultValue?.floor ?? "");
  const [location, setLocation] = useState<GeoPoint | null>(defaultValue?.location ?? null);

  // сброс при открытии
  useEffect(() => {
    if (!open) return;
    setCity(defaultValue?.city ?? "");
    setStreet(defaultValue?.street ?? "");
    setBuilding(defaultValue?.building ?? "");
    setAppartment(defaultValue?.appartment ?? "");
    setEntrance(defaultValue?.entrance ?? "");
    setFloor(defaultValue?.floor ?? "");
    setLocation(defaultValue?.location ?? null);
  }, [open, defaultValue]);

  const canConfirm = city.trim() && street.trim() && building.trim();

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm({
      city: city.trim(),
      street: street.trim(),
      building: building.trim(),
      appartment: appartment?.trim() || undefined,
      entrance: entrance?.trim() || undefined,
      floor: floor?.trim() || undefined,
      location,
    });
  };

  // коллбек автодополнения: распарсить в поля
  const onAutocompleteSelect = (suggestion: { city?: string; street?: string; house?: string; location?: GeoPoint }) => {
    if (suggestion.city) setCity(suggestion.city);
    if (suggestion.street) setStreet(suggestion.street);
    if (suggestion.house) setBuilding(suggestion.house);
    if (suggestion.location) setLocation(suggestion.location);
  };

  // коллбек карты
  const onMapSelect = (point: GeoPoint, reverse?: { city?: string; street?: string; house?: string }) => {
    setLocation(point);
    if (reverse?.city) setCity(reverse.city);
    if (reverse?.street) setStreet(reverse.street);
    if (reverse?.house) setBuilding(reverse.house);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Выбор адреса</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* комбинированная строка с автодополнением */}
          <div>
            <Label>Город, улица, дом</Label>
            <AddressAutocomplete
              value={`${city ? city + ", " : ""}${street ? street + ", " : ""}${building || ""}`}
              onSelect={onAutocompleteSelect}
              placeholder="Например: Москва, Тверская, 10"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="city">Город</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="street">Улица</Label>
              <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="building">Дом</Label>
              <Input id="building" value={building} onChange={(e) => setBuilding(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="appartment">Квартира</Label>
              <Input id="appartment" value={appartment ?? ""} onChange={(e) => setAppartment(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="entrance">Подъезд</Label>
              <Input id="entrance" value={entrance ?? ""} onChange={(e) => setEntrance(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="floor">Этаж</Label>
              <Input id="floor" value={floor ?? ""} onChange={(e) => setFloor(e.target.value)} />
            </div>
          </div>

          <Separator />

          {/* карта с выбором точки */}
          <div>
            <Label>Карта</Label>
            <MapPicker value={location ?? undefined} onSelect={onMapSelect} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
