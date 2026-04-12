'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import PillMorphTabs from '@/components/ui/pill-morph-tabs'

const RED   = '#962d49'
const CREAM = '#f3eac3'
const RED2  = '#b8455f'
const BG    = '#fdf8ee'
const WHITE = '#ffffff'


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
const STORE_MARQUEE_GROUPS = 3
const HERO_TITLES = ['delivered', 'planned', 'sorted', 'ready', 'done']

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

function UpcomingFeaturesSection() {
  const [urlStep, setUrlStep] = useState<0 | 1 | 2 | 3>(0)
  const [demoServings, setDemoServings] = useState(2)

  useEffect(() => {
    const durations = [2000, 2200, 1800, 4000]
    let step = 0
    let t: ReturnType<typeof setTimeout>
    const advance = () => {
      step = ((step + 1) % 4) as 0 | 1 | 2 | 3
      setUrlStep(step as 0 | 1 | 2 | 3)
      t = setTimeout(advance, durations[step])
    }
    t = setTimeout(advance, durations[0])
    return () => clearTimeout(t)
  }, [])

  const servingIngredients = [
    { name: 'Organic Acai Base', base: 1, unit: 'pkg' },
    { name: 'Fresh Blueberries', base: 0.5, unit: 'cup' },
    { name: 'House Granola',     base: 0.25, unit: 'cup' },
    { name: 'Manuka Honey',      base: 1, unit: 'tbsp' },
  ]

  const mockupStyle: React.CSSProperties = {
    background: BG, borderRadius: 14, padding: 16, marginBottom: 20, minHeight: 210,
  }
  const rowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '7px 0', borderBottom: `1px solid rgba(150,45,73,.07)`,
  }

  return (
    <section style={{ background: WHITE, padding: '80px 28px', borderTop: `1px solid rgba(150,45,73,.07)` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 12 }}>Features</p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, marginBottom: 14, lineHeight: 1.2 }}>
            More ways to cook smarter
          </h2>
          <p style={{ fontSize: 15, color: RED, opacity: .55, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            These features are in development and will be available at launch.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Feature 1: URL import */}
          <div style={{ background: BG, borderRadius: 20, overflow: 'hidden', border: `1px solid rgba(150,45,73,.1)`, padding: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: RED, opacity: .38, marginBottom: 10 }}>Feature</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: RED, letterSpacing: '-0.5px', lineHeight: 1.3, marginBottom: 10 }}>
              Paste a link. Get the full recipe.
            </h3>
            <p style={{ fontSize: 13, color: RED, opacity: .55, lineHeight: 1.7, marginBottom: 22 }}>
              Drop in a YouTube or Instagram URL. Coookd reads the video, extracts every ingredient and kitchen tool mentioned, and builds a shoppable recipe — steps included.
            </p>

            <div style={mockupStyle}>
              {/* URL input row */}
              <div style={{ background: WHITE, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, border: `1px solid rgba(150,45,73,.12)` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: RED, opacity: .35, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>URL</span>
                <span style={{ fontSize: 12, color: urlStep >= 1 ? RED : 'rgba(150,45,73,.25)', flex: 1, fontFamily: 'monospace', transition: 'color 0.4s', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {urlStep >= 1 ? 'youtube.com/watch?v=acai-bowl-recipe' : 'Paste a YouTube or Instagram link...'}
                </span>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: urlStep === 1 ? RED : `rgba(150,45,73,.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: urlStep === 1 ? CREAM : RED, flexShrink: 0, transition: 'all 0.3s' }}>
                  {urlStep === 2 ? '·' : '→'}
                </div>
              </div>

              {urlStep === 2 && (
                <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: RED, opacity: .45 }}>
                  Reading video — extracting ingredients and steps...
                </div>
              )}

              {urlStep === 3 && (
                <div style={{ animation: 'fadeUp 0.4s ease' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: RED, marginBottom: 10, opacity: .7 }}>Heritage Acai Bowl — 4 ingredients · 2 tools · 3 steps</div>
                  {[
                    { name: 'Organic Acai Base', price: 'Rs 1,043', tag: null },
                    { name: 'Manuka Honey',       price: 'Rs 1,577', tag: null },
                    { name: 'High-Speed Blender', price: 'Rs 4,175', tag: 'tool' },
                    { name: 'Mixing Bowl',        price: 'Rs 499',   tag: 'tool' },
                  ].map((item, i) => (
                    <div key={i} style={rowStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>{item.name}</span>
                        {item.tag && (
                          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: `rgba(150,45,73,.1)`, color: RED, opacity: .7, padding: '2px 6px', borderRadius: 4 }}>
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: RED, opacity: .5 }}>{item.price}</span>
                    </div>
                  ))}
                  <button type="button" style={{ marginTop: 14, width: '100%', padding: '9px', background: RED, color: CREAM, border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Add all to cart
                  </button>
                </div>
              )}

              {urlStep === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 12, color: RED, opacity: .25 }}>
                  Waiting for a link...
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Works with YouTube', 'Works with Instagram', 'Ingredients + tools', 'Buy links included'].map(tag => (
                <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: RED, opacity: .55, background: `rgba(150,45,73,.07)`, padding: '4px 10px', borderRadius: 6 }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Feature 2: Scalable servings */}
          <div style={{ background: BG, borderRadius: 20, overflow: 'hidden', border: `1px solid rgba(150,45,73,.1)`, padding: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: RED, opacity: .38, marginBottom: 10 }}>Feature</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: RED, letterSpacing: '-0.5px', lineHeight: 1.3, marginBottom: 10 }}>
              Cook for any crowd.
            </h3>
            <p style={{ fontSize: 13, color: RED, opacity: .55, lineHeight: 1.7, marginBottom: 22 }}>
              Set the number of servings and every ingredient quantity scales instantly. The grocery list recalculates in real time — no manual math, no guessing.
            </p>

            <div style={mockupStyle}>
              {/* Servings control */}
              <div style={{ background: WHITE, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, border: `1px solid rgba(150,45,73,.12)` }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>Servings</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button type="button" onClick={() => setDemoServings(s => Math.max(1, s - 1))}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid rgba(150,45,73,.25)`, background: 'transparent', color: RED, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                    −
                  </button>
                  <span style={{ fontSize: 16, fontWeight: 800, color: RED, minWidth: 22, textAlign: 'center' }}>{demoServings}</span>
                  <button type="button" onClick={() => setDemoServings(s => Math.min(12, s + 1))}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid rgba(150,45,73,.25)`, background: 'transparent', color: RED, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                    +
                  </button>
                </div>
              </div>

              {/* Ingredient list */}
              {servingIngredients.map((ing, i) => {
                const qty = (ing.base * demoServings) / 2
                const display = Number.isInteger(qty) ? qty.toString() : qty.toFixed(1)
                return (
                  <div key={i} style={rowStyle}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: RED }}>{ing.name}</span>
                    <span style={{ fontSize: 12, color: RED, opacity: .55, transition: 'all 0.25s', fontVariantNumeric: 'tabular-nums' }}>
                      {display} {ing.unit}
                    </span>
                  </div>
                )
              })}

              <div style={{ marginTop: 16, padding: '10px 14px', background: WHITE, borderRadius: 10, border: `1px solid rgba(150,45,73,.08)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: RED, opacity: .5 }}>Estimated total</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: RED }}>${(34.99 * demoServings / 2).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Adjustable servings', 'Auto-scales quantities', 'Live price estimate', 'Works for any recipe'].map(tag => (
                <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: RED, opacity: .55, background: `rgba(150,45,73,.07)`, padding: '4px 10px', borderRadius: 6 }}>{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "What is Coookd?",
    a: "Coookd is a platform that turns any recipe into a grocery order. Pick a recipe, select your ingredients, choose a delivery store like Blinkit or Zepto, and check out — all in one tap.",
  },
  {
    q: "Which grocery stores does Coookd support?",
    a: "We currently support Blinkit, Zepto, Amazon Fresh, BigBasket, and Instamart. More stores are being added before launch.",
  },
  {
    q: "Is Coookd free to use?",
    a: "Yes — Coookd is free for home cooks. You only pay for the groceries you order through the store of your choice.",
  },
  {
    q: "How does it work for creators?",
    a: "If you're a food creator, you can link your recipes directly on Coookd. When your followers cook your recipe and order ingredients, you earn an affiliate commission — no brand deals needed.",
  },
  {
    q: "When will Coookd launch?",
    a: "We're in early access right now. Join the waitlist and we'll notify you the moment we go live — early members get priority access.",
  },
  {
    q: "Does Coookd adjust for servings?",
    a: "Yes. Scale up or down the number of servings and the ingredient quantities — and the grocery list — update automatically.",
  },
  {
    q: "What countries is Coookd available in?",
    a: "Our launch focus is India, with global expansion planned shortly after. Prices are displayed in your local currency based on your location.",
  },
  {
    q: "How do I join the waitlist?",
    a: "Hit the 'Join waitlist' button at the top of the page, fill in your details, and you're in. We'll reach out before launch with your early access invite.",
  },
]

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" style={{ background: `rgba(150,45,73,.04)`, padding: '80px 28px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .45, background: `rgba(150,45,73,.08)`, padding: '4px 14px', borderRadius: 999 }}>FAQs</span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, textAlign: 'center', marginBottom: 8, lineHeight: 1.2 }}>
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: 14, color: RED, opacity: .5, lineHeight: 1.7, textAlign: 'center', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Everything you need to know about using Coookd. Still curious? Drop us a message and we&apos;ll get right back to you.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderTop: `1px solid rgba(150,45,73,.1)`, ...(i === FAQS.length - 1 ? { borderBottom: `1px solid rgba(150,45,73,.1)` } : {}) }}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 24, fontFamily: 'inherit' }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: RED, lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid rgba(150,45,73,.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, color: RED, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)', lineHeight: 1 }}>+</span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 20, fontSize: 14, color: RED, opacity: .6, lineHeight: 1.8 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [tab, setTab]           = useState<'cook' | 'creator'>('cook')
  const [cartFill, setCartFill] = useState(0)
  const [heroTitleNumber, setHeroTitleNumber] = useState(0)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [aboutPhase, setAboutPhase] = useState(0) // 0=camera roll, 1=selected, 2=cart
  const [navOpen, setNavOpen] = useState(false)

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
    const timeoutId = setTimeout(() => {
      setHeroTitleNumber(n => (n === HERO_TITLES.length - 1 ? 0 : n + 1))
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [heroTitleNumber])

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

  function scrollToSection(sectionId: string, nextTab?: 'cook' | 'creator') {
    if (nextTab) {
      setTab(nextTab)
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setNavOpen(false)
  }

  const navItems: Array<{ label: string; sectionId: string; tab?: 'cook' | 'creator' }> = [
    { label: 'About', sectionId: 'about' },
    { label: 'Features', sectionId: 'how-it-works' },
    { label: 'FAQs', sectionId: 'faq' },
  ]


  const DEMO_INGREDIENTS = [
    { id: 'acai',       name: 'Organic Acai Base',   description: 'Frozen, Unsweetened',  price: 12.50 },
    { id: 'kiwi',       name: 'Fresh Kiwi',          description: 'Pack of 4',            price: 3.50  },
    { id: 'blueberry',  name: 'Fresh Blueberries',   description: 'Pint, Seasonal',       price: 4.50  },
    { id: 'granola',    name: 'House Granola',        description: 'Almond & Cinnamon',   price: 8.00  },
    { id: 'strawberry', name: 'Strawberries',         description: 'Fresh, 250g',          price: 3.99  },
    { id: 'banana',     name: 'Ripe Bananas',         description: 'Bunch of 5',           price: 1.99  },
  ]
  const STORE_MULTIPLIERS: Record<string, number> = {
    'Blinkit': 1.00,
    'Zepto': 0.97,
    'Amazon Fresh': 1.05,
    'BigBasket': 0.94,
    'Instamart': 1.02,
  }
  const [demoQty, setDemoQty] = useState<Record<string, number>>({ acai: 1, kiwi: 0, blueberry: 0, granola: 1, strawberry: 0, banana: 0 })
  const [demoPanelStep, setDemoPanelStep] = useState<'pick' | 'checkout'>('pick')
  const [demoStore, setDemoStore] = useState('')
  const [demoCurrency, setDemoCurrency] = useState<{ symbol: string; rate: number }>({ symbol: '$', rate: 1 })
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        const map: Record<string, { symbol: string; rate: number }> = {
          IN: { symbol: 'Rs ', rate: 83.5 },
          GB: { symbol: '£', rate: 0.79 },
          EU: { symbol: '€', rate: 0.92 },
          DE: { symbol: '€', rate: 0.92 },
          FR: { symbol: '€', rate: 0.92 },
          AU: { symbol: 'A$', rate: 1.53 },
          CA: { symbol: 'C$', rate: 1.36 },
          SG: { symbol: 'S$', rate: 1.34 },
          AE: { symbol: 'AED ', rate: 3.67 },
        }
        const match = map[d.country_code]
        if (match) setDemoCurrency(match)
      })
      .catch(() => {})
  }, [])
  function demoAdjust(id: string, delta: number) {
    setDemoQty(q => ({ ...q, [id]: Math.max(0, q[id] + delta) }))
  }
  const demoSelectedItems = DEMO_INGREDIENTS.filter(i => demoQty[i.id] > 0)
  const demoBaseTotal = demoSelectedItems.reduce((sum, i) => sum + i.price * demoQty[i.id], 0)
  const demoStoreTotal = demoStore ? demoBaseTotal * STORE_MULTIPLIERS[demoStore] : demoBaseTotal
  function fmt(usd: number) {
    const val = usd * demoCurrency.rate
    return `${demoCurrency.symbol}${Math.round(val * 100) / 100}`
  }

  const ingredients = ['Frozen acai', 'Banana', 'Granola', 'Mixed berries']

  const focusedFlowPanel = (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 32, alignItems: 'center', width: '100%' }}>
      {/* Left: image */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '3 / 4', boxShadow: `0 8px 40px rgba(150,45,73,0.18)` }}>
        <Image src="/acai.png" alt="Heritage Acai Bowl" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: `rgba(253,248,238,0.92)`, backdropFilter: 'blur(8px)', borderRadius: 12, padding: '10px 14px' }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: RED, letterSpacing: '-0.02em' }}>Heritage Acai Bowl</div>
          <div style={{ fontSize: 11, color: RED, opacity: 0.55, marginTop: 2 }}>Brazilian Berry Curation</div>
        </div>
      </div>

      {/* Right: ingredient picker or checkout */}
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {demoPanelStep === 'pick' ? (
          <>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: RED, opacity: 0.45, marginBottom: 12 }}>Rapid Selection</div>
            <div style={{ backgroundColor: WHITE, borderRadius: 18, border: `1px solid rgba(150,45,73,0.1)`, overflow: 'hidden', marginBottom: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              {DEMO_INGREDIENTS.map((item, idx) => {
                const qty = demoQty[item.id]
                const isLast = idx === DEMO_INGREDIENTS.length - 1
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: isLast ? 'none' : `1px solid rgba(150,45,73,0.07)` }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: RED }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: RED, opacity: 0.5, marginTop: 1 }}>{item.description}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: BG, borderRadius: 9999, padding: '3px', border: `1px solid rgba(150,45,73,0.1)` }}>
                      <button type="button" onClick={() => demoAdjust(item.id, -1)}
                        style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: RED, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ width: 12, textAlign: 'center', fontSize: 12, fontWeight: 700, color: RED }}>{qty}</span>
                      <button type="button" onClick={() => demoAdjust(item.id, 1)}
                        style={{ width: 26, height: 26, borderRadius: '50%', border: qty > 0 ? 'none' : `1px solid rgba(150,45,73,0.25)`, background: qty > 0 ? RED : 'transparent', cursor: 'pointer', color: qty > 0 ? CREAM : RED, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ backgroundColor: BG, borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: `1px solid rgba(150,45,73,0.1)` }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: RED, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2 }}>
                  {demoSelectedItems.length} item{demoSelectedItems.length !== 1 ? 's' : ''} selected
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: RED, letterSpacing: '-0.01em' }}>
                  {demoSelectedItems.length > 0 ? 'Pricing appears after store selection' : 'Add items to continue'}
                </div>
              </div>
              <button type="button"
                onClick={() => { if (demoSelectedItems.length > 0) setDemoPanelStep('checkout') }}
                style={{ padding: '10px 18px', borderRadius: 9999, background: demoSelectedItems.length > 0 ? RED : `rgba(150,45,73,0.2)`, color: demoSelectedItems.length > 0 ? CREAM : RED, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: demoSelectedItems.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                Complete →
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <button type="button" onClick={() => { setDemoPanelStep('pick'); setDemoStore('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: RED, opacity: 0.5, fontSize: 18, lineHeight: 1, padding: 0 }}>←</button>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: RED, opacity: 0.45 }}>Checkout</div>
            </div>

            {/* Order summary */}
            <div style={{ backgroundColor: WHITE, borderRadius: 18, border: `1px solid rgba(150,45,73,0.1)`, overflow: 'hidden', marginBottom: 14 }}>
              {demoSelectedItems.map((item, idx) => {
                const isLast = idx === demoSelectedItems.length - 1
                const storePrice = demoStore ? item.price * STORE_MULTIPLIERS[demoStore] : null
                return (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderBottom: isLast ? 'none' : `1px solid rgba(150,45,73,0.07)` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: RED }}>{item.name} <span style={{ fontWeight: 400, opacity: 0.5 }}>×{demoQty[item.id]}</span></div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: RED, opacity: demoStore ? 1 : 0.45, textTransform: demoStore ? 'none' : 'uppercase', letterSpacing: demoStore ? 'normal' : '0.08em' }}>
                      {storePrice === null ? 'Hidden till store pick' : fmt(storePrice * demoQty[item.id])}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Store dropdown */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: RED, opacity: 0.45, marginBottom: 6 }}>Choose store</div>
              <select
                value={demoStore}
                onChange={e => setDemoStore(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid rgba(150,45,73,0.2)`, background: WHITE, color: demoStore ? RED : `rgba(150,45,73,0.4)`, fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', appearance: 'none', outline: 'none' }}
              >
                <option value="" disabled>Select a store…</option>
                {Object.keys(STORE_MULTIPLIERS).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Total + checkout button */}
            <div style={{ backgroundColor: BG, borderRadius: 18, padding: '14px 16px', border: `1px solid rgba(150,45,73,0.1)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: RED, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total{demoStore ? ` via ${demoStore}` : ''}</div>
                <div style={{ fontSize: demoStore ? '1.3rem' : 11, fontWeight: 800, color: RED, letterSpacing: demoStore ? '-0.03em' : '0.08em', textTransform: demoStore ? 'none' : 'uppercase', opacity: demoStore ? 1 : 0.45 }}>
                  {demoStore ? fmt(demoStoreTotal) : 'Hidden till store pick'}
                </div>
              </div>
              <button type="button"
                disabled={!demoStore}
                style={{ width: '100%', padding: '11px', borderRadius: 9999, background: demoStore ? RED : `rgba(150,45,73,0.2)`, color: demoStore ? CREAM : RED, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', cursor: demoStore ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                {demoStore ? `Checkout on ${demoStore} →` : 'Select a store to checkout'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )

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
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(calc(-100% / ${STORE_MARQUEE_GROUPS})); } }
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
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
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
        @media (max-width: 640px) {
          .how-demo-shell > div {
            grid-template-columns: 1fr !important;
          }
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
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(253,248,238,.95)', backdropFilter: 'blur(16px)', boxShadow: '0 1px 0 rgba(150,45,73,.08)', padding: '0 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo size={22} />
            <div className="nav-desktop" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <PillMorphTabs
                items={navItems.map(({ label, sectionId }) => ({
                  value: sectionId,
                  label,
                  panel: null,
                }))}
                defaultValue={navItems[0].sectionId}
                onValueChange={(sectionId) => {
                  const item = navItems.find(n => n.sectionId === sectionId)
                  if (item) scrollToSection(item.sectionId, item.tab)
                }}
              />
            </div>
            <a href="/waitlist"
              style={{ padding: '9px 22px', borderRadius: 999, background: RED, color: CREAM, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'opacity .15s', textDecoration: 'none', flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >Join waitlist</a>
            <div className="nav-desktop" style={{ display: 'none' }} />

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
              {navItems.map(({ label, sectionId, tab: nextTab }) => (
                <button
                  key={`mobile-${label}`}
                  type="button"
                  className="nav-mobile-link"
                  onClick={() => scrollToSection(sectionId, nextTab)}
                >
                  {label}
                </button>
              ))}
              <a href="/waitlist"
                style={{ marginTop: 2, display: 'block', width: '100%', padding: '10px 14px', borderRadius: 8, background: RED, color: CREAM, fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}
              >
                Join waitlist
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="grid-bg" style={{ display: 'flex', alignItems: 'center', padding: '72px 28px' }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>

          <div>
            <div className="fade-up" style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .5, marginBottom: 14 }}>
              Early access
            </div>
            <h1 className="fade-up" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', color: RED, marginBottom: 16 }}>
              From saved recipe to groceries{' '}
              <span style={{ position: 'relative', display: 'inline-block', minWidth: '8ch', height: '1.1em', verticalAlign: 'bottom', overflow: 'hidden' }}>
                {HERO_TITLES.map((title, index) => (
                  <motion.span
                    key={title}
                    style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap' }}
                    initial={{ opacity: 0, y: '-100%' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      heroTitleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: heroTitleNumber > index ? '-150%' : '150%', opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
            <p className="fade-up" style={{ fontSize: 16, color: RED, opacity: .65, lineHeight: 1.75, maxWidth: 400, marginBottom: 36 }}>
              Coookd turns any recipe into a ready-to-checkout cart across any grocery store.
            </p>
            <div id="waitlist-form" className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <a href="/waitlist"
                style={{ display: 'inline-block', padding: '14px 32px', background: RED, color: CREAM, borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', letterSpacing: '-0.01em', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Get early access →
              </a>
              {waitlistCount !== null && waitlistCount > 0 && (
                <p style={{ fontSize: 13, color: RED, opacity: .5 }}>
                  <span style={{ fontWeight: 700, opacity: 1, color: RED }}>{waitlistCount.toLocaleString()}</span> people already on the list
                </p>
              )}
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
                  Order on Blinkit
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
          <div className="marquee-track" style={{ display: 'flex', animation: 'marquee 24s linear infinite', width: 'max-content', willChange: 'transform' }}>
            {Array.from({ length: STORE_MARQUEE_GROUPS }).map((_, groupIndex) => (
              <div
                key={groupIndex}
                style={{ display: 'flex', flexShrink: 0, gap: 12 }}
                aria-hidden={groupIndex === 0 ? undefined : true}
              >
                {STORES.map((s) => (
                  <span key={`${groupIndex}-${s.name}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, border: `1.5px solid rgba(150,45,73,.15)`, fontSize: 13, fontWeight: 600, color: RED, whiteSpace: 'nowrap', background: WHITE }}>
                    <span className="store-logo" aria-hidden="true">
                      <Image src={s.logo} alt="" width={24} height={24} />
                    </span>
                    {s.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: WHITE, padding: '72px 28px 60px', borderTop: `1px solid rgba(150,45,73,.07)` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'end', marginBottom: 18 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 12 }}>About Coookd</p>
              <h2 style={{ fontSize: 'clamp(1.9rem,3vw,2.7rem)', fontWeight: 800, letterSpacing: '-1.2px', color: RED, marginBottom: 10, lineHeight: 1.08 }}>
                See a recipe. Build the cart. Cook tonight.
              </h2>
            </div>

            <div style={{ justifySelf: 'end', width: '100%', maxWidth: 420, background: BG, borderRadius: 20, padding: '18px 20px', border: `1px solid rgba(150,45,73,.1)` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .45, marginBottom: 8 }}>
                What it is
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.65, color: RED, opacity: .72 }}>
                A shoppable recipe layer that turns saved inspiration into an editable grocery basket, then lets the shopper choose the store at the end.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 14 }}>
            {[
              {
                number: '01',
                title: 'Save',
                body: 'Any screenshot, creator post, or recipe link.',
              },
              {
                number: '02',
                title: 'Build',
                body: 'Ingredients become one clean, editable basket.',
              },
              {
                number: '03',
                title: 'Choose',
                body: 'Pick Blinkit, Amazon Fresh, Zepto, or whoever fits best.',
              },
            ].map(card => (
              <div key={card.number} style={{ background: WHITE, borderRadius: 20, padding: '18px 18px 16px', border: `1px solid rgba(150,45,73,.12)`, boxShadow: '0 10px 26px rgba(150,45,73,.05)' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: RED, opacity: .35, marginBottom: 16 }}>
                  {card.number}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: RED, marginBottom: 6 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: RED, opacity: .66 }}>
                  {card.body}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              {
                label: 'For cooks',
                body: 'Less copying. Less searching. Faster dinner.',
              },
              {
                label: 'For creators',
                body: 'Recipe inspiration becomes measurable shopping intent.',
              },
            ].map(card => (
              <div key={card.label} style={{ background: `linear-gradient(180deg, rgba(150,45,73,.05) 0%, rgba(150,45,73,.02) 100%)`, borderRadius: 18, padding: '16px 18px', border: `1px solid rgba(150,45,73,.09)` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .45, marginBottom: 8 }}>
                  {card.label}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: RED, opacity: .74 }}>
                  {card.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOT FLOW */}
      <section style={{ background: `radial-gradient(ellipse at 65% 40%, rgba(150,45,73,.07) 0%, transparent 55%), ${BG}`, padding: '64px 28px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 72, flexWrap: 'wrap' }}>

          {/* Left: text + upload */}
          <div style={{ flex: '1 1 340px', minWidth: 280 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 12 }}>How it starts</p>
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
                      <span style={{ fontSize: 11, color: WHITE, fontWeight: 700 }}>Added to Blinkit cart</span>
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
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: RED, opacity: .4, marginBottom: 12, textAlign: 'center' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: RED, textAlign: 'center', marginBottom: 14 }}>
            Pick a recipe. We&apos;ll handle the rest.
          </h2>
          <p style={{ marginBottom: 36, textAlign: 'center', fontSize: 15, color: RED, opacity: .52 }}>
            Select your ingredients, choose a store, and check out in one tap.
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

      {/* UPCOMING FEATURES */}
      <UpcomingFeaturesSection />

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
          <a href="/waitlist"
            style={{ display: 'inline-block', padding: '14px 36px', background: RED, color: CREAM, borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', letterSpacing: '-0.01em', transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Join the waitlist →
          </a>
          {waitlistCount !== null && waitlistCount > 0 && (
            <p style={{ fontSize: 13, color: RED, opacity: .5, marginTop: 14 }}>
              <span style={{ fontWeight: 700, opacity: 1, color: RED }}>{waitlistCount.toLocaleString()}</span> people already on the list
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

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
