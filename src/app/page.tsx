'use client'
import { useState, useEffect, useRef } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'

const RED   = '#962d49'
const CREAM = '#f3eac3'
const RED2  = '#b8455f'
const BG    = '#fdf8ee'
const WHITE = '#ffffff'

type SplitBasket = {
  store: string
  eta: string
  subtotal: number
  deliveryFee: number
  items: string[]
}

type SplitPlan = {
  id: string
  label: string
  hint: string
  reason: string
  tag: string
  baskets: SplitBasket[]
  singleStoreEstimate: number
}

const SPLIT_CHECKOUT_PLANS: SplitPlan[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    hint: '2 checkouts',
    reason: 'Most people start here: fewer carts, lower total, and clean handoff between stores.',
    tag: 'Most popular',
    baskets: [
      {
        store: 'Blinkit',
        eta: '18 min',
        subtotal: 214,
        deliveryFee: 26,
        items: ['Black lentils', 'Butter', 'Fresh cream'],
      },
      {
        store: 'Zepto',
        eta: '24 min',
        subtotal: 148,
        deliveryFee: 20,
        items: ['Vine tomatoes', 'Onion', 'Garam masala'],
      },
    ],
    singleStoreEstimate: 448,
  },
  {
    id: 'fastest',
    label: 'Fastest tonight',
    hint: '3 checkouts',
    reason: 'Pushes produce and dairy to the quickest stores so prep can begin sooner.',
    tag: 'Lowest ETA',
    baskets: [
      {
        store: 'Blinkit',
        eta: '14 min',
        subtotal: 128,
        deliveryFee: 24,
        items: ['Butter', 'Fresh cream'],
      },
      {
        store: 'Instamart',
        eta: '16 min',
        subtotal: 151,
        deliveryFee: 18,
        items: ['Black lentils', 'Onion'],
      },
      {
        store: 'Zepto',
        eta: '19 min',
        subtotal: 109,
        deliveryFee: 16,
        items: ['Vine tomatoes', 'Green chili', 'Coriander'],
      },
    ],
    singleStoreEstimate: 471,
  },
  {
    id: 'lowest-total',
    label: 'Lowest bill',
    hint: '3 checkouts',
    reason: 'Splits across three stores to reduce total amount for cost-sensitive orders.',
    tag: 'Best value',
    baskets: [
      {
        store: 'Zepto',
        eta: '22 min',
        subtotal: 166,
        deliveryFee: 18,
        items: ['Black lentils', 'Vine tomatoes', 'Coriander'],
      },
      {
        store: 'Blinkit',
        eta: '20 min',
        subtotal: 94,
        deliveryFee: 22,
        items: ['Butter', 'Fresh cream'],
      },
      {
        store: 'BigBasket',
        eta: '40 min',
        subtotal: 101,
        deliveryFee: 8,
        items: ['Onion', 'Garam masala'],
      },
    ],
    singleStoreEstimate: 462,
  },
]

function formatRs(price: number) {
  return `Rs ${Math.round(price)}`
}

function useCounter(target: number, duration = 1600, trigger: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start: number
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [trigger, target, duration])
  return val
}

function useVisible(ref: React.RefObject<HTMLElement | null>) {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.25 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return vis
}

function Logo({ size = 20 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1 }}>
      <span style={{ color: RED }}>Cook</span><span style={{ color: RED2 }}>d</span>
    </span>
  )
}

const STORES = [
  { name: 'Blinkit',          logo: '/logos/blinkit.svg' },
  { name: 'Amazon',           logo: '/logos/amazon.svg' },
  { name: 'Zepto',            logo: '/logos/zepto.png' },
  { name: 'Flipkart',         logo: '/logos/flipkart.svg' },
  { name: 'BigBasket',        logo: '/logos/bigbasket.png' },
  { name: 'JioMart',          logo: '/logos/jiomart.png' },
  { name: 'Swiggy Instamart', logo: '/logos/swiggy.svg' },
  { name: 'eBay',             logo: '/logos/ebay.svg' },
]

