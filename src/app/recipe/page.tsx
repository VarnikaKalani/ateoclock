"use client";

import { useState } from "react";
import Image from "next/image";

type Ingredient = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type StoreName = "Blinkit" | "Zepto" | "Amazon Fresh" | "BigBasket";

const INGREDIENTS: Ingredient[] = [
  { id: "acai",       name: "Organic Acai Base",  description: "Frozen, Unsweetened",  price: 12.50 },
  { id: "granola",    name: "House Granola",       description: "Almond & Cinnamon",    price: 8.00  },
  { id: "blueberry",  name: "Fresh Blueberries",   description: "Pint, Seasonal",       price: 4.50  },
  { id: "honey",      name: "Manuka Honey",        description: "Raw, 250g Jar",        price: 18.90 },
];

const STORE_MULTIPLIERS: Record<StoreName, number> = {
  Blinkit: 1,
  Zepto: 0.97,
  "Amazon Fresh": 1.05,
  BigBasket: 0.94,
};

const INTER_REGULAR = "var(--font-inter), sans-serif";

export default function RecipePage() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(INGREDIENTS.map((i) => [i.id, i.id === "acai" || i.id === "granola" ? 1 : 0]))
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedStore, setSelectedStore] = useState<StoreName | "">("");

  function adjust(id: string, delta: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, q[id] + delta) }));
  }

  const selectedItems = INGREDIENTS.filter((i) => quantities[i.id] > 0);
  const baseTotal = selectedItems.reduce((sum, i) => sum + i.price * quantities[i.id], 0);
  const itemCount = selectedItems.length;
  const storeNames = Object.keys(STORE_MULTIPLIERS) as StoreName[];
  const total = selectedStore ? baseTotal * STORE_MULTIPLIERS[selectedStore] : null;
  const proTipPrice = selectedStore ? 4 * STORE_MULTIPLIERS[selectedStore] : null;

  function formatPrice(value: number) {
    return `$${value.toFixed(2)}`;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F1E8C7", fontFamily: "var(--font-inter-tight), sans-serif", color: "#74823F" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "rgba(241,232,199,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(116,130,63,0.15)",
        padding: "0 16px",
      }}>
        <div style={{ maxWidth: 576, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 52 }}>
          <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontStyle: "italic", fontSize: "1.2rem", color: "#74823F", fontWeight: 700, letterSpacing: "-0.02em" }}>
            The Culinary Editorial
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              backgroundColor: "#F1E8C7",
              border: "1px solid rgba(116,130,63,0.3)",
              padding: "6px 12px",
              borderRadius: 9999,
              cursor: "pointer",
            }}>
              <span style={{ color: "#74823F", fontWeight: 700, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>DEMO</span>
            </div>
            <span style={{ fontSize: 24, color: "#74823F", cursor: "pointer" }}>&#9711;</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 576, margin: "0 auto", padding: "24px 16px 120px" }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(116,130,63,0.15)" }}>
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA3sAmRW-oOVu1KTNKhrNLJBLB6SqtNaiQ1gQUlfAsJUr67nz04iArTVINbtNLers4IWH3AGTZyDteM2Ljkyub-m1AR4h9cuoUwYi0qSwDMl59St6t_Peuz-XdML5btFmZPugrI0yTd3-x-Nzeh1lvzqP11zikll1h3NWK7rE-isU6KcmZNyDQtptuLDCGll76IYc-L-a6NEjygA9XUoEu7MT4-7XMFDcoNyixGnP-2X5Hz1hIMvesn6rIHItBn-cfqFK9NUvkHFjg"
              alt="Heritage Acai Bowl"
              width={80}
              height={80}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              unoptimized
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: INTER_REGULAR, fontWeight: 400, fontSize: "1.5rem", color: "#74823F", letterSpacing: "-0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Heritage Acai Bowl
            </h1>
            <p style={{ fontSize: "0.75rem", color: "#74823F", marginTop: 2 }}>Brazilian Berry Curation</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#74823F", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontWeight: 700, fontSize: "10px", color: "#74823F", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Pantry Selection
              </span>
            </div>
          </div>
        </header>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, padding: "0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#74823F" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: "2px solid #74823F",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", fontWeight: 700,
            }}>1</div>
            <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Ingredients
            </span>
          </div>
          <div style={{ flex: 1, height: 1, backgroundColor: "rgba(116,130,63,0.3)", margin: "0 16px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#74823F", opacity: step === 2 ? 1 : 0.5 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: "1px solid #74823F",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px",
            }}>2</div>
            <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Store
            </span>
          </div>
        </div>

        {/* Ingredients list */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "var(--font-inter-tight), sans-serif",
            fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.2em", color: "#74823F",
            marginBottom: 16, paddingLeft: 4,
          }}>
            Rapid Selection
          </h2>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: 24,
            border: "1px solid rgba(116,130,63,0.1)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}>
            {INGREDIENTS.map((item, idx) => {
              const qty = quantities[item.id];
              const isLast = idx === INGREDIENTS.length - 1;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px",
                    borderBottom: isLast ? "none" : "1px solid rgba(116,130,63,0.08)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#74823F" }}>{item.name}</h4>
                    <p style={{ fontSize: "11px", color: "#74823F", fontStyle: "italic", marginTop: 2 }}>{item.description}</p>
                  </div>

                  {/* Quantity stepper */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    backgroundColor: "#F1E8C7",
                    borderRadius: 9999,
                    padding: "4px",
                  }}>
                    <button
                      onClick={() => adjust(item.id, -1)}
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        border: "none",
                        backgroundColor: "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                        color: "#74823F",
                        fontSize: "18px",
                        transition: "transform 0.1s",
                      }}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.9)")}
                      onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      −
                    </button>
                    <span style={{ width: 16, textAlign: "center", fontSize: "12px", fontWeight: 700 }}>{qty}</span>
                    <button
                      onClick={() => adjust(item.id, 1)}
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        border: qty > 0 ? "none" : "1px solid rgba(116,130,63,0.4)",
                        backgroundColor: qty > 0 ? "#74823F" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                        color: qty > 0 ? "#ffffff" : "#74823F",
                        fontSize: "18px",
                        boxShadow: qty > 0 ? "0 2px 6px rgba(116,130,63,0.25)" : "none",
                        transition: "all 0.15s",
                      }}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.9)")}
                      onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {step === 1 ? (
          <section style={{
            backgroundColor: "#F1E8C7",
            borderRadius: 32,
            padding: "24px",
            border: "1px solid rgba(116,130,63,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, gap: 16 }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#74823F", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>
                  Items Selected ({itemCount})
                </span>
                <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#74823F" }}>
                  {itemCount > 0 ? "Pricing revealed after store selection" : "Add ingredients to continue"}
                </span>
              </div>
              <span style={{ fontSize: "10px", color: "rgba(116,130,63,0.6)", fontStyle: "italic", marginBottom: 4 }}>
                Pick your store next
              </span>
            </div>
            <button
              onClick={() => itemCount > 0 && setStep(2)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 9999,
                backgroundColor: itemCount > 0 ? "#74823F" : "#74823F",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                cursor: itemCount > 0 ? "pointer" : "not-allowed",
                boxShadow: itemCount > 0 ? "0 4px 16px rgba(116,130,63,0.3)" : "none",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <span>Choose Store</span>
              <span>→</span>
            </button>
          </section>
        ) : (
          <section style={{
            backgroundColor: "#F1E8C7",
            borderRadius: 32,
            padding: "24px",
            border: "1px solid rgba(116,130,63,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#74823F", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>
                  Review Selection
                </span>
                <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#74823F" }}>
                  Choose a store to unlock pricing
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#74823F",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Edit Items
              </button>
            </div>

            <div style={{
              backgroundColor: "#ffffff",
              borderRadius: 24,
              border: "1px solid rgba(116,130,63,0.12)",
              overflow: "hidden",
              marginBottom: 18,
            }}>
              {selectedItems.map((item, idx) => {
                const isLast = idx === selectedItems.length - 1;
                const lineTotal = selectedStore
                  ? item.price * quantities[item.id] * STORE_MULTIPLIERS[selectedStore]
                  : null;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 16px",
                      borderBottom: isLast ? "none" : "1px solid rgba(116,130,63,0.08)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#74823F" }}>{item.name}</div>
                      <div style={{ fontSize: "11px", color: "#74823F", opacity: 0.75, marginTop: 2 }}>Qty {quantities[item.id]}</div>
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#74823F", opacity: selectedStore ? 1 : 0.5, textTransform: selectedStore ? "none" : "uppercase", letterSpacing: selectedStore ? "normal" : "0.08em" }}>
                      {lineTotal === null ? "Hidden till store pick" : formatPrice(lineTotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#74823F", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 10 }}>
                Choose Store
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                {storeNames.map((store) => {
                  const isActive = selectedStore === store;
                  return (
                    <button
                      key={store}
                      type="button"
                      onClick={() => setSelectedStore(store)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 9999,
                        border: isActive ? "none" : "1px solid rgba(116,130,63,0.4)",
                        backgroundColor: isActive ? "#74823F" : "#ffffff",
                        color: isActive ? "#ffffff" : "#74823F",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        boxShadow: isActive ? "0 4px 16px rgba(116,130,63,0.22)" : "none",
                      }}
                    >
                      {store}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{
              backgroundColor: "#F1E8C7",
              borderRadius: 24,
              padding: "18px 20px",
              border: "1px solid rgba(116,130,63,0.18)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 16 }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#74823F", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: 4 }}>
                    Total{selectedStore ? ` via ${selectedStore}` : ""}
                  </span>
                  <span style={{ fontFamily: "var(--font-inter-tight), sans-serif", fontSize: selectedStore ? "1.875rem" : "1rem", fontWeight: 800, color: "#74823F", letterSpacing: selectedStore ? "-0.03em" : "0.08em", textTransform: selectedStore ? "none" : "uppercase", opacity: selectedStore ? 1 : 0.6 }}>
                    {total === null ? "Hidden till store pick" : formatPrice(total)}
                  </span>
                </div>
                <span style={{ fontSize: "10px", color: "rgba(116,130,63,0.6)", fontStyle: "italic", marginBottom: 4 }}>
                  Excl. Delivery
                </span>
              </div>
              <button
                disabled={!selectedStore || itemCount === 0}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 9999,
                  backgroundColor: selectedStore && itemCount > 0 ? "#74823F" : "#74823F",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: selectedStore && itemCount > 0 ? "pointer" : "not-allowed",
                  boxShadow: selectedStore && itemCount > 0 ? "0 4px 16px rgba(116,130,63,0.3)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {selectedStore ? `Checkout on ${selectedStore}` : "Select store to checkout"}
              </button>
            </div>
          </section>
        )}

        {/* Pro tip */}
        <div style={{
          marginTop: 32,
          display: "flex", alignItems: "center", gap: 16,
          backgroundColor: "#74823F",
          padding: 16,
          borderRadius: 16,
          color: "#ffffff",
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.6, marginBottom: 2 }}>Pro Tip</p>
            <p style={{ fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Pair with our Cold Brew for perfect balance.
            </p>
          </div>
          <button style={{
            marginLeft: "auto", flexShrink: 0,
            fontSize: "10px", fontWeight: 700,
            background: "none", border: "none",
            borderBottom: "1px solid rgba(241,232,199,0.4)",
            color: "#F1E8C7", cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            {proTipPrice === null ? "Add to order" : `Add ${formatPrice(proTipPrice)}`}
          </button>
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "rgba(241,232,199,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(116,130,63,0.1)",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "12px 16px",
        zIndex: 50,
      }}>
        {[
          { icon: "≡", label: "Pantry", active: true },
          { icon: "🧺", label: "Orders", active: false },
          { icon: "○", label: "Profile", active: false },
        ].map(({ icon, label, active }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
            <span style={{ fontSize: 20, color: active ? "#74823F" : "#74823F" }}>{icon}</span>
            <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: active ? "#74823F" : "#74823F" }}>
              {label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}
