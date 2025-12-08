import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button, Input, Label, Separator, Textarea } from "@/components";
import { useDebounced } from "@/hooks/useDebounce";
import { fetchAddressSuggest } from "./addressApi";
import type { AddressValue } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultValue?: AddressValue | null;
  onConfirm: (addr: AddressValue) => void;
};

export const AddressQuickModal: FC<Props> = ({
  open,
  onOpenChange,
  defaultValue,
  onConfirm,
}) => {
  const [query, setQuery] = useState(defaultValue?.display ?? "");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [selected, setSelected] = useState<any | null>(defaultValue?.source ?? null);

  // Доп поля
  const [comment, setComment] = useState(defaultValue?.comment ?? "");
  const [entrance, setEntrance] = useState(defaultValue?.entrance ?? "");
  const [floor, setFloor] = useState(defaultValue?.floor ?? "");

  const debounced = useDebounced(query, 350);

  // сброс при открытии
  useEffect(() => {
    if (!open) return;
    setQuery(defaultValue?.display ?? "");
    setSelected(defaultValue?.source ?? null);
    setComment(defaultValue?.appartment ?? "");
    setEntrance(defaultValue?.entrance ?? "");
    setFloor(defaultValue?.floor ?? "");
    setList([]);
  }, [open, defaultValue]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const userQuery = debounced.trim();
      if (!userQuery) {
        setList([]);
        setSelected(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchAddressSuggest(userQuery);
        if (cancelled) return;

        console.log("res", res);

        if (res.mode === "match") {
          // точное совпадение — запоминаем объект и чистим список
          setSelected(res.match);
          setList([]);
        } else if (res.mode === "list") {
          setSelected(null);
          setList(res.suggestions);
        } else {
          setSelected(null);
          setList([]);
        }
      } catch {
        if (!cancelled) {
          setSelected(null);
          setList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const canConfirm = useMemo(() => {
    // можно подтверждать если есть selected (точный объект) ИЛИ достаточно длинная строка
    return !!selected || query.trim().length > 5;
  }, [selected, query]);

  const handlePickFromList = (value: string) => {
    // при выборе строки из списка — подставим в инпут; следующий запрос, возможно, вернёт "match"
    setQuery(value);
  };

  const handleConfirm = () => {
    // если есть объект selected — используем из него поля; иначе — только display
    const source = selected.data;

    const addr: AddressValue = {
      display: selected.value,
      city: source.city,
      street: source.street,
      building: source.house,
      appartment: source.flat,
      //   lat: source?.lat ?? null,
      //   lon: source?.lon ?? null,
      entrance: entrance?.trim() || null,
      floor: floor?.trim() || null,
      comment: comment?.trim() || null,
      // source,
    };

    onConfirm(addr);
  };

  // return (
  //   <Dialog open={open} onOpenChange={onOpenChange}>
  //     <DialogContent className="sm:max-w-[680px]">
  //       <DialogHeader>
  //         <DialogTitle>Адрес доставки</DialogTitle>
  //       </DialogHeader>

  //       <div className="space-y-4">
  //         {/* единое поле */}
  //         <div className="relative">
  //           <Label htmlFor="addr">Город, улица, дом, квартира</Label>
  //           <Input
  //             id="addr"
  //             value={query}
  //             onChange={(e) => setQuery(e.target.value)}
  //             placeholder="Например: Москва, Тверская, д. 10, кв. 25"
  //             onFocus={() => {
  //               // при фокусе, если нет точного совпадения — показывать список
  //             }}
  //           />
  //           {/* список подсказок */}
  //           {list.length > 0 && (
  //             <div className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow">
  //               {list.map((s) => (
  //                 <button key={s} type="button" className="block w-full px-3 py-2 text-left hover:bg-muted" onClick={() => handlePickFromList(s)}>
  //                   {s}
  //                 </button>
  //               ))}
  //             </div>
  //           )}
  //           {loading && <div className="mt-1 text-xs text-muted-foreground">Загрузка…</div>}
  //         </div>

  //         <Separator />

  //         {/* Доп поля */}
  //         <div className="grid gap-3 md:grid-cols-3">
  //           <div>
  //             <Label htmlFor="entrance">Подъезд</Label>
  //             <Input id="entrance" value={entrance} onChange={(e) => setEntrance(e.target.value)} />
  //           </div>
  //           <div>
  //             <Label htmlFor="floor">Этаж</Label>
  //             <Input id="floor" value={floor} onChange={(e) => setFloor(e.target.value)} />
  //           </div>
  //           <div>
  //             <Label htmlFor="comment">Комментарий</Label>
  //             <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
  //           </div>
  //         </div>
  //       </div>

  //       <DialogFooter className="gap-2">
  //         <Button variant="outline" onClick={() => onOpenChange(false)}>
  //           Отмена
  //         </Button>
  //         <Button onClick={handleConfirm} disabled={!canConfirm}>
  //           Сохранить
  //         </Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // );
  return <h2>Halo</h2>;
};
