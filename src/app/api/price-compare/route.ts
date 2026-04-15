const STORES = ["Blinkit", "Zepto", "Amazon", "BigBasket"] as const;

type Store = (typeof STORES)[number];

type RawPayload = {
  items?: unknown;
};

type InputItem = {
  name: string;
  qty?: string;
};

type StorePrice = {
  store: Store;
  price: number;
};

type ComparedItem = {
  name: string;
  qty?: string;
  storePrices: StorePrice[];
  bestStore: Store;
  bestPrice: number;
  secondBestPrice: number;
  savingsVsSecondBest: number;
};

const SAMPLE_PRICE_BOOK: Record<string, Record<Store, number>> = {
  tomato: { Blinkit: 28, Zepto: 34, Amazon: 39, BigBasket: 32 },
  onion: { Blinkit: 33, Zepto: 27, Amazon: 35, BigBasket: 31 },
  rice: { Blinkit: 92, Zepto: 95, Amazon: 86, BigBasket: 98 },
  bread: { Blinkit: 44, Zepto: 47, Amazon: 46, BigBasket: 40 },
  milk: { Blinkit: 58, Zepto: 60, Amazon: 55, BigBasket: 57 },
  egg: { Blinkit: 76, Zepto: 72, Amazon: 79, BigBasket: 75 },
  carrot: { Blinkit: 30, Zepto: 32, Amazon: 33, BigBasket: 29 },
  apple: { Blinkit: 88, Zepto: 92, Amazon: 90, BigBasket: 95 },
  banana: { Blinkit: 46, Zepto: 45, Amazon: 44, BigBasket: 48 },
  chicken: { Blinkit: 198, Zepto: 205, Amazon: 201, BigBasket: 194 },
};

const ITEM_ALIASES: Record<string, string> = {
  tomatoes: "tomato",
  onions: "onion",
  carrots: "carrot",
  eggs: "egg",
  apples: "apple",
  bananas: "banana",
  chickens: "chicken",
};

function normalizeItemKey(name: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

  return ITEM_ALIASES[normalized] ?? normalized;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function quantityModifier(qty?: string): number {
  if (!qty) {
    return 1;
  }

  const normalizedQty = qty.trim().toLowerCase();
  if (!normalizedQty) {
    return 1;
  }

  // Keep quantity influence deterministic but bounded to avoid unrealistic spikes.
  return 0.9 + (hashString(normalizedQty) % 12) / 10;
}

function basePriceForStore(itemKey: string, store: Store): number {
  const samplePrices = SAMPLE_PRICE_BOOK[itemKey];
  if (samplePrices) {
    return samplePrices[store];
  }

  const preferredStore = STORES[hashString(itemKey) % STORES.length];
  const seed = hashString(`${itemKey}:${store}`);
  let generated = 35 + (seed % 90);

  if (store === preferredStore) {
    generated -= 10;
  } else {
    generated += STORES.indexOf(store) * 2;
  }

  return Math.max(12, generated);
}

function mockPrice(itemKey: string, qty: string | undefined, store: Store): number {
  return round2(basePriceForStore(itemKey, store) * quantityModifier(qty));
}

function compareStorePrices(a: StorePrice, b: StorePrice): number {
  if (a.price !== b.price) {
    return a.price - b.price;
  }

  return STORES.indexOf(a.store) - STORES.indexOf(b.store);
}

function parsePayload(payload: unknown): { items: InputItem[] } | { error: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid payload: expected an object" };
  }

  const { items } = payload as RawPayload;
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Invalid payload: items must be a non-empty array" };
  }

  const parsedItems: InputItem[] = [];

  for (const entry of items) {
    if (!entry || typeof entry !== "object") {
      return { error: "Invalid payload: each item must be an object" };
    }

    const { name, qty } = entry as { name?: unknown; qty?: unknown };
    if (typeof name !== "string" || name.trim().length === 0) {
      return { error: "Invalid payload: each item.name must be a non-empty string" };
    }

    if (qty !== undefined && typeof qty !== "string") {
      return { error: "Invalid payload: item.qty must be a string when provided" };
    }

    const trimmedQty = typeof qty === "string" ? qty.trim() : undefined;
    parsedItems.push(
      trimmedQty
        ? { name: name.trim(), qty: trimmedQty }
        : { name: name.trim() },
    );
  }

  return { items: parsedItems };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parsePayload(payload);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const splitRecommendation: Partial<Record<Store, string[]>> = {};
  const singleStoreTotals: Record<Store, number> = {
    Blinkit: 0,
    Zepto: 0,
    Amazon: 0,
    BigBasket: 0,
  };

  const items: ComparedItem[] = parsed.items.map((item) => {
    const key = normalizeItemKey(item.name);
    const storePrices = STORES.map((store) => ({
      store,
      price: mockPrice(key, item.qty, store),
    })).sort(compareStorePrices);

    for (const storePrice of storePrices) {
      singleStoreTotals[storePrice.store] += storePrice.price;
    }

    const best = storePrices[0];
    const secondBest = storePrices[1] ?? best;

    if (!splitRecommendation[best.store]) {
      splitRecommendation[best.store] = [];
    }
    splitRecommendation[best.store]!.push(item.name);

    return {
      name: item.name,
      qty: item.qty,
      storePrices,
      bestStore: best.store,
      bestPrice: best.price,
      secondBestPrice: secondBest.price,
      savingsVsSecondBest: round2(Math.max(0, secondBest.price - best.price)),
    };
  });

  const splitTotal = round2(items.reduce((sum, item) => sum + item.bestPrice, 0));
  const bestSingleStore = STORES.map((store) => ({
    store,
    total: round2(singleStoreTotals[store]),
  })).sort((a, b) => a.total - b.total || STORES.indexOf(a.store) - STORES.indexOf(b.store))[0];

  return Response.json({
    items,
    splitRecommendation,
    totals: {
      splitTotal,
      bestSingleStore,
      savingsVsBestSingleStore: round2(
        Math.max(0, bestSingleStore.total - splitTotal),
      ),
    },
  });
}