export default function Home() {
  const [tab, setTab]           = useState<'cook' | 'creator'>('cook')
  const [openStep, setOpenStep] = useState<number | null>(0)
  const [cartFill, setCartFill] = useState(0)
  const [hovered, setHovered]   = useState<string | null>(null)
  const [heroEmail, setHeroEmail]   = useState('')
  const [footerEmail, setFooterEmail] = useState('')
  const [joined, setJoined]         = useState(false)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [aboutPhase, setAboutPhase] = useState(0) // 0=camera roll, 1=selected, 2=cart
  const [checkoutPreset, setCheckoutPreset] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const statsRef                = useRef<HTMLDivElement>(null)
  const statsVis                = useVisible(statsRef)
  const c1 = useCounter(4200, 1800, statsVis)
  const c2 = useCounter(38,   1400, statsVis)
  const c3 = useCounter(96,   1600, statsVis)

  useEffect(() => {
    const t = setInterval(() => setCartFill(n => (n >= 4 ? 0 : n + 1)), 800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const durations = [2200, 2000, 2800]
    let phase = 0
    const tick = () => {
      phase = (phase + 1) % 3
      setAboutPhase(phase)
    }
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => { timer = setTimeout(() => { tick(); schedule() }, durations[phase]) }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  // Fetch initial count + subscribe to live inserts
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setWaitlistCount(count ?? 0))

    const channel = supabase
      .channel('waitlist-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waitlist' }, () => {
        setWaitlistCount(c => (c ?? 0) + 1)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function join(source: 'hero' | 'footer') {
    const email = source === 'hero' ? heroEmail : footerEmail
    if (!email.includes('@')) return
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) return

    setJoined(true)
    if (source === 'hero') setHeroEmail('')
    if (source === 'footer') setFooterEmail('')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file.name)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file.name)
  }

  function scrollToWaitlist() {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setNavOpen(false)
  }

  const recipes = [
    { name: 'Dal Makhani', by: '@priyacooks', time: '45 min', tag: 'Vegetarian' },
    { name: 'Acai Bowl',   by: '@healthybowl', time: '10 min', tag: 'Healthy' },
    { name: 'Mango Lassi', by: '@spicelab',   time: '5 min',  tag: 'Drink' },
  ]

  const activeCheckoutPlan = SPLIT_CHECKOUT_PLANS[checkoutPreset] ?? SPLIT_CHECKOUT_PLANS[0]
  const splitCheckoutSubtotal = activeCheckoutPlan.baskets.reduce((sum, basket) => sum + basket.subtotal, 0)
  const splitCheckoutFees = activeCheckoutPlan.baskets.reduce((sum, basket) => sum + basket.deliveryFee, 0)
  const splitCheckoutTotal = splitCheckoutSubtotal + splitCheckoutFees
  const splitCheckoutSavings = Math.max(activeCheckoutPlan.singleStoreEstimate - splitCheckoutTotal, 0)
  const splitStoreLabel = activeCheckoutPlan.baskets.map((basket) => basket.store).join(' + ')
  const primaryStore = 'Blinkit'

  const steps = [
    {
      label: 'Find a recipe you love',
      sub: 'Browse recipes shared by real food creators on social media or right here on Cookd.',
      visual: (
        <div style={{ width: '100%', animation: 'fadeUp .4s ease' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: RED, opacity: .4, marginBottom: 16 }}>Trending now</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recipes.map(r => (
              <div key={r.name}
                onMouseEnter={() => setHovered(r.name)} onMouseLeave={() => setHovered(null)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: hovered === r.name ? `rgba(150,45,73,.05)` : BG, border: '1px solid rgba(150,45,73,.07)', cursor: 'pointer', transition: 'background .15s' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: RED }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: RED, opacity: .5 }}>{r.by} · {r.time}</div>
                </div>
                <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 999, background: `rgba(150,45,73,.08)`, color: RED, fontWeight: 600 }}>{r.tag}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: 'Save it to your list',
      sub: 'One tap saves the recipe and pulls every ingredient into your personal pantry list.',
      visual: (
        <div style={{ width: '100%', animation: 'fadeUp .4s ease' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: RED, marginBottom: 4 }}>Dal Makhani</div>
          <div style={{ fontSize: 12, color: RED, opacity: .5, marginBottom: 20 }}>Saved from @priyacooks</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Black lentils 200g', 'Butter 2 tbsp', 'Tomatoes 3', 'Cream 100ml', 'Garam masala 1 tsp'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, animation: `slideIn .3s ease ${i * 0.06}s both` }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, opacity: .4, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: RED, opacity: .7 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: 'Order in 60 seconds',
      sub: 'Pick a preset and preview how one recipe can checkout across Blinkit, Zepto, and more in one guided flow.',
      visual: (
        <div className="split-checkout-demo" style={{ width: '100%', animation: 'fadeUp .4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: RED, opacity: .46 }}>Cart ready — 6 ingredients</div>
            <span style={{ fontSize: 10, fontWeight: 600, color: RED, opacity: .65, padding: '3px 8px', borderRadius: 999, border: '1px solid rgba(150,45,73,.17)', background: 'rgba(150,45,73,.05)' }}>
              Landing preview
            </span>
          </div>

          <div className="split-preset-row">
            {SPLIT_CHECKOUT_PLANS.map((plan, idx) => {
              const active = idx === checkoutPreset
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setCheckoutPreset(idx)}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${active ? RED : 'rgba(150,45,73,.14)'}`,
                    padding: '9px 10px',
                    textAlign: 'left',
                    background: active ? 'rgba(150,45,73,.1)' : WHITE,
                    color: RED,
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{plan.label}</div>
                  <div style={{ fontSize: 10, opacity: .55, marginTop: 3 }}>{plan.hint}</div>
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ fontSize: 11, color: RED, opacity: .6, lineHeight: 1.55, maxWidth: 400 }}>{activeCheckoutPlan.reason}</div>
            <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: RED, borderRadius: 999, background: 'rgba(150,45,73,.08)', padding: '5px 10px' }}>
              {activeCheckoutPlan.tag}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {['Black lentils', 'Butter', 'Vine tomatoes', 'Fresh cream', 'Onion', 'Spice mix'].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: RED,
                  opacity: .6,
                  borderRadius: 999,
                  background: 'rgba(150,45,73,.06)',
                  border: '1px solid rgba(150,45,73,.1)',
                  padding: '4px 10px',
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <div key={activeCheckoutPlan.id} className="split-scene">
            <div className="split-cards">
              {activeCheckoutPlan.baskets.map((basket, idx) => (
                <div key={`${activeCheckoutPlan.id}-${basket.store}`} className="split-card" style={{ animationDelay: `${idx * 90}ms` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: RED }}>{basket.store}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: RED, opacity: .5 }}>{basket.eta}</div>
                  </div>
                  <div style={{ fontSize: 10, color: RED, opacity: .55, lineHeight: 1.45, minHeight: 28 }}>
                    {basket.items.join(', ')}
                  </div>
                  <div style={{ borderTop: '1px solid rgba(150,45,73,.1)', marginTop: 10, paddingTop: 8, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 9, color: RED, opacity: .45 }}>Subtotal</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: RED }}>{formatRs(basket.subtotal)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, color: RED, opacity: .45 }}>Delivery</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: RED }}>{formatRs(basket.deliveryFee)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="split-flow">
              {activeCheckoutPlan.baskets.map((basket, idx) => (
                <div key={`flow-${basket.store}`} className="split-flow-node">
                  <span>{basket.store}</span>
                  {idx < activeCheckoutPlan.baskets.length - 1 && <span className="split-flow-dot" />}
                </div>
              ))}
              <span className="split-flow-end">Checkout sequence</span>
            </div>
          </div>

          <div className="split-summary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, color: RED, opacity: .5 }}>Split checkout total</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: RED }}>{formatRs(splitCheckoutTotal)}</span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, color: RED, opacity: .5 }}>Single-store estimate</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: RED, opacity: .75 }}>{formatRs(activeCheckoutPlan.singleStoreEstimate)}</span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, color: RED, opacity: .5 }}>Subtotal + delivery</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: RED }}>{formatRs(splitCheckoutSubtotal)} + {formatRs(splitCheckoutFees)}</span>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '13px 0', background: RED, borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 700, color: CREAM }}>
            Split checkout: {splitStoreLabel}
          </div>
          <div style={{ marginTop: 6, textAlign: 'center', fontSize: 10, color: RED, opacity: .55 }}>
            Potential savings in this preview: {formatRs(splitCheckoutSavings)}. Final delivery-fee optimization ships later.
          </div>
        </div>
      ),
    },
  ]

  const ingredients = ['Black lentils', 'Vine tomatoes', 'Butter', 'Heavy cream']

  return (
    <main style={{ background: BG, color: RED, fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes floatUp   { 0%,100% { transform: translateY(0); }   50% { transform: translateY(-12px); } }
        @keyframes floatDown { 0%,100% { transform: translateY(0); }   50% { transform: translateY(10px); } }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn   { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes pulse     { 0%,100% { opacity:1; transform:scale(1); }  50% { opacity:.6; transform:scale(.94); } }
        @keyframes barGrow   { from { width:0; } }
        @keyframes accordionOpen { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes splitSceneIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes splitCardIn { from { opacity:0; transform:translateY(10px) scale(.99); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes splitPulse { 0%,100% { transform:scale(.9); opacity:.45; } 50% { transform:scale(1.2); opacity:1; } }
        @keyframes splitGlow { 0%,100% { box-shadow: inset 0 0 0 0 rgba(150,45,73,0); } 50% { box-shadow: inset 0 0 0 1px rgba(150,45,73,.16); } }

        .float-a { animation: floatUp   5s ease-in-out infinite; }
        .float-b { animation: floatDown 6s ease-in-out infinite 1s; }
        .fade-up { animation: fadeUp .65s ease both; }
        .card-hover { transition: transform .2s, box-shadow .2s; cursor: pointer; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(150,45,73,.14); }

        .grid-bg {
          background-image:
            linear-gradient(rgba(150,45,73,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(150,45,73,.05) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        input:focus { outline:none; box-shadow: 0 0 0 3px rgba(150,45,73,.18); }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background: rgba(150,45,73,.2); border-radius:3px; }

        .store-pill {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1.5px solid rgba(150,45,73,.18);
          font-size: 12px;
          font-weight: 600;
          color: ${RED};
          background: ${WHITE};
          margin: 4px;
          transition: all .15s;
        }
        .store-pill:hover { background: ${RED}; color: ${CREAM}; border-color: ${RED}; }

        .drop-zone {
          border: 2px dashed rgba(150,45,73,.25);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all .2s;
          background: ${WHITE};
        }
        .drop-zone.over {
          border-color: ${RED};
          background: rgba(150,45,73,.04);
        }
        .drop-zone:hover {
          border-color: rgba(150,45,73,.45);
        }

        .nav-desktop {
          display: flex;
          gap: 28px;
          align-items: center;
        }
        .nav-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid rgba(150,45,73,.2);
          background: ${WHITE};
          color: ${RED};
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .nav-mobile {
          display: none;
        }
        .nav-mobile-link {
          font-size: 13px;
          font-weight: 600;
          color: ${RED};
          text-decoration: none;
          opacity: .75;
          padding: 4px 0;
        }

        .how-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .how-panel {
          position: sticky;
          top: 88px;
        }

        .split-preset-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        .split-scene {
          margin-top: 12px;
          animation: splitSceneIn .35s ease both;
        }
        .split-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 10px;
        }
        .split-card {
          border: 1px solid rgba(150,45,73,.12);
          border-radius: 12px;
          padding: 12px;
          background: ${WHITE};
          animation: splitCardIn .32s ease both;
        }
        .split-flow {
          margin-top: 10px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px 10px;
        }
        .split-flow-node {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(150,45,73,.72);
        }
        .split-flow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(150,45,73,.55);
          animation: splitPulse 1.4s ease-in-out infinite;
        }
        .split-flow-end {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          color: ${RED};
          background: rgba(150,45,73,.07);
          border: 1px solid rgba(150,45,73,.14);
          border-radius: 999px;
          padding: 4px 10px;
        }
        .split-summary {
          margin-top: 12px;
          padding: 11px 12px;
          border: 1px solid rgba(150,45,73,.14);
          border-radius: 10px;
          background: rgba(150,45,73,.03);
          animation: splitGlow 2.8s ease-in-out infinite;
        }

        @media (max-width: 980px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .how-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .how-panel {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 860px) {
          .nav-desktop {
            display: none;
          }
          .nav-toggle {
            display: inline-flex;
          }
          .nav-mobile {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0 0 14px;
          }
        }

        @media (max-width: 640px) {
          .split-preset-row {
            grid-template-columns: 1fr;
          }
          .split-cards {
            grid-template-columns: 1fr;
          }
          .split-flow-end {
            margin-left: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
          }
          .split-scene,
          .split-card,
          .split-flow-dot,
          .split-summary {
            animation: none !important;
          }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(253,248,238,.95)', backdropFilter: 'blur(16px)', boxShadow: '0 2px 16px rgba(0,0,0,.07)', padding: '0 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo size={22} />
            <div className="nav-desktop">
              {['How it works', 'For creators', 'About'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                  style={{ fontSize: 13, fontWeight: 500, color: RED, opacity: .65, textDecoration: 'none', transition: 'opacity .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '.65')}
                >{l}</a>
              ))}
              <button onClick={scrollToWaitlist}
                style={{ padding: '9px 22px', borderRadius: 8, background: RED, color: CREAM, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity .15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Join waitlist</button>
            </div>

            <button
              type="button"
              className="nav-toggle"
              aria-expanded={navOpen}
              aria-controls="mobile-menu"
              onClick={() => setNavOpen((open) => !open)}
            >
              {navOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          {navOpen && (
            <div id="mobile-menu" className="nav-mobile">
              {['How it works', 'For creators', 'About'].map(l => (
                <a
                  key={`mobile-${l}`}
                  href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                  className="nav-mobile-link"
                  onClick={() => setNavOpen(false)}
                >
                  {l}
                </a>
              ))}
              <button
                type="button"
                onClick={scrollToWaitlist}
                style={{ marginTop: 2, width: '100%', padding: '10px 14px', borderRadius: 8, background: RED, color: CREAM, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Join waitlist
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="grid-bg" style={{ display: 'flex', alignItems: 'center', padding: '72px 28px' }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>

          <div>
            <div className="fade-up" style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .5, marginBottom: 18 }}>
              Early access
            </div>
            <h1 className="fade-up" style={{ fontSize: 'clamp(2.6rem,4.5vw,3.8rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', color: RED, marginBottom: 20 }}>
              From saved recipe<br />to groceries ordered.
            </h1>
            <p className="fade-up" style={{ fontSize: 16, color: RED, opacity: .65, lineHeight: 1.75, maxWidth: 400, marginBottom: 36 }}>
              Cookd pulls ingredients from any recipe, builds your cart, and checks out across stores like Blinkit and Zepto in one guided flow.
            </p>
            {joined ? (
              <div className="fade-up" style={{ marginTop: 4 }}>
                <p style={{ fontSize: 15, color: RED, fontWeight: 600 }}>You are on the list.</p>
                <p style={{ fontSize: 13, color: RED, opacity: .5, marginTop: 6 }}>We will reach out before launch.</p>
              </div>
            ) : (
              <>
                <div id="waitlist-form" className="fade-up" style={{ display: 'flex', gap: 10, maxWidth: 420 }}>
                  <input type="email" value={heroEmail} onChange={e => setHeroEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && join('hero')}
                    placeholder="your@email.com"
                    style={{ flex: 1, height: 48, padding: '0 16px', borderRadius: 10, border: `1.5px solid rgba(150,45,73,.22)`, background: WHITE, color: RED, fontSize: 14 }}
                  />
                  <button onClick={() => join('hero')}
                    style={{ height: 48, padding: '0 24px', borderRadius: 10, background: RED, color: CREAM, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >Get early access</button>
                </div>
                {waitlistCount !== null && waitlistCount > 0 && (
                  <p className="fade-up" style={{ fontSize: 14, color: RED, opacity: .6, marginTop: 12 }}>
                    Join <span style={{ color: RED, fontWeight: 700, opacity: 1 }}>{waitlistCount.toLocaleString()}</span> others on the waitlist.
                  </p>
                )}
                <p style={{ fontSize: 12, color: RED, opacity: .3, marginTop: 6 }}>You can unsubscribe any time.</p>
              </>
            )
            }
          </div>

          {/* Animated mockup */}
          <div style={{ position: 'relative', height: 440 }}>
            <div className="card-hover float-a" style={{ position: 'absolute', top: 16, left: 0, width: 250, background: WHITE, borderRadius: 18, padding: 22, boxShadow: '0 8px 36px rgba(150,45,73,.1)', border: '1px solid rgba(150,45,73,.07)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 10 }}>Saved recipe</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: RED, marginBottom: 4 }}>Dal Makhani</div>
              <div style={{ fontSize: 12, color: RED, opacity: .5, marginBottom: 14 }}>by @priyacooks</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['45 min', 'Serves 4', 'Vegetarian'].map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: `rgba(150,45,73,.07)`, color: RED, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="card-hover float-b" style={{ position: 'absolute', bottom: 16, right: 0, width: 230, background: WHITE, borderRadius: 18, padding: 20, boxShadow: '0 8px 36px rgba(150,45,73,.1)', border: '1px solid rgba(150,45,73,.07)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 12 }}>Cart ready</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {ingredients.map((item, i) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i < cartFill ? 1 : .2, transition: 'opacity .3s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: i < cartFill ? RED : `rgba(150,45,73,.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .3s' }}>
                      {i < cartFill && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke={CREAM} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <span style={{ fontSize: 13, color: RED, fontWeight: i < cartFill ? 500 : 400 }}>{item}</span>
                  </div>
                ))}
              </div>
              {cartFill >= 4 && (
                <div style={{ marginTop: 14, padding: '10px 0', background: RED, borderRadius: 8, textAlign: 'center', fontSize: 12, fontWeight: 700, color: CREAM, animation: 'fadeUp .3s ease' }}>
                  Order on {primaryStore}
                </div>
              )}
            </div>

            <div className="hero-pulse" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: RED, borderRadius: 999, padding: '10px 20px', boxShadow: '0 4px 20px rgba(150,45,73,.3)', animation: 'pulse 2.4s ease-in-out infinite' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: CREAM, whiteSpace: 'nowrap' }}>1 tap</span>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS WITH — scrolling marquee */}
      <section style={{ background: WHITE, padding: '32px 0', borderTop: `1px solid rgba(150,45,73,.07)`, overflow: 'hidden' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 24, textAlign: 'center' }}>Works with</p>
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${WHITE}, transparent)`, zIndex: 2 }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left, ${WHITE}, transparent)`, zIndex: 2 }} />
          <div className="marquee-track" style={{ display: 'flex', animation: 'marquee 22s linear infinite', width: 'max-content' }}>
            {[...STORES, ...STORES].map((s, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', margin: '0 6px', borderRadius: 999, border: `1.5px solid rgba(150,45,73,.15)`, fontSize: 13, fontWeight: 600, color: RED, whiteSpace: 'nowrap', background: WHITE }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.logo} alt={s.name} width={24} height={24} style={{ borderRadius: 4, objectFit: 'contain', flexShrink: 0 }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS COOKD */}
      <section id="about" style={{ background: `radial-gradient(ellipse at 65% 40%, rgba(150,45,73,.07) 0%, transparent 55%), ${BG}`, padding: '64px 28px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 72, flexWrap: 'wrap' }}>

          {/* Left: text + upload */}
          <div style={{ flex: '1 1 340px', minWidth: 280 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,2.4vw,2.2rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, marginBottom: 20, lineHeight: 1.2 }}>
              You screenshot recipes.<br />They disappear into your camera roll.
            </h2>
            <p style={{ fontSize: 16, color: RED, opacity: .6, lineHeight: 1.8, marginBottom: 24 }}>
              You saw it on social media. You saved it. But three weeks later it is buried under 400 other screenshots and you are ordering takeout again.
            </p>
            <p style={{ fontSize: 16, color: RED, opacity: .6, lineHeight: 1.8, marginBottom: 28 }}>
              Cookd fixes that. Find a recipe, tap once, and every ingredient lands in your cart. No searching, no copying, no forgetting.
            </p>
            {/* Upload zone */}
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 10 }}>Start here</p>
            <label htmlFor="screenshot-input" style={{ display: 'block' }}>
              <div
                className={`drop-zone${dragOver ? ' over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `rgba(150,45,73,.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: RED, marginBottom: 4 }}>{uploadedFile}</div>
                    <div style={{ fontSize: 11, color: RED, opacity: .45 }}>We have got it. We will build your list on launch.</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `rgba(150,45,73,.07)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: RED, marginBottom: 4 }}>Drop your screenshot here</div>
                    <div style={{ fontSize: 11, color: RED, opacity: .45 }}>or click to browse</div>
                  </div>
                )}
              </div>
            </label>
            <input id="screenshot-input" type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} />
          </div>

          {/* Right: animated phone mockup */}
          <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* iPhone shell */}
            <div style={{ position: 'relative', width: 248, background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 40%, #111 100%)', borderRadius: 52, padding: '12px 7px', boxShadow: '0 40px 100px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.08), inset 0 0 0 1px rgba(255,255,255,.04)' }}>
              {/* Side button - right */}
              <div style={{ position: 'absolute', right: -3, top: 100, width: 3, height: 60, background: '#333', borderRadius: '0 2px 2px 0' }} />
              {/* Volume buttons - left */}
              <div style={{ position: 'absolute', left: -3, top: 80, width: 3, height: 32, background: '#333', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -3, top: 122, width: 3, height: 32, background: '#333', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -3, top: 164, width: 3, height: 32, background: '#333', borderRadius: '2px 0 0 2px' }} />
              {/* Screen bezel */}
              <div style={{ background: '#000', borderRadius: 44, overflow: 'hidden', position: 'relative' }}>
                {/* Dynamic Island */}
                <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 88, height: 26, background: '#000', borderRadius: 20, zIndex: 10 }} />
                {/* Status bar spacer */}
                <div style={{ height: 48 }} />
              {/* Screen */}
              <div style={{ background: WHITE, borderRadius: 0, overflow: 'hidden', minHeight: 380, position: 'relative' }}>

                {/* Phase label bar */}
                <div style={{ padding: '10px 14px', background: BG, borderBottom: `1px solid rgba(150,45,73,.1)`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, opacity: .5 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.08em', color: RED, opacity: .5, textTransform: 'uppercase' }}>
                    {aboutPhase === 0 ? 'Camera Roll' : aboutPhase === 1 ? 'Recipe found' : 'Adding to cart'}
                  </span>
                </div>

                {/* Phase 0: cluttered camera roll */}
                {aboutPhase === 0 && (
                  <div style={{ padding: 8, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, animation: 'fadeUp .35s ease both' }}>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} style={{
                        aspectRatio: '1', borderRadius: 6, overflow: 'hidden',
                        background: [
                          `rgba(150,45,73,.08)`, `rgba(150,45,73,.12)`, `rgba(243,234,195,.8)`,
                          `rgba(150,45,73,.06)`, `rgba(243,234,195,.6)`, `rgba(150,45,73,.14)`,
                        ][i % 6],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18
                      }}>
                        {['🍝','📸','🥗','📸','🍜','📸','🍕','📸','🥘','📸','🍛','📸','🥙','📸','🍲'][i]}
                      </div>
                    ))}
                  </div>
                )}

                {/* Phase 1: one recipe highlighted */}
                {aboutPhase === 1 && (
                  <div style={{ padding: 8, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, animation: 'fadeUp .35s ease both' }}>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} style={{
                        aspectRatio: '1', borderRadius: 6, overflow: 'hidden',
                        background: i === 4 ? BG : `rgba(150,45,73,.05)`,
                        opacity: i === 4 ? 1 : 0.28,
                        outline: i === 4 ? `2.5px solid ${RED}` : 'none',
                        transform: i === 4 ? 'scale(1.07)' : 'scale(1)',
                        transition: 'all .3s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: i === 4 ? 22 : 16
                      }}>
                        {i === 4 ? '🍜' : ['🍝','📸','🥗','📸','🍜','📸','🍕','📸','🥘','📸','🍛','📸','🥙','📸','🍲'][i]}
                      </div>
                    ))}
                  </div>
                )}

                {/* Phase 2: cart being built */}
                {aboutPhase === 2 && (
                  <div style={{ padding: '14px', animation: 'fadeUp .35s ease both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 18 }}>🍜</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: RED }}>Thai Noodle Soup</div>
                        <div style={{ fontSize: 9, color: RED, opacity: .5 }}>Adding ingredients to cart...</div>
                      </div>
                    </div>
                    {[
                      { label: 'Rice noodles', qty: '200g', delay: 0 },
                      { label: 'Coconut milk', qty: '400ml', delay: 150 },
                      { label: 'Lemongrass', qty: '2 stalks', delay: 300 },
                      { label: 'Thai basil', qty: '1 bunch', delay: 450 },
                      { label: 'Tofu', qty: '250g', delay: 600 },
                    ].map((item) => (
                      <div key={item.label} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 10px', marginBottom: 4, borderRadius: 8,
                        background: `rgba(150,45,73,.05)`,
                        animation: `fadeUp .4s ease ${item.delay}ms both`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: WHITE, fontSize: 8, fontWeight: 900 }}>✓</span>
                          </div>
                          <span style={{ fontSize: 11, color: RED, fontWeight: 500 }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: 10, color: RED, opacity: .45 }}>{item.qty}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: '9px 14px', borderRadius: 10, background: RED, textAlign: 'center' }}>
                      <span style={{ fontSize: 11, color: WHITE, fontWeight: 700 }}>Added to {primaryStore} cart</span>
                    </div>
                  </div>
                )}
              </div>
              </div>{/* /screen bezel */}
            </div>{/* /iPhone shell */}

            {/* Phase dots */}
            <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: i === aboutPhase ? 20 : 6, height: 6, borderRadius: 3, background: RED, opacity: i === aboutPhase ? 1 : .2, transition: 'all .4s ease' }} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: WHITE, padding: '64px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 12, textAlign: 'center' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, textAlign: 'center', marginBottom: 36 }}>
            Three steps. Done.
          </h2>

          <div className="how-grid">
            {/* Accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {steps.map((s, i) => (
                <div key={i}
                  onClick={() => setOpenStep(openStep === i ? null : i)}
                  style={{ borderRadius: 16, cursor: 'pointer', background: openStep === i ? RED : WHITE, border: `1.5px solid ${openStep === i ? RED : 'rgba(150,45,73,.1)'}`, transition: 'all .25s', overflow: 'hidden' }}
                  onMouseEnter={e => { if (openStep !== i) e.currentTarget.style.borderColor = 'rgba(150,45,73,.3)' }}
                  onMouseLeave={e => { if (openStep !== i) e.currentTarget.style.borderColor = 'rgba(150,45,73,.1)' }}
                >
                  {/* Header row - always visible */}
                  <div style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: openStep === i ? CREAM : `rgba(150,45,73,.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: RED }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: openStep === i ? CREAM : RED }}>{s.label}</div>
                    </div>
                    <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: openStep === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .25s' }}>
                        <path d="M2 4L6 8L10 4" stroke={openStep === i ? CREAM : RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {openStep === i && (
                    <div style={{ padding: '0 24px 22px', animation: 'accordionOpen .2s ease' }}>
                      <div style={{ fontSize: 13, color: CREAM, opacity: .75, lineHeight: 1.65 }}>{s.sub}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Step visual panel */}
            <div className="how-panel" style={{ background: BG, borderRadius: 20, padding: 32, border: `1px solid rgba(150,45,73,.07)`, minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {openStep !== null ? steps[openStep].visual : (
                <div style={{ textAlign: 'center', color: RED, opacity: .3, fontSize: 14 }}>Click a step to see how it works</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOR COOK / CREATOR TABS */}
      <section id="for-creators" style={{ background: BG, padding: '64px 28px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 52 }}>
            <div style={{ display: 'flex', background: WHITE, borderRadius: 12, padding: 4, border: `1px solid rgba(150,45,73,.1)` }}>
              {(['cook', 'creator'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '10px 28px', borderRadius: 9, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all .2s', background: tab === t ? RED : 'transparent', color: tab === t ? CREAM : RED, opacity: tab === t ? 1 : .55 }}
                >{t === 'cook' ? 'I want to cook' : 'I create content'}</button>
              ))}
            </div>
          </div>

          {tab === 'cook' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', animation: 'fadeUp .4s ease' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, marginBottom: 16, lineHeight: 1.2 }}>
                  Your cart, filled in one tap. Delivered tonight.
                </h2>
                <p style={{ fontSize: 15, color: RED, opacity: .6, lineHeight: 1.8, marginBottom: 28 }}>
                  Pick a recipe, choose your store, and checkout. Every ingredient arrives the same evening, nothing to copy, nothing to type.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Free to use, always', 'Works with Blinkit, Zepto, Amazon Fresh and more', 'Scale servings and the list updates automatically'].map(pt => (
                    <div key={pt} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke={CREAM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontSize: 14, color: RED, opacity: .7, lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: WHITE, borderRadius: 20, padding: 28, border: `1px solid rgba(150,45,73,.08)` }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: RED, marginBottom: 18 }}>Dal Makhani cook mode</div>
                <div style={{ fontSize: 11, color: RED, opacity: .4, marginBottom: 8 }}>Step 3 of 8</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: RED, marginBottom: 10 }}>Saute onions until golden</div>
                <div style={{ fontSize: 13, color: RED, opacity: .6, lineHeight: 1.65, marginBottom: 20 }}>
                  Heat butter in a heavy pan over medium heat. Add onions and cook 12 to 15 min until deep golden. Stir occasionally.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, padding: '11px 0', background: RED, borderRadius: 8, textAlign: 'center', fontSize: 13, fontWeight: 700, color: CREAM }}>15:00</div>
                  <div style={{ flex: 1, padding: '11px 0', background: `rgba(150,45,73,.08)`, borderRadius: 8, textAlign: 'center', fontSize: 13, fontWeight: 600, color: RED }}>Next step</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'creator' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', animation: 'fadeUp .4s ease' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, marginBottom: 16, lineHeight: 1.2 }}>
                  Your recipes already drive purchases. Start earning from them.
                </h2>
                <p style={{ fontSize: 15, color: RED, opacity: .6, lineHeight: 1.8, marginBottom: 28 }}>
                  Every ingredient you list comes with an affiliate link. When your followers order, you earn. No brand deals or sponsorships required.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Earn on every grocery order your recipe drives', 'See exactly which recipes get cooked, not just watched', 'One link works across all your social media channels', 'No upfront cost. Cookd takes a cut only when you earn'].map(pt => (
                    <div key={pt} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke={CREAM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontSize: 14, color: RED, opacity: .7, lineHeight: 1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: WHITE, borderRadius: 20, padding: 28, border: `1px solid rgba(150,45,73,.08)` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: RED, opacity: .4, marginBottom: 20 }}>Last 7 days</div>
                {[
                  { name: 'Dal Makhani', carts: 142, pct: 85 },
                  { name: 'Acai Bowl',   carts: 98,  pct: 58 },
                  { name: 'Mango Lassi', carts: 61,  pct: 37 },
                ].map(r => (
                  <div key={r.name} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: RED }}>{r.name}</span>
                      <span style={{ fontSize: 12, color: RED, opacity: .5 }}>{r.carts} grocery lists made</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 4, background: `rgba(150,45,73,.08)`, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.pct}%`, borderRadius: 4, background: RED, animation: 'barGrow 1s ease both' }} />
                    </div>
                  </div>
                ))}
                <div style={{ padding: '14px 18px', background: `rgba(150,45,73,.06)`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: RED, opacity: .6 }}>This week</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: RED }}>Rs 2,840</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <div ref={statsRef} style={{ background: RED, padding: '52px 28px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { val: c1, suffix: '',  label: 'Recipes ready to cook on day one' },
            { val: c2, suffix: '+', label: 'Food creators signed up and waiting' },
            { val: c3, suffix: '%', label: 'Of early users said they would cook more' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)', fontWeight: 800, letterSpacing: '-2px', color: CREAM, lineHeight: 1 }}>
                {s.val.toLocaleString()}{s.suffix}
              </div>
              <div style={{ fontSize: 13, color: CREAM, opacity: .6, marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <section style={{ background: BG, padding: '80px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 14 }}>Get early access</p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, marginBottom: 14, lineHeight: 1.2 }}>
            Ready to cook tonight?
          </h2>
          <p style={{ fontSize: 15, color: RED, opacity: .55, lineHeight: 1.7, marginBottom: 32 }}>
            Join the waitlist and be the first to know when Cookd launches.
          </p>
          {joined ? (
            <p style={{ fontSize: 15, color: RED, fontWeight: 600 }}>You are on the list. We will reach out before launch.</p>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', maxWidth: 420, margin: '0 auto' }}>
                <input type="email" value={footerEmail} onChange={e => setFooterEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && join('footer')}
                  placeholder="your@email.com"
                  style={{ flex: 1, height: 48, padding: '0 16px', borderRadius: 10, border: `1.5px solid rgba(150,45,73,.22)`, background: WHITE, color: RED, fontSize: 14 }}
                />
                <button onClick={() => join('footer')}
                  style={{ height: 48, padding: '0 24px', borderRadius: 10, background: RED, color: CREAM, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >Join waitlist</button>
              </div>
              {waitlistCount !== null && waitlistCount > 0 && (
                <p style={{ fontSize: 13, color: RED, opacity: .5, marginTop: 12 }}>
                  Join <span style={{ fontWeight: 700, opacity: 1, color: RED }}>{waitlistCount.toLocaleString()}</span> others already on the list.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: BG, borderTop: `1px solid rgba(150,45,73,.08)`, padding: '24px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '0' }}>
          <Logo size={18} />
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: RED, opacity: .45, textDecoration: 'none', transition: 'opacity .15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.8')} onMouseLeave={e => (e.currentTarget.style.opacity = '.45')}
              >{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 12, color: RED, opacity: .3 }}>&#169; 2026 Cookd</span>
        </div>
      </footer>
    </main>
  )
}
