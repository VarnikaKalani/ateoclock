'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import WaitlistForm from '@/components/WaitlistForm'

const RED   = '#962d49'
const CREAM = '#f3eac3'
const RED2  = '#b8455f'
const BG    = '#fdf8ee'
const WHITE = '#ffffff'

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
      <span style={{ color: RED }}>Coook</span><span style={{ color: RED2 }}>d</span>
    </span>
  )
}

const STORES = [
  { name: 'Blinkit', logo: '/logos/blinkit-badge.svg' },
  { name: 'Amazon Fresh', logo: '/logos/amazon-fresh.svg' },
  { name: 'Zepto', logo: '/logos/zepto-badge.svg' },
  { name: 'Flipkart Minutes', logo: '/logos/flipkart-minutes.svg' },
  { name: 'BigBasket', logo: '/logos/bigbasket-badge.svg' },
  { name: 'JioMart', logo: '/logos/jiomart-badge.svg' },
  { name: 'Instamart', logo: '/logos/instamart-badge.svg' },
]

type RecipeIngredient = {
  id: string
  name: string
  qty: string
  defaultSelected: boolean
}

type RecipeCardData = {
  id: string
  name: string
  by: string
  time: string
  tag: string
  checkoutStores: string[]
  ingredients: RecipeIngredient[]
}

type FocusedCheckoutPrice = {
  store: string
  splitPrice: number
  oneStorePrice: number
}

const RECIPE_LIBRARY: RecipeCardData[] = [
  {
    id: 'acai-bowl',
    name: 'Acai Bowl',
    by: '@healthybowl',
    time: '10 min',
    tag: 'Healthy',
    checkoutStores: ['Blinkit', 'Instamart'],
    ingredients: [
      { id: 'acai', name: 'Frozen acai', qty: '2 packs', defaultSelected: true },
      { id: 'banana', name: 'Banana', qty: '2', defaultSelected: true },
      { id: 'granola', name: 'Granola', qty: '1 pack', defaultSelected: true },
      { id: 'berries', name: 'Mixed berries', qty: '150g', defaultSelected: true },
      { id: 'chia', name: 'Chia seeds', qty: '2 tsp', defaultSelected: false },
    ],
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    by: '@spicelab',
    time: '5 min',
    tag: 'Drink',
    checkoutStores: ['Zepto'],
    ingredients: [
      { id: 'mangoes', name: 'Mangoes', qty: '3', defaultSelected: true },
      { id: 'yogurt', name: 'Yogurt', qty: '500g', defaultSelected: true },
      { id: 'milk', name: 'Milk', qty: '150ml', defaultSelected: true },
      { id: 'cardamom', name: 'Cardamom', qty: '1 tsp', defaultSelected: false },
      { id: 'sugar', name: 'Sugar', qty: '2 tbsp', defaultSelected: false },
    ],
  },
]

const DEFAULT_RECIPE_ID = 'acai-bowl'
const DEFAULT_RECIPE = RECIPE_LIBRARY.find((recipe) => recipe.id === DEFAULT_RECIPE_ID) ?? RECIPE_LIBRARY[0]

const FOCUSED_FLOW_PRICING: Record<string, FocusedCheckoutPrice> = {
  acai: { store: 'Blinkit', splitPrice: 279, oneStorePrice: 304 },
  banana: { store: 'Instamart', splitPrice: 26, oneStorePrice: 31 },
  granola: { store: 'Blinkit', splitPrice: 172, oneStorePrice: 189 },
  berries: { store: 'Instamart', splitPrice: 164, oneStorePrice: 178 },
  chia: { store: 'Blinkit', splitPrice: 38, oneStorePrice: 44 },
}

const SAVED_RECIPE_TILES = [
  'Saved post',
  'Recipe note',
  'Dinner idea',
  'Pasta reel',
  'Acai Bowl',
  'Grocery tip',
  'Creator clip',
  'Dessert post',
  'Lunch plan',
  'Soup reel',
  'Pantry list',
  'Cooking clip',
  'Meal prep',
  'Weekend cook',
  'Sauce note',
]

