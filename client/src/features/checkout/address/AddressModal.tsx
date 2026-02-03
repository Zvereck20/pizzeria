import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Textarea } from "@/components";
import { useDebounced } from "@/hooks/useDebounce";
import { fetchAddressSuggest } from "./addressApi";
import type { AddressValue } from "./types";
import ReactModal from "react-modal";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultValue?: AddressValue | null;
  onConfirm: (addr: AddressValue) => void;
};

export const AddressModal: FC<Props> = ({
  open,
  onOpenChange,
  defaultValue,
  onConfirm,
}) => {
  const [query, setQuery] = useState(defaultValue?.display ?? "");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [selected, setSelected] = useState<any | null>(defaultValue?.source ?? null);
  const [comment, setComment] = useState(defaultValue?.comment ?? "");
  const [entrance, setEntrance] = useState(defaultValue?.entrance ?? "");
  const [floor, setFloor] = useState(defaultValue?.floor ?? "");

  const debounced = useDebounced(query, 350);

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

        if (res.mode === "match") {
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
    return !!selected;
  }, [selected, query]);

  const handleConfirm = () => {
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
    };

    onConfirm(addr);
  };

  return (
    <ReactModal
      isOpen={open}
      className={"modal__content"}
      overlayClassName={"modal__overlay"}
      closeTimeoutMS={500}
      preventScroll={true}
    >
      <div className="delivery">
        <h2 className="delivery__title">Адрес доставки</h2>

        <div className="delivery__container">
          <div className="delivery__address">
            <label htmlFor="addr">Город, улица, дом, квартира</label>
            <Input
              id="addr"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например: Москва, Тверская, д. 10, кв. 25"
              // onFocus={() => {
              //   // при фокусе, если нет точного совпадения — показывать список
              // }}
            />
            {list.length > 0 && (
              <div className="delivery__list">
                {list.map((address) => (
                  <button
                    key={address}
                    type="button"
                    className="delivery__item"
                    onClick={() => setQuery(address)}
                  >
                    {address}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="mt-1 text-xs text-muted-foreground">Загрузка…</div>
            )}
          </div>

          <ul className="delivery__inform">
            <li>
              <label htmlFor="entrance">Подъезд</label>
              <Input
                id="entrance"
                value={entrance}
                onChange={(e) => setEntrance(e.target.value)}
              />
            </li>
            <li>
              <label htmlFor="floor">Этаж</label>
              <Input
                id="floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </li>
            <li>
              <label htmlFor="comment">Комментарий</label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </li>
          </ul>
        </div>

        <div className="delivery__wrap">
          <Button variant="classic" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button variant="classic" onClick={handleConfirm} disabled={!canConfirm}>
            Сохранить
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};
