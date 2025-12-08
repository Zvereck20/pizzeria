export type AddressValue = {
  display: string;
  city: string | null;
  street: string | null;
  building: string | null;
  appartment?: string | null;
  entrance?: string | null;
  floor?: string | null;
  source?: any;
  comment?: string | null;
};

export type RawItem = {
  value: string;
  city?: string;
  street?: string;
  house?: string;
  [k: string]: any;
};

export type SuggestResult =
  | { mode: "match"; match: RawItem } // точное совпадение
  | { mode: "list"; suggestions: string[] } // массив value для подсказок
  | { mode: "empty" };