export default function Home() {
  const [tab, setTab]           = useState<'cook' | 'creator'>('cook')
  const [demoStep, setDemoStep] = useState<0 | 1 | 2>(0)
  const [cartFill, setCartFill] = useState(0)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [aboutPhase, setAboutPhase] = useState(0) // 0=camera roll, 1=selected, 2=cart
  const [navOpen, setNavOpen] = useState(false)
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>(
    DEFAULT_RECIPE.ingredients.filter((ingredient) => ingredient.defaultSelected).map((ingredient) => ingredient.id)
  )
  const statsRef                = useRef<HTMLDivElement>(null)
  const statsVis                = useVisible(statsRef)
  const c1 = useCounter(4200, 1800, statsVis)
  const c2 = useCounter(38,   1400, statsVis)
  const c3 = useCounter(96,   1600, statsVis)

  const selectedRecipe = DEFAULT_RECIPE

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
      .then(({ count }) => setWaitlistCount((count ?? 0) + 1000))

    const channel = supabase
      .channel('waitlist-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waitlist' }, () => {
        setWaitlistCount(c => (c ?? 0) + 1)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

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

  function toggleIngredient(ingredientId: string) {
    setSelectedIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId]
    )
  }

  const primaryStore = 'Blinkit'
  const selectedIngredients = selectedRecipe.ingredients.filter((ingredient) => selectedIngredientIds.includes(ingredient.id))
  const pantryIngredients = selectedRecipe.ingredients.filter((ingredient) => !selectedIngredientIds.includes(ingredient.id))
  const focusedOrderItems = selectedIngredients.map((ingredient) => ({
    ...ingredient,
    ...FOCUSED_FLOW_PRICING[ingredient.id],
  }))
  const focusedCartGroups = Array.from(
    focusedOrderItems.reduce((groups, item) => {
      const existingGroup = groups.get(item.store)
      if (existingGroup) {
        existingGroup.items.push(item)
        existingGroup.subtotal += item.splitPrice
        return groups
      }

      groups.set(item.store, {
        store: item.store,
        items: [item],
        subtotal: item.splitPrice,
      })
      return groups
    }, new Map<string, { store: string; items: typeof focusedOrderItems; subtotal: number }>())
      .values()
  )
  const focusedSplitTotal = focusedOrderItems.reduce((sum, item) => sum + item.splitPrice, 0)
  const focusedStoreLabel = focusedCartGroups.map((group) => group.store).join(' + ') || 'selected stores'

  function goToDemoStep(step: 0 | 1 | 2) {
    setDemoStep(step)
  }

  function advanceDemoStep() {
    setDemoStep((current) => {
      if (current === 0) return 1
      if (current === 1) return 2
      return 2
    })
  }

  const demoStepMeta = [
    { label: 'Recipe', title: 'Recipe selected', helper: 'View ingredients.', cta: 'Continue' },
    { label: 'Ingredients', title: 'Pick what to order', helper: 'Keep pantry items off.', cta: 'Build cart' },
    { label: 'Checkout', title: 'Checkout across stores', helper: 'Selected items grouped.', cta: 'Checkout' },
  ] as const

  const demoRecipeCard = (
    <div className="demo-recipe-card">
      <div className="demo-recipe-thumb" aria-hidden="true">
        <div className="demo-thumb-plate" />
        <div className="demo-thumb-bowl" />
        <div className="demo-thumb-swirl" />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: RED, letterSpacing: '-.02em' }}>{selectedRecipe.name}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: RED, opacity: .56 }}>{selectedRecipe.by} · {selectedRecipe.time}</div>
      </div>
      <span className="demo-tag">{selectedRecipe.tag}</span>
    </div>
  )

  const currentStepTitle = demoStepMeta[demoStep].title
  const currentStepHelper = demoStepMeta[demoStep].helper

  const currentCounterText = demoStep === 0
    ? `${selectedRecipe.ingredients.length} items`
    : demoStep === 1
      ? `${selectedIngredients.length} to order`
      : `${focusedCartGroups.length} carts`

  const currentFooterText = demoStep === 0
    ? `${selectedRecipe.ingredients.length} ingredients`
    : demoStep === 1
      ? `${selectedIngredients.length} to order · ${pantryIngredients.length} at home`
      : `${focusedCartGroups.length} carts · ${focusedStoreLabel}`

  const demoStateContent = (
    <div key={`step-${demoStep + 1}`} className="demo-state">
      <div className="demo-panel-title-row">
        <div>
          <div className="demo-panel-title">{currentStepTitle}</div>
          <div className="demo-panel-caption">{currentStepHelper}</div>
        </div>
        <span className="demo-counter-pill">{currentCounterText}</span>
      </div>

      {demoRecipeCard}

      <div className={`demo-ingredient-grid${demoStep === 2 ? ' is-faded' : ''}`}>
        {selectedRecipe.ingredients.map((ingredient) => {
          const active = selectedIngredientIds.includes(ingredient.id)
          const interactive = demoStep === 1
          const metaLabel = demoStep === 0 ? ingredient.qty : active ? 'To order' : 'At home'

          return (
            <button
              key={ingredient.id}
              type="button"
              className={`demo-ingredient-pill${active ? ' is-selected' : ''}${demoStep !== 0 && !active ? ' is-muted' : ''}${interactive ? ' is-interactive' : ''}`}
              onClick={interactive ? () => toggleIngredient(ingredient.id) : undefined}
              disabled={!interactive}
              aria-pressed={interactive ? active : undefined}
            >
              <span className={`demo-ingredient-marker${demoStep === 0 ? ' is-neutral' : active ? ' is-selected' : ''}`}>
                {demoStep !== 0 && active ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={CREAM} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </span>
              <span className="demo-ingredient-name">{ingredient.name}</span>
              <span className={`demo-ingredient-meta${demoStep === 0 ? ' is-qty' : active ? ' is-strong' : ''}`}>{metaLabel}</span>
            </button>
          )
        })}
      </div>

      <div className={`demo-result-card${demoStep === 2 ? ' is-active' : ''}`}>
        <div className="demo-result-header">
          <span>Store grouping</span>
          <span>{demoStep === 2 ? `${focusedCartGroups.length} carts` : demoStep === 1 ? 'Build cart' : 'Next'}</span>
        </div>

        {demoStep === 2 ? (
          <>
            <div className="demo-result-groups">
              {focusedCartGroups.length > 0 ? (
                focusedCartGroups.map((group) => (
                  <div key={group.store} className="demo-result-group">
                    <div className="demo-result-store">{group.store}</div>
                    <div className="demo-result-items">{group.items.map((item) => item.name).join(' · ')}</div>
                  </div>
                ))
              ) : (
                <div className="demo-result-placeholder">Select ingredients to order.</div>
              )}
            </div>
            <div className="demo-result-summary">
              <span>Split total</span>
              <strong>{formatRs(focusedSplitTotal)}</strong>
            </div>
          </>
        ) : (
          <>
            <div className="demo-result-placeholder">
              {demoStep === 0 ? 'Continue to choose what you need.' : 'Build cart to group selected items.'}
            </div>
            <div className="demo-result-summary subtle">
              <span>Split total</span>
              <strong>Updates next</strong>
            </div>
          </>
        )}
      </div>

      <div className="demo-compact-footer">
        <div className="demo-footer-note">{currentFooterText}</div>
        <button
          type="button"
          className="demo-primary-button demo-primary-button-compact"
          disabled={(demoStep === 1 || demoStep === 2) && selectedIngredients.length === 0}
          onClick={demoStep < 2 ? advanceDemoStep : undefined}
        >
          {demoStepMeta[demoStep].cta}
        </button>
      </div>
    </div>
  )

  const focusedFlowPanel = (
    <div className="product-demo-card" style={{ width: '100%' }}>
      <div className="demo-panel-topbar">
        <div className="demo-progress">
          {demoStepMeta.map((step, index) => (
            <button
              key={step.label}
              type="button"
              className={`demo-progress-step${demoStep === index ? ' active' : ''}`}
              onClick={() => goToDemoStep(index as 0 | 1 | 2)}
              aria-label={`Step ${index + 1}: ${step.label}`}
              aria-current={demoStep === index ? 'step' : undefined}
            >
              <span className="demo-progress-index">0{index + 1}</span>
              <span className="demo-progress-label">{step.label}</span>
            </button>
          ))}
        </div>
        <span className="demo-step-chip">Interactive demo</span>
      </div>

      {demoStateContent}
    </div>
  )

  const ingredients = ['Frozen acai', 'Banana', 'Granola', 'Mixed berries']

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

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .how-demo-shell {
          display: flex;
          justify-content: center;
        }
        .product-demo-card {
          max-width: 620px;
          padding: 28px;
          border-radius: 24px;
          border: 1px solid rgba(150,45,73,.1);
          background: linear-gradient(180deg, #fffefb 0%, #fffaf4 100%);
          box-shadow: 0 18px 40px rgba(150,45,73,.06);
        }
        .demo-panel-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }
        .demo-progress {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .demo-progress-step {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border-radius: 16px;
          border: 1px solid rgba(150,45,73,.12);
          background: rgba(255,255,255,.78);
          color: ${RED};
          text-align: left;
          cursor: pointer;
          transition: all .22s ease;
        }
        .demo-progress-step:hover {
          border-color: rgba(150,45,73,.24);
          transform: translateY(-1px);
        }
        .demo-progress-step.active {
          background: ${RED};
          border-color: ${RED};
          color: ${CREAM};
          box-shadow: 0 8px 20px rgba(150,45,73,.16);
        }
        .demo-progress-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(150,45,73,.08);
          color: rgba(150,45,73,.76);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .04em;
          flex-shrink: 0;
        }
        .demo-progress-step.active .demo-progress-index {
          background: rgba(243,234,195,.18);
          color: ${CREAM};
        }
        .demo-progress-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: -.01em;
        }
        .demo-step-chip {
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(150,45,73,.06);
          color: ${RED};
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .demo-state {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeUp .28s ease both;
        }
        .demo-panel-title-row {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
        }
        .demo-panel-title {
          font-size: 18px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -.03em;
          color: ${RED};
        }
        .demo-panel-caption {
          margin-top: 4px;
          font-size: 11px;
          line-height: 1.4;
          color: rgba(150,45,73,.56);
        }
        .demo-counter-pill {
          flex-shrink: 0;
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(150,45,73,.05);
          border: 1px solid rgba(150,45,73,.08);
          color: ${RED};
          font-size: 11px;
          font-weight: 700;
        }
        .demo-recipe-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid rgba(150,45,73,.1);
          background: rgba(255,255,255,.92);
          text-align: left;
        }
        .demo-recipe-thumb {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border-radius: 16px;
          background: radial-gradient(circle at 30% 25%, rgba(255,255,255,.9), rgba(255,255,255,.2) 34%, rgba(150,45,73,.18) 35%, rgba(150,45,73,.08) 100%);
          border: 1px solid rgba(150,45,73,.08);
          position: relative;
          overflow: hidden;
        }
        .demo-thumb-plate {
          position: absolute;
          inset: 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.75);
        }
        .demo-thumb-bowl {
          position: absolute;
          inset: 17px;
          border-radius: 999px;
          background: linear-gradient(180deg, #733120 0%, #9f4a2d 100%);
          box-shadow: inset 0 -6px 10px rgba(76,22,17,.18);
        }
        .demo-thumb-swirl {
          position: absolute;
          width: 16px;
          height: 16px;
          right: 14px;
          top: 12px;
          border-radius: 999px;
          background: rgba(245,236,220,.9);
          box-shadow: 0 0 0 5px rgba(245,236,220,.2);
        }
        .demo-tag {
          flex-shrink: 0;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(150,45,73,.05);
          color: ${RED};
          font-size: 10px;
          font-weight: 700;
        }
        .demo-ingredient-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .demo-ingredient-grid.is-faded {
          opacity: .88;
        }
        .demo-ingredient-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 46px;
          padding: 12px 14px;
          border-radius: 13px;
          border: 1px solid rgba(150,45,73,.08);
          background: rgba(150,45,73,.03);
          text-align: left;
          transition: border-color .18s ease, background .18s ease, opacity .18s ease;
        }
        .demo-ingredient-pill:disabled {
          cursor: default;
          opacity: 1;
        }
        .demo-ingredient-pill.is-interactive {
          cursor: pointer;
        }
        .demo-ingredient-pill.is-interactive:hover {
          border-color: rgba(150,45,73,.14);
        }
        .demo-ingredient-pill.is-selected {
          background: rgba(150,45,73,.06);
          border-color: rgba(150,45,73,.12);
        }
        .demo-ingredient-pill.is-muted {
          background: rgba(150,45,73,.02);
        }
        .demo-ingredient-marker {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 1px solid rgba(150,45,73,.18);
          background: rgba(255,255,255,.9);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all .18s ease;
        }
        .demo-ingredient-marker.is-neutral {
          border-color: rgba(150,45,73,.12);
          background: rgba(255,255,255,.72);
        }
        .demo-ingredient-marker.is-selected {
          background: ${RED};
          border-color: ${RED};
        }
        .demo-ingredient-marker.is-selected svg {
          animation: pulse .22s ease;
        }
        .demo-ingredient-name {
          min-width: 0;
          font-size: 12px;
          font-weight: 700;
          color: ${RED};
        }
        .demo-ingredient-meta {
          margin-left: auto;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(150,45,73,.04);
          color: rgba(150,45,73,.55);
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
        }
        .demo-ingredient-meta.is-qty {
          padding: 0;
          border-radius: 0;
          background: transparent;
          font-size: 11px;
          font-weight: 600;
          color: rgba(150,45,73,.5);
        }
        .demo-ingredient-meta.is-strong {
          background: rgba(150,45,73,.08);
          color: ${RED};
        }
        .demo-result-card {
          border-radius: 18px;
          border: 1px solid rgba(150,45,73,.08);
          background: rgba(255,255,255,.88);
          padding: 16px 18px;
        }
        .demo-result-card.is-active {
          animation: fadeUp .24s ease both;
        }
        .demo-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: rgba(150,45,73,.5);
        }
        .demo-result-groups {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .demo-result-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .demo-result-store {
          font-size: 13px;
          font-weight: 800;
          color: ${RED};
        }
        .demo-result-items {
          font-size: 12px;
          line-height: 1.5;
          color: rgba(150,45,73,.7);
        }
        .demo-result-placeholder {
          margin-top: 14px;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(150,45,73,.5);
        }
        .demo-result-summary {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(150,45,73,.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 11px;
          color: rgba(150,45,73,.55);
        }
        .demo-result-summary strong {
          font-size: 14px;
          color: ${RED};
        }
        .demo-result-summary.subtle strong {
          font-size: 12px;
          color: rgba(150,45,73,.62);
        }
        .demo-footer-note {
          font-size: 11px;
          color: rgba(150,45,73,.56);
        }
        .demo-compact-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .demo-primary-button {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 16px;
          background: ${RED};
          color: ${CREAM};
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
        }
        .demo-primary-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(150,45,73,.14);
        }
        .demo-primary-button:disabled {
          cursor: not-allowed;
          opacity: .45;
          box-shadow: none;
          transform: none;
        }
        .demo-primary-button-compact {
          width: auto;
          min-width: 148px;
          height: 48px;
          padding: 0 20px;
          flex-shrink: 0;
        }

        .compare-board {
          margin-top: 14px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(150,45,73,.1);
          background: rgba(150,45,73,.03);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .compare-header-row,
        .compare-row {
          display: grid;
          grid-template-columns: 1.1fr repeat(3, minmax(0, 1fr));
          gap: 8px;
          align-items: stretch;
        }
        .compare-cell {
          padding: 10px 8px;
          border-radius: 12px;
          border: 1px solid rgba(150,45,73,.08);
          background: ${WHITE};
          text-align: center;
        }
        .compare-cell.selected {
          background: rgba(150,45,73,.1);
          border-color: rgba(150,45,73,.24);
          box-shadow: inset 0 0 0 1px rgba(150,45,73,.08);
        }
        .store-logo {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          border-radius: 7px;
          overflow: hidden;
        }
        .saved-shot-grid {
          padding: 8px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          animation: fadeUp .35s ease both;
        }
        .saved-shot-tile {
          aspect-ratio: 1;
          border-radius: 8px;
          padding: 10px 8px;
          background: rgba(150,45,73,.05);
          border: 1px solid rgba(150,45,73,.06);
          display: flex;
          align-items: end;
          justify-content: start;
          text-align: left;
          font-size: 9px;
          line-height: 1.3;
          white-space: pre-line;
          color: rgba(150,45,73,.62);
        }
        .saved-shot-tile.focused {
          background: ${BG};
          border: 2px solid ${RED};
          color: ${RED};
          transform: scale(1.04);
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
          .product-demo-card {
            max-width: 100%;
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
          .product-demo-card {
            padding: 20px;
            border-radius: 22px;
          }
          .demo-panel-topbar,
          .demo-panel-title-row,
          .demo-recipe-card,
          .demo-compact-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .demo-step-chip,
          .demo-counter-pill,
          .demo-tag {
            align-self: flex-start;
          }
          .demo-ingredient-grid {
            grid-template-columns: 1fr;
          }
          .demo-primary-button-compact {
            width: 100%;
          }
          .demo-progress {
            width: 100%;
            grid-template-columns: 1fr;
          }
          .compare-header-row,
          .compare-row {
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
            Coookd turns any recipe into a ready-to-checkout cart across any grocery store.
            </p>
            <div id="waitlist-form" className="fade-up">
              <WaitlistForm />
              {waitlistCount !== null && waitlistCount > 0 && (
                <p style={{ fontSize: 14, color: RED, opacity: .6, marginTop: 12 }}>
                  Join <span style={{ color: RED, fontWeight: 700, opacity: 1 }}>{waitlistCount.toLocaleString()}</span> others on the waitlist.
                </p>
              )}
              <p style={{ fontSize: 12, color: RED, opacity: .3, marginTop: 6 }}>You can unsubscribe any time.</p>
            </div>
          </div>

          {/* Animated mockup */}
          <div style={{ position: 'relative', height: 440 }}>
            <div className="card-hover float-a" style={{ position: 'absolute', top: 16, left: 0, width: 250, background: WHITE, borderRadius: 18, padding: 22, boxShadow: '0 8px 36px rgba(150,45,73,.1)', border: '1px solid rgba(150,45,73,.07)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 10 }}>Saved recipe</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: RED, marginBottom: 4 }}>Acai Bowl</div>
              <div style={{ fontSize: 12, color: RED, opacity: .5, marginBottom: 14 }}>by @healthybowl</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['10 min', 'Serves 1', 'Healthy'].map(t => (
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
          <div className="marquee-track" style={{ display: 'flex', animation: 'marquee 22s linear infinite', width: 'max-content', padding: '0 88px' }}>
            {[...STORES, ...STORES].map((s, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', margin: '0 6px', borderRadius: 999, border: `1.5px solid rgba(150,45,73,.15)`, fontSize: 13, fontWeight: 600, color: RED, whiteSpace: 'nowrap', background: WHITE }}>
                <span className="store-logo" aria-hidden="true">
                  <Image src={s.logo} alt="" width={24} height={24} />
                </span>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS COOOKD */}
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
              Coookd fixes that. Find a recipe, tap once, and every ingredient lands in your cart. No searching, no copying, no forgetting.
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
                  <div className="saved-shot-grid">
                    {SAVED_RECIPE_TILES.map((label, i) => (
                      <div
                        key={label}
                        className="saved-shot-tile"
                        style={{
                          background: [
                            'rgba(150,45,73,.06)',
                            'rgba(150,45,73,.08)',
                            'rgba(243,234,195,.82)',
                            'rgba(150,45,73,.05)',
                            'rgba(243,234,195,.65)',
                          ][i % 5],
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Phase 1: one recipe highlighted */}
                {aboutPhase === 1 && (
                  <div className="saved-shot-grid">
                    {SAVED_RECIPE_TILES.map((label, i) => {
                      const focused = i === 4
                      return (
                        <div
                          key={`${label}-${i}`}
                          className={`saved-shot-tile${focused ? ' focused' : ''}`}
                          style={{ opacity: focused ? 1 : 0.28 }}
                        >
                          {focused ? `${selectedRecipe.name}\nTap to build cart` : label}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Phase 2: cart being built */}
                {aboutPhase === 2 && (
                  <div style={{ padding: '14px', animation: 'fadeUp .35s ease both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: RED }}>{selectedRecipe.name}</div>
                        <div style={{ fontSize: 9, color: RED, opacity: .5 }}>Adding ingredients to cart...</div>
                      </div>
                    </div>
                    {[
                      ...selectedRecipe.ingredients
                        .filter((ingredient) => ingredient.defaultSelected)
                        .slice(0, 4)
                        .map((ingredient, index) => ({
                          label: ingredient.name,
                          qty: ingredient.qty,
                          delay: index * 150,
                        })),
                    ].map((item) => (
                      <div key={item.label} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 10px', marginBottom: 4, borderRadius: 8,
                        background: `rgba(150,45,73,.05)`,
                        animation: `fadeUp .4s ease ${item.delay}ms both`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke={WHITE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
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
      <section id="how-it-works" style={{ background: WHITE, padding: '104px 28px 128px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 12, textAlign: 'center' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, textAlign: 'center', marginBottom: 14 }}>
            Three steps. Done.
          </h2>
          <p style={{ marginBottom: 52, textAlign: 'center', fontSize: 15, color: RED, opacity: .52 }}>
            From recipe to groceries in minutes.
          </p>

          <div className="how-demo-shell">
            {focusedFlowPanel}
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
                <div style={{ fontWeight: 700, fontSize: 15, color: RED, marginBottom: 18 }}>Acai Bowl prep mode</div>
                <div style={{ fontSize: 11, color: RED, opacity: .4, marginBottom: 8 }}>Step 2 of 4</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: RED, marginBottom: 10 }}>Blend until thick</div>
                <div style={{ fontSize: 13, color: RED, opacity: .6, lineHeight: 1.65, marginBottom: 20 }}>
                  Blend frozen acai, banana, and a splash of milk for 45 seconds. Stop when the texture is scoopable, not drinkable.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, padding: '11px 0', background: RED, borderRadius: 8, textAlign: 'center', fontSize: 13, fontWeight: 700, color: CREAM }}>00:45</div>
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
                  {['Earn on every grocery order your recipe drives', 'See exactly which recipes get cooked, not just watched', 'One link works across all your social media channels', 'No upfront cost. Coookd takes a cut only when you earn'].map(pt => (
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
                  { name: 'Acai Bowl', carts: 142, pct: 85 },
                  { name: 'Mango Lassi', carts: 61, pct: 37 },
                  { name: 'Berry Smoothie', carts: 48, pct: 29 },
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
            Join the waitlist and be the first to know when Coookd launches.
          </p>
          <WaitlistForm />
          {waitlistCount !== null && waitlistCount > 0 && (
            <p style={{ fontSize: 13, color: RED, opacity: .5, marginTop: 12, textAlign: 'center' }}>
              Join <span style={{ fontWeight: 700, opacity: 1, color: RED }}>{waitlistCount.toLocaleString()}</span> others already on the list.
            </p>
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
          <span style={{ fontSize: 12, color: RED, opacity: .3 }}>&#169; 2026 Coookd</span>
        </div>
      </footer>
    </main>
  )
}
