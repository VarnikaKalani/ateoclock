'use client'
import Image from 'next/image'
import { motion, AnimatePresence, useAnimationFrame, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useState, useEffect, useRef, Fragment } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import PillMorphTabs from '@/components/ui/pill-morph-tabs'
import Bucket from '@/components/ui/bucket'
import WalkingMascot from '@/components/ui/walking-mascot'

const RED        = '#74823F'
const CREAM      = '#F1E8C7'
const RED2       = '#A65F2D'
const BROWN      = '#6B3E1E'
const BG         = '#F1E8C7'
const WHITE      = '#ffffff'
const INTER_REGULAR = 'var(--font-inter), sans-serif'


function Logo({ size = 20, heroWord }: { size?: number; heroWord?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 1, lineHeight: 1 }}>
      <span style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.5px' }}>
        <span style={{ color: RED }}>ate</span><span style={{ color: BROWN }}> o&apos;clock</span>
      </span>
      {heroWord && (
        <span style={{ fontSize: Math.round(size * 0.52), fontWeight: 700, letterSpacing: '-0.02em', color: BROWN, opacity: .55, marginLeft: 4, transition: 'opacity 0.3s' }}>
          {heroWord}
        </span>
      )}
    </span>
  )
}

function InstagramGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <rect height="16" rx="5" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" fill="currentColor" r="1.1" />
    </svg>
  )
}

function SubstackGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path d="M5 5h14M5 9h14M6 13h12v7l-6-3.2L6 20v-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function YouTubeGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <rect height="12" rx="3.2" stroke="currentColor" strokeWidth="2" width="18" x="3" y="6" />
      <path d="M11 10.2v3.6l3.4-1.8L11 10.2Z" fill="currentColor" />
    </svg>
  )
}

function HeroGridPattern({ id, offsetX, offsetY }: { id: string; offsetX: MotionValue<number>; offsetY: MotionValue<number> }) {
  return (
    <svg className="hero-grid-svg" aria-hidden="true">
      <defs>
        <motion.pattern
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

function HeroGridSection({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(rect.width * 0.62)
    mouseY.set(rect.height * 0.44)
  }, [mouseX, mouseY])

  useAnimationFrame(() => {
    if (shouldReduceMotion) return
    gridOffsetX.set((gridOffsetX.get() + 0.34) % 40)
    gridOffsetY.set((gridOffsetY.get() + 0.34) % 40)
  })

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - left)
    mouseY.set(event.clientY - top)
  }

  const maskImage = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  return (
    <section id="hero" ref={containerRef} className="hero-section" onMouseMove={handleMouseMove}>
      <div className="hero-grid-layer hero-grid-layer-base">
        <HeroGridPattern id="ateoclock-hero-grid-pattern-base" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="hero-grid-layer hero-grid-layer-reveal"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <HeroGridPattern id="ateoclock-hero-grid-pattern-reveal" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
      <div className="hero-shell">
        {children}
      </div>
    </section>
  )
}

const STORES = [
  { name: 'Blinkit', logo: '/logos/blinkit.png' },
  { name: 'Amazon Fresh', logo: '/logos/amazon-fresh.png' },
  { name: 'Zepto', logo: '/logos/zepto.png' },
  { name: 'Flipkart Minutes', logo: '/logos/flipkart-minutes.png' },
  { name: 'BigBasket', logo: '/logos/big-basket.png' },
  { name: 'Instamart', logo: '/logos/instamart.png' },
  { name: 'Swiggy', logo: '/logos/swiggy.png' },
  { name: 'Zomato', logo: '/logos/zomato.png' },
]
const STORE_MARQUEE_GROUPS = 3
const HERO_TITLES = ['delivered', 'sorted', 'ordered']
const FEATURE_STICKY_TOP = 92

const FEATURE_STEPS = [
  {
    kicker: 'Capture',
    title: 'Screenshot or paste a link',
    highlight: 'from anywhere.',
    body: "Drop in a recipe screenshot, paste a link, or open a saved post. ate o'clock starts from the places you already save food ideas.",
    tags: ['Screenshots', 'Links', 'Saved posts'],
  },
  {
    kicker: 'Read',
    title: "ate o'clock reads the recipe",
    highlight: 'for you.',
    body: 'The recipe gets parsed into ingredients, quantities, timing, and prep notes so the cart is structured before you touch it.',
    tags: ['Ingredients', 'Quantities', 'Prep notes'],
  },
  {
    kicker: 'Build',
    title: 'Turn it into a cart',
    highlight: 'without typing.',
    body: 'Ingredients become an editable basket with quantities, swaps, and serving-size changes handled before checkout.',
    tags: ['Auto ingredients', 'Editable basket', 'Serving scale'],
  },
  {
    kicker: 'Choose',
    title: 'Pick the store',
    highlight: 'at the end.',
    body: 'Blinkit, Zepto, Instamart, and Amazon Fresh stay optional until the cart is complete, so the shopper chooses what works.',
    tags: ['Blinkit', 'Zepto', 'Instamart', 'Amazon Fresh'],
  },
  {
    kicker: 'Cook',
    title: 'Get dinner moving',
    highlight: "by 8 o'clock.",
    body: "After checkout, ate o'clock keeps the recipe flow clean: prep notes, timers, and what to do next.",
    tags: ['Prep mode', 'Timers', 'Cook tonight'],
  },
]

const CHECKOUT_DEMO_INGREDIENTS = [
  {
    id: 'acai-base',
    name: 'Organic acai base',
    note: 'Frozen, unsweetened',
    unit: 'pack',
    checkoutQty: '2 packs',
    price: 1064.63,
    defaultQty: 1,
  },
  {
    id: 'kiwi',
    name: 'Fresh kiwi',
    note: 'Pack of 4',
    unit: 'pack',
    checkoutQty: '4',
    price: 298.1,
    defaultQty: 1,
  },
  {
    id: 'blueberries',
    name: 'Fresh blueberries',
    note: 'Pint, seasonal',
    unit: 'pint',
    checkoutQty: '300g',
    price: 340,
    defaultQty: 0,
  },
  {
    id: 'granola',
    name: 'House granola',
    note: 'Almond and cinnamon',
    unit: 'bag',
    checkoutQty: '1 bag',
    price: 681.36,
    defaultQty: 1,
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    note: 'Fresh, 250g',
    unit: 'box',
    checkoutQty: '250g',
    price: 220,
    defaultQty: 0,
  },
  {
    id: 'bananas',
    name: 'Ripe bananas',
    note: 'Bunch of 5',
    unit: 'bunch',
    checkoutQty: '4',
    price: 68,
    defaultQty: 0,
  },
  {
    id: 'coconut',
    name: 'Coconut shaves',
    note: 'Toasted, 100g',
    unit: 'pack',
    checkoutQty: '100g',
    price: 145,
    defaultQty: 0,
  },
]

const CHECKOUT_DEMO_STORES = [
  {
    id: 'blinkit',
    name: 'Blinkit',
    eta: '10 min',
    multiplier: 0.98,
    logo: '/logos/blinkit.png',
    availability: 'available',
    detail: 'Complete cart, fastest delivery',
  },
  {
    id: 'zepto',
    name: 'Zepto',
    eta: '14 min',
    multiplier: 1.03,
    logo: '/logos/zepto.png',
    availability: 'available',
    detail: 'Fast delivery, fresh produce',
  },
  {
    id: 'amazon',
    name: 'Amazon Fresh',
    eta: 'Today',
    multiplier: 0.95,
    logo: '/logos/amazon-fresh.png',
    availability: 'available',
    detail: 'Lowest total, arrives today',
  },
  {
    id: 'split',
    name: 'Split cart',
    eta: '10 min + today',
    multiplier: 0.93,
    availability: 'available',
    detail: 'Amazon Fresh for kiwi and granola, Blinkit for berries',
  },
  {
    id: 'instamart',
    name: 'Instamart',
    eta: '12 min',
    multiplier: 1,
    logo: '/logos/instamart.png',
    availability: 'unavailable',
    detail: 'Missing organic acai base',
  },
  {
    id: 'bigbasket',
    name: 'BigBasket',
    eta: 'Tomorrow',
    multiplier: 1.02,
    logo: '/logos/big-basket.png',
    availability: 'unavailable',
    detail: 'Missing fresh kiwi',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    eta: '12 min',
    multiplier: 1.01,
    logo: '/logos/swiggy.png',
    availability: 'unavailable',
    detail: 'Missing house granola',
  },
  {
    id: 'zomato',
    name: 'Zomato',
    eta: '15 min',
    multiplier: 1.04,
    logo: '/logos/zomato.png',
    availability: 'unavailable',
    detail: 'Full cart unavailable',
  },
  {
    id: 'flipkart',
    name: 'Flipkart Minutes',
    eta: '18 min',
    multiplier: 1.05,
    logo: '/logos/flipkart-minutes.png',
    availability: 'unavailable',
    detail: 'Missing fresh blueberries',
  },
]

function formatRupees(amount: number) {
  return `Rs ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function RecipeCheckoutDemoSection() {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(CHECKOUT_DEMO_INGREDIENTS.map((ingredient) => [ingredient.id, ingredient.defaultQty])),
  )
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [checkoutStep, setCheckoutStep] = useState<'ingredients' | 'store'>('ingredients')

  const selectedStore = CHECKOUT_DEMO_STORES.find((store) => store.id === selectedStoreId && store.availability === 'available')
  const selectedItems = CHECKOUT_DEMO_INGREDIENTS.filter((ingredient) => (quantities[ingredient.id] ?? 0) > 0)
  const subtotal = CHECKOUT_DEMO_INGREDIENTS.reduce((sum, ingredient) => {
    return sum + ingredient.price * (quantities[ingredient.id] ?? 0)
  }, 0)
  const storeTotal = selectedStore ? subtotal * selectedStore.multiplier : null

  function updateQuantity(id: string, delta: number) {
    setQuantities((current) => ({
      ...current,
      [id]: Math.min(6, Math.max(0, (current[id] ?? 0) + delta)),
    }))
  }

  return (
    <section id="about" className="recipe-demo-section" aria-labelledby="recipe-demo-title">
      <div className="recipe-demo-shell">
        <div className="recipe-demo-heading">
          <p>How it works</p>
          <h2 id="recipe-demo-title">Pick a recipe. We&apos;ll handle the rest.</h2>
          <div>Select ingredients, choose a store, and check out in one tap.</div>
        </div>

        <div className="recipe-demo-grid">
          <div className="recipe-demo-image-card">
            <Image src="/acaii.jpeg" alt="Heritage acai bowl with kiwi, banana, berries, and granola" fill sizes="320px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
            <div className="recipe-demo-image-caption">
              <strong>Heritage Acai Bowl</strong>
              <span>Acai, kiwi, berries, granola</span>
            </div>
          </div>

          <div className="recipe-demo-panel">
            <div className="recipe-demo-panel-head">
              <span>{checkoutStep === 'ingredients' ? 'Pick ingredients' : 'Pick store'}</span>
              <strong>{selectedItems.length} selected</strong>
            </div>

            {checkoutStep === 'ingredients' ? (
              <>
                <div className="recipe-demo-list">
                  {CHECKOUT_DEMO_INGREDIENTS.map((ingredient) => {
                    const qty = quantities[ingredient.id] ?? 0
                    return (
                      <div className={`recipe-demo-item${qty > 0 ? ' is-selected' : ''}`} key={ingredient.id}>
                        <div>
                          <strong>{ingredient.name}</strong>
                          <span>{ingredient.note}</span>
                        </div>
                        <div className="recipe-demo-qty" aria-label={`${ingredient.name} quantity`}>
                          <button type="button" onClick={() => updateQuantity(ingredient.id, -1)} aria-label={`Remove ${ingredient.name}`}>-</button>
                          <span>{qty}</span>
                          <button type="button" onClick={() => updateQuantity(ingredient.id, 1)} aria-label={`Add ${ingredient.name}`}>+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="recipe-demo-actions">
                  <span>{selectedItems.length > 0 ? `${selectedItems.length} items selected` : 'Select at least one item'}</span>
                  <button
                    type="button"
                    className="recipe-demo-primary"
                    onClick={() => setCheckoutStep('store')}
                    disabled={selectedItems.length === 0}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="recipe-demo-list recipe-demo-summary-list" aria-label="Selected ingredients">
                  {selectedItems.map((ingredient) => {
                    const qty = quantities[ingredient.id] ?? 0
                    return (
                      <div className="recipe-demo-item is-selected" key={ingredient.id}>
                        <div>
                          <strong>{ingredient.name}</strong>
                          <span>{ingredient.note}</span>
                        </div>
                        <strong className="recipe-demo-summary-qty">x{qty}</strong>
                      </div>
                    )
                  })}
                </div>

                <div className="recipe-demo-store-block">
                  <div className="recipe-demo-select-label">Choose store</div>
                  <div className="recipe-demo-select-wrap">
                    <select
                      className="recipe-demo-select"
                      value={selectedStoreId}
                      onChange={(event) => setSelectedStoreId(event.target.value)}
                    >
                      <option value="">Select a store</option>
                      {CHECKOUT_DEMO_STORES.map((store) => {
                        const isUnavailable = store.availability === 'unavailable'
                        return (
                          <option disabled={isUnavailable} key={store.id} value={store.id}>
                            {isUnavailable
                              ? `${store.name} - unavailable`
                              : `${store.name} - ${store.eta}`}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  {selectedStore && (
                    <div className="recipe-demo-store-insight is-selected">
                      <span>{selectedStore.name}</span>
                      <strong>{selectedStore.detail}</strong>
                      <small>{selectedStore.eta} delivery estimate</small>
                    </div>
                  )}
                </div>

                <div className="recipe-demo-checkout">
                  <div>
                    <span>{selectedStore ? `Total via ${selectedStore.name}` : 'Cart total'}</span>
                    <strong className={!selectedStore ? 'recipe-demo-empty-total' : undefined}>
                      {storeTotal ? formatRupees(storeTotal) : '-'}
                    </strong>
                  </div>
                  <div className="recipe-demo-checkout-actions">
                    <button type="button" className="recipe-demo-secondary" onClick={() => setCheckoutStep('ingredients')}>
                      Edit
                    </button>
                    {selectedStore ? (
                      <a href="/waitlist">Checkout</a>
                    ) : (
                      <button type="button" className="recipe-demo-checkout-disabled" disabled>Checkout</button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function UpcomingFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [stageHeight, setStageHeight] = useState(620)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const features = FEATURE_STEPS
  const featureCount = features.length
  const lastFeatureIndex = Math.max(featureCount - 1, 1)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: [`start ${FEATURE_STICKY_TOP}px`, `end ${FEATURE_STICKY_TOP + stageHeight}px`],
  })
  const progress = scrollYProgress
  const stops = features.map((_, index) => index / lastFeatureIndex)
  const yValues = features.map((_, index) => -index * stageHeight)
  const trackY = useTransform(progress, stops, yValues)

  useEffect(() => {
    const updateStageHeight = () => {
      const nextHeight = Math.min(Math.max(window.innerHeight - 260, 500), 620)
      setStageHeight(nextHeight)
    }

    updateStageHeight()
    window.addEventListener('resize', updateStageHeight)
    return () => window.removeEventListener('resize', updateStageHeight)
  }, [])

  useMotionValueEvent(progress, 'change', (latest) => {
    const nextFeature = Math.min(featureCount - 1, Math.max(0, Math.round(latest * lastFeatureIndex)))
    setActiveFeature((current) => (current === nextFeature ? current : nextFeature))
  })

  const trackStyle = {
    '--feature-stage-height': `${stageHeight}px`,
    '--feature-sticky-top': `${FEATURE_STICKY_TOP}px`,
    minHeight: stageHeight * featureCount,
  } as React.CSSProperties

  const renderFeatureVisual = (index: number) => {
    if (index === 0) {
      return (
        <div className="feature-source-stack visual-capture">
          <div className="feature-source-input">
            <span>Paste a link</span>
            <strong>instagram.com/reel/acai-bowl</strong>
          </div>
          <div className="feature-source-card is-image">
            <Image src="/acaii.jpeg" alt="" fill sizes="360px" style={{ objectFit: 'cover' }} />
            <div className="feature-source-overlay">
              <span>Saved post</span>
              <strong>Acai Bowl</strong>
            </div>
          </div>
          <div className="feature-floating-note note-one">Instagram reel</div>
          <div className="feature-floating-note note-two">Recipe screenshot</div>
          <div className="feature-capture-bar">
            <span>Recipe found</span>
            <strong>Screenshot or link accepted</strong>
          </div>
        </div>
      )
    }

    if (index === 1) {
      return (
        <div className="feature-read-card visual-read">
          <div className="feature-scan-line" />
          <div className="feature-card-header">
            <span>Recipe detected</span>
            <strong>Acai Bowl</strong>
          </div>
          <div className="feature-read-grid">
            {[
              ['Ingredients', '12 found'],
              ['Servings', '4 people'],
              ['Prep time', '10 min'],
              ['Steps', '4 steps'],
            ].map(([label, value], tileIndex) => (
              <div className="feature-read-tile" key={label} style={{ animationDelay: `${tileIndex * 160}ms` }}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="feature-read-line">Reading creator notes and turning them into a clean shopping flow...</div>
        </div>
      )
    }

    if (index === 2) {
      return (
        <div className="feature-cart-card visual-cart visual-bucket">
          <div className="feature-card-header">
            <span>Editable grocery basket</span>
            <strong>Serves 4</strong>
          </div>
          <div className="feature-bucket-wrap">
            <Bucket />
          </div>
        </div>
      )
    }

    if (index === 3) {
      return (
        <div className="feature-store-card visual-store">
          <div className="feature-card-header">
            <span>Choose store</span>
            <strong>Cart built</strong>
          </div>
          {[
            ['Blinkit', 'Rs 1,860', '/logos/blinkit.png'],
            ['Zepto', 'Rs 1,905', '/logos/zepto.png'],
            ['Instamart', 'Rs 1,890', '/logos/instamart.png'],
            ['Amazon Fresh', 'Rs 1,940', '/logos/amazon-fresh.png'],
          ].map(([store, price, logo], rowIndex) => (
            <div className={`feature-store-row${rowIndex === 0 ? ' is-selected' : ''}`} key={store} style={{ animationDelay: `${rowIndex * 150}ms` }}>
              <span className="feature-store-logo">
                <Image src={logo} alt="" fill sizes="28px" style={{ objectFit: 'contain' }} />
              </span>
              <span>{store}</span>
              <strong>{price}</strong>
            </div>
          ))}
          <div className="feature-checkout-button">Checkout on Blinkit →</div>
        </div>
      )
    }

    return (
      <div className="feature-cook-card visual-cook">
        <div className="feature-card-header">
          <span>Acai Bowl prep mode</span>
          <strong>Step 2 of 4</strong>
        </div>
        <div className="feature-timer"><span>00:45</span></div>
        <h3>Blend until thick</h3>
        <p>Blend frozen acai, banana, and a splash of milk. Stop when the texture is scoopable, not drinkable.</p>
        <div className="feature-cook-progress"><span /></div>
        <div className="feature-next-step">Next step: Add toppings</div>
      </div>
    )
  }

  return (
    <section id="features" className="sticky-feature-section">
      <div className="sticky-feature-shell">
        <div className="sticky-feature-heading">
          <p>Features</p>
          <h2>
            Everything ate o&apos;clock can do
          </h2>
        </div>

        <div ref={scrollRef} className="sticky-feature-scroll" style={trackStyle}>
          <div className="sticky-feature-viewport">
            <div className="feature-copy-window">
              <motion.div
                key={features[activeFeature].title}
                className="sticky-feature-card is-active"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: 'easeOut' }}
              >
                <div className="sticky-feature-card-inner">
                  <div className="sticky-feature-index">0{activeFeature + 1}</div>
                  <p>{features[activeFeature].kicker}</p>
                  <h3>
                    {features[activeFeature].title}{' '}
                    <span>{features[activeFeature].highlight}</span>
                  </h3>
                  <div>{features[activeFeature].body}</div>
                  <div className="sticky-feature-tags">
                    {features[activeFeature].tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="feature-visual-window" aria-hidden="true">
              <motion.div className="feature-visual-track" style={{ y: trackY }}>
                {features.map((feature, index) => (
                  <div className={`feature-visual-panel${activeFeature === index ? ' is-active' : ''}`} key={`visual-${feature.title}`}>
                    <div className="sticky-feature-asset">
                      <div className="sticky-feature-asset-top">
                        <span>{feature.kicker}</span>
                        <span>{String(index + 1).padStart(2, '0')} / {String(featureCount).padStart(2, '0')}</span>
                      </div>
                      <div className="sticky-visual-stage">
                        {renderFeatureVisual(index)}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="feature-mobile-stack">
          {features.map((feature, index) => (
            <article className="feature-mobile-scene" key={`mobile-${feature.title}`}>
              <div className="sticky-feature-card is-active">
                <div className="sticky-feature-card-inner">
                  <div className="sticky-feature-index">0{index + 1}</div>
                  <p>{feature.kicker}</p>
                  <h3>
                    {feature.title}{' '}
                    <span>{feature.highlight}</span>
                  </h3>
                  <div>{feature.body}</div>
                  <div className="sticky-feature-tags">
                    {feature.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sticky-feature-asset" aria-hidden="true">
                <div className="sticky-feature-asset-top">
                  <span>{feature.kicker}</span>
                  <span>{String(index + 1).padStart(2, '0')} / {String(featureCount).padStart(2, '0')}</span>
                </div>
                <div className="sticky-visual-stage">
                  {renderFeatureVisual(index)}
                </div>
              </div>
            </article>
          ))}
        </div>

          </div>
    </section>
  )
}

function CreatorsSection() {
  return (
    <section id="creators" className="creators-section" aria-labelledby="creators-title">
      <div className="creators-shell">

        {/* LEFT - copy */}
        <div className="creators-copy">
          <p>For creators</p>
          <h2 id="creators-title">Earn when your audience shops your recipes.</h2>
          <div>Share one ate o&apos;clock link. When followers buy groceries through your recipe, you earn from every eligible order.</div>

          {/* Steps */}
          <div className="creator-steps">
            {[
              { n: '01', label: 'Share', sub: 'Post your recipe link' },
              { n: '02', label: 'Shop',  sub: 'Followers order groceries' },
              { n: '03', label: 'Earn',  sub: 'Payout lands in your account' },
            ].map(({ n, label, sub }, i, arr) => (
              <Fragment key={n}>
                <div className="creator-step">
                  <div className="creator-step-num">{n}</div>
                  <div>
                    <strong>{label}</strong>
                    <span>{sub}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="creator-step-arrow">→</div>}
              </Fragment>
            ))}
          </div>

          <a href="/waitlist?role=creator">Get creator access</a>
        </div>

        {/* RIGHT - live earnings card */}
        <div className="creator-earn-card" aria-label="Creator earnings demo">
          <div className="creator-earn-header">
            <div>
              <div className="creator-earn-label">Last 7 days</div>
              <div className="creator-earn-amount">Rs 4,096</div>
            </div>
            <div className="creator-earn-badge">↑ 18% this week</div>
          </div>

          <div className="creator-earn-rows">
            {[
              { recipe: 'Butter Chicken',  orders: '142 orders', pct: 86,  earn: 'Rs 1,340' },
              { recipe: 'Pizza',           orders: '61 orders',  pct: 48,  earn: 'Rs 890' },
              { recipe: 'Acai Bowl',       orders: '48 orders',  pct: 36,  earn: 'Rs 610' },
            ].map(({ recipe, orders, pct, earn }) => (
              <div className="creator-earn-row" key={recipe}>
                <div className="creator-earn-row-top">
                  <strong>{recipe}</strong>
                  <span className="creator-earn-row-earn">{earn}</span>
                </div>
                <div className="creator-earn-row-meta">{orders}</div>
                <div className="creator-earn-track">
                  <div className="creator-earn-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="creator-earn-footer">
            <span>Eligible grocery payout</span>
            <strong>Paid every Monday</strong>
          </div>
        </div>

      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "What is ate o'clock?",
    a: "ate o'clock is a platform that turns any recipe into a grocery order. Pick a recipe, select your ingredients, choose a delivery store like Blinkit or Zepto, and check out - all in one tap.",
  },
  {
    q: "Which grocery stores does ate o'clock support?",
    a: "We currently support Blinkit, Zepto, Amazon Fresh, BigBasket, and Instamart. More stores are being added before launch.",
  },
  {
    q: "Is ate o'clock free to use?",
    a: "Yes - ate o'clock is free for home cooks. You only pay for the groceries you order through the store of your choice.",
  },
  {
    q: "When will ate o'clock launch?",
    a: "We're in early access right now. Join the waitlist and we'll notify you the moment we go live - early members get priority access.",
  },
  {
    q: "Does ate o'clock adjust for servings?",
    a: "Yes. Scale up or down the number of servings and the ingredient quantities - and the grocery list - update automatically.",
  },
  {
    q: "What countries is ate o'clock available in?",
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
    <section id="faq" style={{ background: BG, padding: '88px 28px', borderTop: `1px solid rgba(107,62,30,.08)` }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: BROWN, opacity: .6 }}>FAQs</span>
        </div>
        <h2 style={{ fontFamily: INTER_REGULAR, fontSize: 'clamp(1.6rem,2.8vw,2.1rem)', fontWeight: 400, letterSpacing: '-0.03em', color: RED, textAlign: 'center', marginBottom: 48, lineHeight: 1.2 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: isOpen ? `1.5px solid rgba(107,62,30,.18)` : `1.5px solid rgba(116,130,63,.12)`, background: isOpen ? '#FDF8EE' : WHITE, transition: 'background 0.2s, border-color 0.2s' }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 20, fontFamily: 'inherit' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: isOpen ? BROWN : RED, lineHeight: 1.4, transition: 'color 0.2s' }}>{faq.q}</span>
                  <span style={{ width: 26, height: 26, borderRadius: '50%', background: isOpen ? BROWN : `rgba(116,130,63,.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, color: isOpen ? WHITE : RED, transition: 'all 0.2s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', lineHeight: 1 }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 22px 20px', fontSize: 14, color: RED, lineHeight: 1.85, borderTop: `1px solid rgba(107,62,30,.08)`, paddingTop: 14 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [cartFill, setCartFill] = useState(0)
  const [heroTitleNumber, setHeroTitleNumber] = useState(0)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)
  const [navOpen, setNavOpen] = useState(false)

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

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setNavOpen(false)
  }

  const navItems: Array<{ label: string; sectionId: string; href?: string }> = [
    { label: 'About', sectionId: 'about', href: '/team' },
    { label: 'Features', sectionId: 'features' },
    { label: 'For Creators', sectionId: 'creators' },
    { label: 'FAQs', sectionId: 'faq' },
  ]


  const ingredients = ['Frozen acai', 'Banana', 'Granola', 'Mixed berries']

  return (
    <main style={{ background: BG, color: RED, fontFamily: "var(--font-inter), sans-serif", overflowX: 'clip' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html {
          position: relative;
          scroll-behavior: smooth;
        }

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
        @keyframes splitGlow { 0%,100% { box-shadow: inset 0 0 0 0 rgba(116,130,63,0); } 50% { box-shadow: inset 0 0 0 1px rgba(116,130,63,.16); } }
        @keyframes typeFill { 0%, 16% { max-width: 0; opacity: .42; } 46%, 100% { max-width: 100%; opacity: 1; } }
        @keyframes scanDown { 0% { transform: translateY(-18px); opacity: 0; } 18%, 72% { opacity: 1; } 100% { transform: translateY(178px); opacity: 0; } }
        @keyframes rowCheck { 0% { opacity: 0; transform: translateX(-14px); } 28%, 100% { opacity: 1; transform: translateX(0); } }
        @keyframes storeSelect { 0%, 100% { box-shadow: 0 0 0 rgba(116,130,63,0); } 50% { box-shadow: 0 12px 24px rgba(116,130,63,.14); } }
        @keyframes timerSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes statusPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .72; transform: scale(.97); } }
        @keyframes floatCardIn { 0%, 18% { opacity: 0; transform: translateY(18px) rotate(-2deg); } 42%, 100% { opacity: 1; transform: translateY(0) rotate(0deg); } }
        @keyframes progressFill { 0%, 14% { transform: scaleX(.18); } 68%, 100% { transform: scaleX(.72); } }
        @keyframes nextStepSlide { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(-5px); opacity: .82; } }

        .float-a { animation: floatUp   5s ease-in-out infinite; }
        .float-b { animation: floatDown 6s ease-in-out infinite 1s; }
        .fade-up { animation: fadeUp .65s ease both; }
        .card-hover { transition: transform .2s, box-shadow .2s; cursor: pointer; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(116,130,63,.14); }

        input:focus { outline:none; box-shadow: 0 0 0 3px rgba(116,130,63,.18); }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background: rgba(116,130,63,.2); border-radius:3px; }

        .store-pill {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1.5px solid rgba(116,130,63,.18);
          font-size: 12px;
          font-weight: 600;
          color: ${RED};
          background: ${WHITE};
          margin: 4px;
          transition: all .15s;
        }
        .store-pill:hover { background: ${RED}; color: ${CREAM}; border-color: ${RED}; }

        .drop-zone {
          border: 2px dashed rgba(116,130,63,.25);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all .2s;
          background: ${WHITE};
        }
        .drop-zone.over {
          border-color: ${RED};
          background: rgba(116,130,63,.04);
        }
        .drop-zone:hover {
          border-color: rgba(116,130,63,.45);
        }

        .nav-desktop {
          display: flex;
          gap: 18px;
          align-items: center;
        }
        .nav-logo-link {
          display: inline-flex;
          align-items: center;
          color: inherit;
          text-decoration: none;
          border-radius: 8px;
          outline-offset: 6px;
        }
        .nav-logo-link:focus-visible {
          outline: 2px solid rgba(116,130,63,.45);
        }
        .nav-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid rgba(116,130,63,.2);
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

        .hero-section {
          position: relative;
          min-height: auto;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 92px 28px 72px;
          background: ${BG};
          border-bottom: 1px solid rgba(116,130,63,.08);
        }
        .hero-grid-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          color: ${RED};
          pointer-events: none;
        }
        .hero-grid-layer-base {
          opacity: .15;
        }
        .hero-grid-layer-reveal {
          opacity: .68;
        }
        .hero-grid-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .hero-shell {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          width: 100%;
          margin: 0 auto;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(320px, .9fr) minmax(420px, 1.1fr);
          gap: 88px;
          align-items: center;
        }
        .hero-copy {
          max-width: 470px;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 12px;
          margin-bottom: 18px;
          border-radius: 8px;
          border: 1px solid rgba(107,62,30,.16);
          background: rgba(255,255,255,.46);
          color: ${BROWN};
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .hero-title {
          color: ${RED};
          font-family: ${INTER_REGULAR};
          font-size: clamp(2.25rem, 3.45vw, 3.55rem);
          font-weight: 400;
          line-height: 1.06;
          letter-spacing: -0.04em;
          margin-bottom: 22px;
        }
        .hero-title-word {
          display: inline-flex;
          min-width: 8.4ch;
          align-items: baseline;
          vertical-align: bottom;
          color: ${RED2};
          overflow: hidden;
          line-height: 1.1;
        }
        .hero-title-word span {
          display: inline-block;
          color: ${RED2};
        }
        .hero-title-nowrap {
          display: inline-flex;
          align-items: baseline;
          gap: .34ch;
          white-space: nowrap;
        }
        .hero-body {
          max-width: 420px;
          margin-bottom: 34px;
          color: rgba(116,130,63,.72);
          font-size: 17px;
          line-height: 1.72;
        }
        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
        .hero-primary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 30px;
          border-radius: 8px;
          background: ${RED};
          color: ${CREAM};
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0;
          text-decoration: none;
          transition: opacity .18s ease, transform .18s ease;
        }
        .hero-primary-link:hover {
          opacity: .9;
          transform: translateY(-1px);
        }
        .hero-waitlist-count {
          color: rgba(116,130,63,.55);
          font-size: 13px;
        }
        .hero-waitlist-count span {
          color: ${RED};
          font-weight: 800;
        }
        .hero-visual {
          position: relative;
          min-height: 500px;
        }
        .hero-card {
          position: absolute;
          border: 1px solid rgba(116,130,63,.11);
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(14px);
          box-shadow: 0 30px 90px rgba(116,130,63,.13);
          color: ${RED};
        }
        .hero-recipe-card {
          top: 56px;
          left: 4px;
          width: min(48%, 300px);
          border-radius: 18px;
          padding: 24px;
        }
        .hero-cart-card {
          right: 0;
          bottom: 28px;
          z-index: 2;
          width: min(50%, 310px);
          border-radius: 18px;
          padding: 22px;
        }
        .hero-card-label {
          margin-bottom: 12px;
          color: rgba(116,130,63,.45);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .hero-recipe-title {
          margin-bottom: 6px;
          color: ${RED};
          font-size: 20px;
          font-weight: 800;
          line-height: 1.1;
        }
        .hero-recipe-byline {
          margin-bottom: 18px;
          color: rgba(116,130,63,.52);
          font-size: 13px;
        }
        .hero-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-chip-row span {
          padding: 5px 10px;
          border-radius: 8px;
          background: rgba(116,130,63,.08);
          color: ${RED};
          font-size: 11px;
          font-weight: 700;
        }
        .hero-cart-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .hero-cart-row {
          display: flex;
          align-items: center;
          gap: 10px;
          transition: opacity .3s ease;
        }
        .hero-cart-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background .3s ease;
        }
        .hero-cart-row span:last-child {
          color: ${RED};
          font-size: 13px;
        }
        .hero-order-button {
          margin-top: 16px;
          padding: 12px 0;
          border-radius: 8px;
          background: ${RED};
          color: ${CREAM};
          font-size: 13px;
          font-weight: 800;
          text-align: center;
        }
        .hero-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          z-index: 1;
          border-radius: 999px;
          background: ${BROWN};
          padding: 11px 20px;
          box-shadow: 0 18px 48px rgba(107,62,30,.2);
          animation: pulse 2.4s ease-in-out infinite;
        }
        .hero-pulse span {
          color: ${CREAM};
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }
        .store-strip-section {
          background: linear-gradient(0deg, rgba(255,255,255,.38), rgba(255,255,255,.38)), ${BG};
          padding: 30px 0 34px;
          border-top: 1px solid rgba(116,130,63,.07);
          border-bottom: 1px solid rgba(116,130,63,.07);
          overflow: hidden;
        }
        .store-strip-label {
          margin-bottom: 22px;
          color: rgba(116,130,63,.42);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .12em;
          text-align: center;
          text-transform: uppercase;
        }
        .store-marquee-window {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .store-marquee-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 88px;
          z-index: 2;
          pointer-events: none;
        }
        .store-marquee-edge-left {
          left: 0;
          background: linear-gradient(to right, ${BG}, transparent);
        }
        .store-marquee-edge-right {
          right: 0;
          background: linear-gradient(to left, ${BG}, transparent);
        }
        .store-marquee-group {
          display: flex;
          flex-shrink: 0;
          gap: 20px;
          padding-right: 20px;
        }
        .store-chip {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          min-height: 48px;
          padding: 0 22px;
          border-radius: 8px;
          border: 1.5px solid rgba(116,130,63,.12);
          background: rgba(255,255,255,.78);
          color: ${RED};
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }
        .recipe-demo-section {
          background:
            linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.28)),
            ${BG};
          padding: 62px 24px 64px;
          border-bottom: 1px solid rgba(116,130,63,.08);
        }
        .recipe-demo-shell {
          max-width: 980px;
          margin: 0 auto;
        }
        .recipe-demo-heading {
          max-width: 640px;
          margin: 0 auto 28px;
          text-align: center;
        }
        .recipe-demo-heading p,
        .recipe-demo-panel-head span {
          color: rgba(107,62,30,.58);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .recipe-demo-heading h2 {
          margin: 10px 0 10px;
          color: ${RED};
          font-family: ${INTER_REGULAR};
          font-size: 36px;
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: 0;
        }
        .recipe-demo-heading > div {
          color: rgba(116,130,63,.72);
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
        }
        .recipe-demo-grid {
          display: grid;
          grid-template-columns: 320px minmax(0, 540px);
          justify-content: center;
          gap: 24px;
          align-items: start;
        }
        .recipe-demo-image-card {
          position: relative;
          width: 320px;
          height: 486px;
          overflow: hidden;
          border: 1px solid rgba(116,130,63,.14);
          border-radius: 8px;
          background: ${BG};
          box-shadow: 0 20px 54px rgba(116,130,63,.12);
        }
        .recipe-demo-image-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 52%, rgba(47,30,16,.24));
          pointer-events: none;
        }
        .recipe-demo-image-card img {
          object-position: center;
        }
        .recipe-demo-image-caption {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          z-index: 2;
          border: 1px solid rgba(241,232,199,.56);
          border-radius: 8px;
          background: rgba(241,232,199,.9);
          color: ${RED};
          padding: 10px 12px;
          backdrop-filter: blur(10px);
        }
        .recipe-demo-image-caption strong,
        .recipe-demo-image-caption span {
          display: block;
        }
        .recipe-demo-image-caption strong {
          color: ${RED};
          font-size: 15px;
          line-height: 1.1;
        }
        .recipe-demo-image-caption span {
          margin-top: 5px;
          color: rgba(116,130,63,.66);
          font-size: 11px;
          font-weight: 700;
        }
        .recipe-demo-panel {
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(116,130,63,.13);
          border-radius: 8px;
          background: rgba(255,255,255,.76);
          box-shadow: 0 20px 58px rgba(116,130,63,.1);
          overflow: hidden;
        }
        .recipe-demo-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
        }
        .recipe-demo-panel-head strong {
          color: ${BROWN};
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .recipe-demo-list {
          border-top: 1px solid rgba(116,130,63,.08);
          border-bottom: 1px solid rgba(116,130,63,.08);
          max-height: 382px;
          overflow-y: auto;
        }
        .recipe-demo-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          min-height: 54px;
          padding: 8px 14px;
          background: rgba(255,255,255,.56);
          transition: background .18s ease;
        }
        .recipe-demo-item + .recipe-demo-item {
          border-top: 1px solid rgba(116,130,63,.07);
        }
        .recipe-demo-item.is-selected {
          background: rgba(116,130,63,.045);
        }
        .recipe-demo-item strong,
        .recipe-demo-item span {
          display: block;
        }
        .recipe-demo-item strong {
          color: ${RED};
          font-size: 13px;
          line-height: 1.2;
        }
        .recipe-demo-item span {
          margin-top: 4px;
          color: rgba(116,130,63,.58);
          font-size: 11px;
          font-weight: 700;
        }
        .recipe-demo-qty {
          display: inline-grid;
          grid-template-columns: 28px 24px 28px;
          align-items: center;
          min-height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(107,62,30,.11);
          background: rgba(241,232,199,.75);
          overflow: hidden;
        }
        .recipe-demo-qty button {
          width: 28px;
          height: 32px;
          border: 0;
          background: transparent;
          color: ${BROWN};
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          transition: background .18s ease, color .18s ease;
        }
        .recipe-demo-qty button:hover {
          background: ${RED};
          color: ${CREAM};
        }
        .recipe-demo-qty span {
          margin: 0;
          color: ${RED};
          font-size: 12px;
          font-weight: 800;
          text-align: center;
        }
        .recipe-demo-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(241,232,199,.48);
        }
        .recipe-demo-actions span {
          color: rgba(107,62,30,.6);
          font-size: 12px;
          font-weight: 800;
        }
        .recipe-demo-primary,
        .recipe-demo-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          border: 1px solid rgba(107,62,30,.14);
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .04em;
          transition: opacity .18s ease, transform .18s ease, background .18s ease;
        }
        .recipe-demo-primary {
          padding: 0 22px;
          background: ${RED};
          color: ${CREAM};
        }
        .recipe-demo-primary:disabled {
          cursor: not-allowed;
          opacity: .45;
        }
        .recipe-demo-secondary {
          padding: 0 16px;
          background: rgba(255,255,255,.66);
          color: ${BROWN};
        }
        .recipe-demo-primary:not(:disabled):hover,
        .recipe-demo-secondary:hover,
        .recipe-demo-checkout a:hover {
          transform: translateY(-1px);
        }
        .recipe-demo-store-block {
          padding: 14px;
          border-top: 1px solid rgba(116,130,63,.08);
        }
        .recipe-demo-select-label {
          display: block;
          margin-bottom: 8px;
          color: rgba(107,62,30,.58);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .recipe-demo-select {
          width: 100%;
          min-height: 42px;
          border: 1px solid rgba(116,130,63,.16);
          border-radius: 8px;
          background: rgba(255,255,255,.82);
          color: ${RED};
          appearance: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          padding: 0 44px 0 12px;
        }
        .recipe-demo-select-wrap {
          position: relative;
        }
        .recipe-demo-select-wrap::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 16px;
          width: 9px;
          height: 9px;
          border-right: 2px solid rgba(107,62,30,.62);
          border-bottom: 2px solid rgba(107,62,30,.62);
          pointer-events: none;
          transform: translateY(-64%) rotate(45deg);
        }
        .recipe-demo-store-insight {
          margin-top: 10px;
          min-height: 72px;
          border: 1px solid rgba(116,130,63,.1);
          border-radius: 8px;
          background: rgba(241,232,199,.42);
          padding: 12px;
        }
        .recipe-demo-store-insight.is-selected {
          background: rgba(116,130,63,.06);
          border-color: rgba(116,130,63,.16);
        }
        .recipe-demo-store-insight span,
        .recipe-demo-store-insight strong,
        .recipe-demo-store-insight small {
          display: block;
        }
        .recipe-demo-store-insight span {
          color: rgba(107,62,30,.55);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .recipe-demo-store-insight strong {
          margin-top: 5px;
          color: ${RED};
          font-size: 13px;
          line-height: 1.35;
        }
        .recipe-demo-store-insight small {
          margin-top: 4px;
          color: rgba(116,130,63,.58);
          font-size: 11px;
          font-weight: 700;
        }
        .recipe-demo-store-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .recipe-demo-store-option {
          width: 100%;
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          align-items: center;
          gap: 11px;
          min-height: 62px;
          border: 1px solid rgba(116,130,63,.11);
          border-radius: 8px;
          background: rgba(255,255,255,.72);
          padding: 9px 10px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, opacity .18s ease;
        }
        .recipe-demo-store-option:hover,
        .recipe-demo-store-option.is-active {
          background: rgba(255,255,255,.96);
          border-color: rgba(107,62,30,.22);
          box-shadow: 0 8px 20px rgba(116,130,63,.08);
        }
        .recipe-demo-store-option.is-unavailable {
          cursor: not-allowed;
          opacity: .42;
          filter: saturate(.7);
        }
        .recipe-demo-store-logo {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(241,232,199,.78);
          overflow: hidden;
          color: ${BROWN};
          font-size: 12px;
          font-weight: 800;
        }
        .recipe-demo-store-copy strong,
        .recipe-demo-store-copy small,
        .recipe-demo-store-price strong,
        .recipe-demo-store-price small {
          display: block;
        }
        .recipe-demo-store-copy strong {
          color: ${RED};
          font-size: 13px;
          line-height: 1.2;
        }
        .recipe-demo-store-copy small {
          margin-top: 3px;
          color: rgba(116,130,63,.58);
          font-size: 10.5px;
          font-weight: 700;
          line-height: 1.25;
        }
        .recipe-demo-store-price {
          text-align: right;
        }
        .recipe-demo-store-price strong {
          color: ${BROWN};
          font-size: 12px;
          line-height: 1.2;
          white-space: nowrap;
        }
        .recipe-demo-store-price small {
          margin-top: 4px;
          color: rgba(116,130,63,.55);
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }
        .recipe-demo-summary {
          display: grid;
          gap: 8px;
          padding: 14px;
        }
        .recipe-demo-summary-list {
          max-height: 240px;
          overflow-y: auto;
        }
        .recipe-demo-summary-list .recipe-demo-item {
          min-height: 50px;
        }
        .recipe-demo-summary-qty {
          color: ${BROWN};
          font-size: 12px;
          white-space: nowrap;
        }
        .recipe-demo-summary div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 34px;
          border: 1px solid rgba(116,130,63,.09);
          border-radius: 8px;
          background: rgba(255,255,255,.58);
          padding: 0 12px;
        }
        .recipe-demo-summary span,
        .recipe-demo-summary strong {
          color: ${RED};
          font-size: 12px;
          font-weight: 800;
        }
        .recipe-demo-checkout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-top: 1px solid rgba(116,130,63,.1);
          background: rgba(241,232,199,.7);
          padding: 14px;
        }
        .recipe-demo-checkout span,
        .recipe-demo-checkout strong {
          display: block;
        }
        .recipe-demo-checkout span {
          margin-bottom: 5px;
          color: rgba(107,62,30,.55);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .recipe-demo-checkout strong {
          color: ${BROWN};
          font-family: ${INTER_REGULAR};
          font-size: 28px;
          line-height: 1;
        }
        .recipe-demo-checkout .recipe-demo-empty-total {
          color: rgba(107,62,30,.32);
          font-family: inherit;
          font-size: 20px;
          font-weight: 400;
          line-height: 1;
        }
        .recipe-demo-checkout-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .recipe-demo-checkout a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 0 18px;
          border-radius: 8px;
          background: ${RED};
          color: ${CREAM};
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          text-decoration: none;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .recipe-demo-checkout-disabled {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 0 18px;
          border: 0;
          border-radius: 8px;
          background: rgba(116,130,63,.14);
          color: rgba(107,62,30,.46);
          cursor: not-allowed;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .features-section {
          position: relative;
          background:
            linear-gradient(180deg, rgba(255,255,255,.46), rgba(255,255,255,.2)),
            ${BG};
          border-top: 1px solid rgba(116,130,63,.08);
          padding: 64px 28px 68px;
        }
        .features-shell {
          max-width: 1180px;
          margin: 0 auto;
        }
        .features-heading {
          display: grid;
          grid-template-columns: minmax(240px, 460px) minmax(220px, 360px);
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 26px;
        }
        .features-heading p {
          grid-column: 1 / -1;
          margin-bottom: -12px;
          color: ${BROWN};
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .16em;
          text-transform: uppercase;
          opacity: .58;
        }
        .features-heading h2 {
          color: ${RED};
          font-family: ${INTER_REGULAR};
          font-size: clamp(1.75rem, 3vw, 2.55rem);
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 1.08;
        }
        .features-heading span {
          color: rgba(116,130,63,.66);
          font-size: 14px;
          font-weight: 700;
          line-height: 1.6;
        }
        .features-board {
          display: grid;
          grid-template-columns: minmax(320px, .86fr) minmax(420px, 1.14fr);
          gap: 34px;
          align-items: stretch;
        }
        .features-list {
          display: grid;
          gap: 10px;
          align-content: start;
        }
        .feature-choice {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 14px;
          width: 100%;
          min-height: 98px;
          border: 1px solid rgba(116,130,63,.12);
          border-radius: 8px;
          background: rgba(255,255,255,.68);
          color: ${RED};
          cursor: pointer;
          font-family: inherit;
          padding: 14px;
          text-align: left;
          transition: background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease;
        }
        .feature-choice:hover,
        .feature-choice.is-active {
          background: rgba(255,255,255,.96);
          border-color: rgba(107,62,30,.2);
          box-shadow: 0 14px 28px rgba(116,130,63,.08);
          transform: translateY(-1px);
        }
        .feature-choice-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: rgba(116,130,63,.08);
          color: rgba(107,62,30,.62);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
        }
        .feature-choice.is-active .feature-choice-index {
          background: ${BROWN};
          color: ${CREAM};
        }
        .feature-choice-copy > span {
          display: block;
          margin-bottom: 5px;
          color: rgba(107,62,30,.58);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .feature-choice h3 {
          margin-bottom: 5px;
          color: ${RED};
          font-family: ${INTER_REGULAR};
          font-size: clamp(1.05rem, 1.8vw, 1.45rem);
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: 0;
        }
        .feature-choice h3 span {
          color: ${RED2};
        }
        .feature-choice small {
          display: block;
          color: rgba(116,130,63,.64);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
        }
        .feature-showcase-card {
          display: flex;
          flex-direction: column;
          min-height: 574px;
          border: 1px solid rgba(116,130,63,.12);
          border-radius: 8px;
          background:
            linear-gradient(rgba(116,130,63,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(116,130,63,.035) 1px, transparent 1px),
            rgba(255,255,255,.72);
          background-size: 18px 18px, 18px 18px, auto;
          box-shadow: 0 28px 70px rgba(116,130,63,.11);
          padding: 22px;
          overflow: hidden;
        }
        .feature-showcase-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: rgba(107,62,30,.54);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .feature-showcase-top strong {
          color: ${BROWN};
        }
        .feature-showcase-visual {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: auto;
          min-height: 0;
          padding: 8px 0;
          opacity: 1;
          transform: none;
          filter: none;
        }
        .feature-showcase-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(116,130,63,.08);
        }
        .feature-showcase-tags span {
          padding: 7px 10px;
          border-radius: 8px;
          border: 1px solid rgba(116,130,63,.14);
          background: rgba(255,255,255,.62);
          color: ${RED};
          font-size: 11px;
          font-weight: 700;
        }
        .sticky-feature-section {
          position: relative;
          background: ${BG};
          border-top: 1px solid rgba(116,130,63,.08);
          padding: 78px 28px 20px;
          overflow: visible;
        }
        .sticky-feature-shell {
          max-width: 1180px;
          margin: 0 auto;
        }
        .sticky-feature-heading {
          max-width: none;
          margin: 0 0 8px;
          text-align: center;
        }
        .sticky-feature-heading p {
          margin-bottom: 12px;
          color: ${RED};
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .16em;
          text-transform: uppercase;
          opacity: .45;
        }
        .sticky-feature-heading h2 {
          max-width: 620px;
          margin: 0 auto;
          color: ${RED};
          font-family: ${INTER_REGULAR};
          font-size: clamp(1.8rem,3vw,2.6rem);
          font-weight: 400;
          letter-spacing: -0.03em;
        }
        .sticky-feature-scroll {
          position: relative;
          display: block;
        }
        .sticky-feature-viewport {
          position: sticky;
          top: var(--feature-sticky-top, 104px);
          height: var(--feature-stage-height, 620px);
          display: grid;
          grid-template-columns: minmax(360px, .85fr) minmax(430px, 1.15fr);
          gap: 72px;
          align-items: stretch;
          overflow: hidden;
        }
        .feature-copy-window,
        .feature-visual-window {
          height: var(--feature-stage-height, 620px);
          overflow: hidden;
        }
        .feature-copy-track,
        .feature-visual-track {
          will-change: transform;
        }
        .feature-copy-panel,
        .feature-visual-panel {
          height: var(--feature-stage-height, 620px);
          display: flex;
          align-items: center;
        }
        .feature-visual-panel {
          padding: 10px 0;
          opacity: .28;
          transform: scale(.94);
          filter: saturate(.78);
          transition: opacity .28s ease, transform .28s ease, filter .28s ease;
        }
        .feature-visual-panel.is-active {
          opacity: 1;
          transform: scale(1);
          filter: saturate(1);
        }
        .feature-showcase-card .feature-showcase-visual {
          height: auto;
          min-height: 0;
          padding: 8px 0;
          opacity: 1;
          transform: none;
          filter: none;
        }
        .feature-visual-panel:not(.is-active) {
          pointer-events: none;
        }
        .feature-mobile-stack {
          display: none;
        }
        .sticky-feature-asset {
          position: relative;
          width: 100%;
          height: calc(var(--feature-stage-height, 620px) - 36px);
          min-height: 440px;
          padding: 0;
          overflow: visible;
          border: none;
          background: transparent;
          box-shadow: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .sticky-feature-orbit {
          display: none;
        }
        .sticky-feature-orbit-a {
          width: 360px;
          height: 360px;
          top: -140px;
          right: -120px;
        }
        .sticky-feature-orbit-b {
          width: 260px;
          height: 260px;
          left: -90px;
          bottom: -84px;
          border-color: rgba(166,95,45,.13);
        }
        .sticky-feature-asset-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          width: min(100%, 430px);
          margin: 0 auto 18px;
          color: rgba(116,130,63,.52);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .sticky-visual-stage {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sticky-feature-card {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
        }
        .sticky-feature-card-inner {
          position: relative;
          width: 100%;
          max-width: 560px;
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          opacity: .2;
          transform: translateY(18px);
          transition: opacity .28s ease, transform .28s ease;
        }
        .sticky-feature-card.is-active .sticky-feature-card-inner {
          opacity: 1;
          transform: translateY(0);
        }
        .sticky-feature-index {
          position: static;
          margin-bottom: 12px;
          color: rgba(116,130,63,.32);
          font-size: 13px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: .16em;
        }
        .sticky-feature-card p {
          margin-bottom: 10px;
          color: ${BROWN};
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          opacity: .62;
        }
        .sticky-feature-card h3 {
          position: relative;
          max-width: 500px;
          margin-bottom: 14px;
          color: ${RED};
          font-family: ${INTER_REGULAR};
          font-size: clamp(1.875rem, 3.1vw, 3rem);
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: 0;
        }
        .sticky-feature-card h3 span {
          color: ${RED2};
        }
        .sticky-feature-card-inner > div:not(.sticky-feature-index):not(.sticky-feature-tags) {
          max-width: 500px;
          color: rgba(116,130,63,.68);
          font-family: ${INTER_REGULAR};
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
        }
        .feature-bucket-wrap {
          width: 100%;
          margin-top: 0;
        }
        .visual-bucket {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          min-height: 382px;
          padding: 16px 8px;
        }
        .visual-bucket .feature-card-header {
          margin-bottom: 10px;
        }
        .sticky-feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 28px;
        }
        .sticky-feature-tags span {
          padding: 7px 10px;
          border-radius: 8px;
          border: 1px solid rgba(116,130,63,.14);
          background: rgba(255,255,255,.62);
          color: ${RED};
          font-size: 11px;
          font-weight: 700;
        }
        .feature-source-stack {
          position: relative;
          width: min(100%, 430px);
          min-height: 500px;
        }
        .feature-source-input,
        .feature-capture-bar,
        .feature-floating-note {
          position: absolute;
          z-index: 3;
          border: 1px solid rgba(116,130,63,.14);
          background: rgba(255,255,255,.86);
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 60px rgba(116,130,63,.12);
        }
        .feature-source-input {
          top: 8px;
          left: 8px;
          right: 8px;
          border-radius: 16px;
          padding: 12px 14px;
        }
        .feature-source-input span,
        .feature-capture-bar span {
          display: block;
          color: rgba(116,130,63,.48);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .feature-source-input strong,
        .feature-capture-bar strong {
          display: block;
          margin-top: 4px;
          color: ${RED};
          font-size: 13px;
          letter-spacing: 0;
        }
        .feature-source-card {
          position: absolute;
          inset: 76px 34px 54px;
          overflow: hidden;
          border-radius: 32px;
          border: 1px solid rgba(116,130,63,.14);
          background: ${BG};
          box-shadow: 0 36px 90px rgba(116,130,63,.18);
        }
        .feature-source-overlay {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          border-radius: 8px;
          padding: 12px 14px;
          background: rgba(241,232,199,.9);
          color: ${RED};
          backdrop-filter: blur(10px);
        }
        .feature-source-overlay span {
          display: block;
          margin-bottom: 3px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          opacity: .54;
        }
        .feature-floating-note {
          padding: 9px 12px;
          border-radius: 8px;
          color: ${RED};
          font-size: 11px;
          font-weight: 800;
        }
        .note-one {
          top: 122px;
          right: -8px;
          transform: rotate(5deg);
        }
        .note-two {
          left: -10px;
          bottom: 108px;
          transform: rotate(-6deg);
        }
        .feature-capture-bar {
          left: 18px;
          right: 18px;
          bottom: 0;
          border-radius: 18px;
          padding: 14px 16px;
        }
        .feature-visual-panel.is-active .visual-capture .feature-source-input strong,
        .feature-mobile-stack .visual-capture .feature-source-input strong {
          width: fit-content;
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          animation: typeFill 3.8s ease-in-out infinite;
        }
        .feature-visual-panel.is-active .visual-capture .feature-source-card,
        .feature-mobile-stack .visual-capture .feature-source-card {
          animation: floatCardIn 3.8s ease-in-out infinite;
        }
        .feature-visual-panel.is-active .visual-capture .feature-capture-bar,
        .feature-mobile-stack .visual-capture .feature-capture-bar {
          animation: statusPulse 2.6s ease-in-out infinite;
        }
        .feature-visual-panel.is-active .visual-capture .note-one,
        .feature-mobile-stack .visual-capture .note-one {
          animation: floatUp 4.2s ease-in-out infinite;
        }
        .feature-visual-panel.is-active .visual-capture .note-two,
        .feature-mobile-stack .visual-capture .note-two {
          animation: floatDown 4.8s ease-in-out infinite;
        }
        .feature-read-card,
        .feature-cart-card,
        .feature-store-card,
        .feature-cook-card {
          width: min(100%, 430px);
          min-height: 500px;
          border-radius: 34px;
          border: 1px solid rgba(116,130,63,.14);
          background:
            linear-gradient(rgba(116,130,63,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(116,130,63,.045) 1px, transparent 1px),
            linear-gradient(155deg, rgba(255,255,255,.86), rgba(241,232,199,.7));
          background-size: 18px 18px, 18px 18px, auto;
          box-shadow: 0 38px 100px rgba(116,130,63,.16);
          padding: 34px;
          color: ${RED};
        }
        .feature-cart-card.visual-bucket {
          min-height: 500px;
          padding: 24px 20px 20px;
          justify-content: flex-start;
          align-items: center;
        }
        .feature-cart-card.visual-bucket .feature-card-header {
          width: 100%;
          margin-bottom: 12px;
        }
        .feature-cart-card.visual-bucket .feature-bucket-wrap {
          width: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          transform: scale(1.22);
          transform-origin: center center;
        }
        .visual-read {
          position: relative;
          overflow: hidden;
        }
        .feature-scan-line {
          position: absolute;
          left: 22px;
          right: 22px;
          top: 72px;
          height: 2px;
          z-index: 4;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(166,95,45,.75), rgba(116,130,63,.72), transparent);
          box-shadow: 0 0 18px rgba(166,95,45,.18);
        }
        .feature-visual-panel.is-active .visual-read .feature-scan-line,
        .feature-mobile-stack .visual-read .feature-scan-line {
          animation: scanDown 2.8s ease-in-out infinite;
        }
        .feature-card-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          color: rgba(116,130,63,.52);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .feature-card-header strong {
          color: ${BROWN};
        }
        .feature-read-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .feature-read-tile {
          border-radius: 8px;
          border: 1px solid rgba(116,130,63,.12);
          background: rgba(116,130,63,.045);
          padding: 14px;
        }
        .feature-visual-panel.is-active .visual-read .feature-read-tile,
        .feature-mobile-stack .visual-read .feature-read-tile {
          animation: rowCheck 3s ease-in-out infinite both;
        }
        .feature-read-tile span {
          display: block;
          color: rgba(116,130,63,.5);
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .feature-read-tile strong {
          color: ${RED};
          font-size: 16px;
        }
        .feature-read-line {
          margin-top: 14px;
          border-radius: 8px;
          background: rgba(255,255,255,.68);
          color: rgba(116,130,63,.66);
          font-size: 12px;
          line-height: 1.55;
          padding: 12px 14px;
        }
        .feature-cart-row,
        .feature-store-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 46px;
          padding: 11px 12px;
          border-radius: 8px;
          border: 1px solid rgba(116,130,63,.12);
          background: rgba(255,255,255,.64);
          color: ${RED};
          font-size: 12px;
          font-weight: 700;
        }
        .feature-visual-panel.is-active .visual-cart .feature-cart-row,
        .feature-visual-panel.is-active .visual-store .feature-store-row,
        .feature-mobile-stack .visual-cart .feature-cart-row,
        .feature-mobile-stack .visual-store .feature-store-row {
          animation: rowCheck 3.4s ease-in-out infinite both;
        }
        .feature-cart-row + .feature-cart-row,
        .feature-store-row + .feature-store-row {
          margin-top: 8px;
        }
        .feature-cart-row strong,
        .feature-store-row strong {
          margin-left: auto;
          color: rgba(116,130,63,.55);
          font-size: 11px;
        }
        .feature-visual-panel.is-active .visual-cart .feature-cart-row strong,
        .feature-mobile-stack .visual-cart .feature-cart-row strong {
          animation: statusPulse 2.8s ease-in-out infinite;
        }
        .feature-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 8px;
          background: ${RED};
          flex-shrink: 0;
        }
        .feature-store-row {
          background: rgba(255,255,255,.64);
          border: 1px solid rgba(116,130,63,.12);
        }
        .feature-store-row.is-selected {
          background: rgba(116,130,63,.09);
          border-color: rgba(116,130,63,.26);
        }
        .feature-visual-panel.is-active .visual-store .feature-store-row.is-selected,
        .feature-mobile-stack .visual-store .feature-store-row.is-selected {
          animation: rowCheck 3.4s ease-in-out infinite both, storeSelect 2.8s ease-in-out infinite;
        }
        .feature-store-logo {
          position: relative;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          background: ${WHITE};
        }
        .feature-checkout-button,
        .feature-next-step {
          margin-top: 14px;
          border-radius: 8px;
          background: ${RED};
          color: ${CREAM};
          text-align: center;
          padding: 12px 14px;
          font-size: 12px;
          font-weight: 800;
        }
        .feature-visual-panel.is-active .visual-store .feature-checkout-button,
        .feature-mobile-stack .visual-store .feature-checkout-button {
          animation: statusPulse 2.4s ease-in-out infinite;
        }
        .feature-timer {
          position: relative;
          overflow: hidden;
          width: 112px;
          height: 112px;
          margin: 12px auto 20px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${RED};
          color: ${CREAM};
          font-size: 24px;
          font-weight: 800;
          box-shadow: 0 20px 60px rgba(116,130,63,.2);
        }
        .feature-timer::before {
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: inherit;
          border: 2px solid rgba(241,232,199,.28);
          border-top-color: ${CREAM};
        }
        .feature-visual-panel.is-active .visual-cook .feature-timer::before,
        .feature-mobile-stack .visual-cook .feature-timer::before {
          animation: timerSweep 2.4s linear infinite;
        }
        .feature-timer span {
          position: relative;
          z-index: 1;
        }
        .feature-cook-card h3 {
          color: ${RED};
          font-family: ${INTER_REGULAR};
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 0;
          line-height: 1.05;
          margin-bottom: 12px;
          text-align: center;
        }
        .feature-cook-card p {
          color: rgba(116,130,63,.66);
          font-size: 13px;
          line-height: 1.65;
          text-align: center;
        }
        .feature-cook-progress {
          height: 8px;
          margin-top: 16px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(116,130,63,.09);
        }
        .feature-cook-progress span {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: ${RED2};
          transform-origin: left center;
          transform: scaleX(.72);
        }
        .feature-visual-panel.is-active .visual-cook .feature-cook-progress span,
        .feature-mobile-stack .visual-cook .feature-cook-progress span {
          animation: progressFill 3s ease-in-out infinite;
        }
        .feature-visual-panel.is-active .visual-cook .feature-next-step,
        .feature-mobile-stack .visual-cook .feature-next-step {
          animation: nextStepSlide 2.8s ease-in-out infinite;
        }
        .creators-section {
          background: ${BROWN};
          border-top: 1px solid rgba(116,130,63,.08);
          padding: 96px 28px;
        }
        .creators-shell {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(300px, 560px) 1fr;
          gap: 72px;
          align-items: center;
        }

        /* Copy */
        .creators-copy p {
          margin-bottom: 14px;
          color: rgba(241,232,199,.52);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
        }
        .creators-copy h2 {
          margin-bottom: 18px;
          color: ${CREAM};
          font-family: ${INTER_REGULAR};
          font-size: clamp(1.9rem, 3.4vw, 2.8rem);
          font-weight: 400;
          letter-spacing: -0.03em;
          line-height: 1.08;
        }
        .creators-copy > div {
          max-width: 380px;
          color: rgba(241,232,199,.62);
          font-size: 15px;
          line-height: 1.7;
        }
        .creators-copy a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          margin-top: 32px;
          padding: 0 24px;
          border-radius: 999px;
          background: ${CREAM};
          color: ${BROWN};
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition: opacity .18s;
        }
        .creators-copy a:hover { opacity: .86; }

        /* Steps */
        .creator-steps {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 36px;
          flex-wrap: nowrap;
        }
        .creator-step {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
        }
        .creator-step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid rgba(241,232,199,.22);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(241,232,199,.5);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .06em;
          flex-shrink: 0;
        }
        .creator-step strong {
          display: block;
          color: ${CREAM};
          font-size: 11px;
          font-weight: 700;
          line-height: 1.3;
          white-space: nowrap;
        }
        .creator-step span {
          display: block;
          color: rgba(241,232,199,.46);
          font-size: 10px;
          font-weight: 500;
          line-height: 1.4;
          margin-top: 1px;
          white-space: nowrap;
        }
        .creator-step-arrow {
          color: rgba(241,232,199,.22);
          font-size: 14px;
          flex-shrink: 0;
        }

        /* Earn card */
        .creator-earn-card {
          border-radius: 20px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(241,232,199,.1);
          backdrop-filter: blur(12px);
          padding: 32px 32px 28px;
          box-shadow:
            0 0 0 1px rgba(241,232,199,.04) inset,
            0 40px 80px rgba(0,0,0,.18);
        }
        .creator-earn-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
        }
        .creator-earn-label {
          color: rgba(241,232,199,.44);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .creator-earn-amount {
          color: ${CREAM};
          font-family: ${INTER_REGULAR};
          font-size: clamp(1.3rem, 2.2vw, 1.8rem);
          font-weight: 400;
          letter-spacing: -.02em;
          line-height: 1;
        }
        .creator-earn-badge {
          display: inline-flex;
          align-items: center;
          height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(116,130,63,.28);
          color: rgba(241,232,199,.82);
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .creator-earn-rows {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .creator-earn-row-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 4px;
        }
        .creator-earn-row strong {
          color: ${CREAM};
          font-size: 14px;
          font-weight: 700;
        }
        .creator-earn-row-earn {
          color: rgba(241,232,199,.7);
          font-size: 13px;
          font-weight: 700;
        }
        .creator-earn-row-meta {
          color: rgba(241,232,199,.36);
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .creator-earn-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(241,232,199,.08);
          overflow: hidden;
        }
        .creator-earn-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(241,232,199,.38), rgba(241,232,199,.7));
        }
        .creator-earn-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid rgba(241,232,199,.08);
        }
        .creator-earn-footer span {
          color: rgba(241,232,199,.38);
          font-size: 12px;
          font-weight: 600;
        }
        .creator-earn-footer strong {
          color: rgba(241,232,199,.62);
          font-size: 12px;
          font-weight: 700;
        }
        .site-footer {
          background: ${BROWN};
          color: ${CREAM};
          padding: 104px 28px 54px;
        }
        .site-footer-shell {
          max-width: 1180px;
          margin: 0 auto;
        }
        .site-footer-main {
          display: grid;
          grid-template-columns: minmax(280px, 1fr) minmax(420px, .9fr);
          gap: 120px;
          align-items: start;
          margin-bottom: 54px;
        }
        .site-footer-logo {
          display: inline-flex;
          align-items: baseline;
          gap: 1px;
          margin-bottom: 42px;
          color: ${CREAM};
          font-size: 34px;
          font-weight: 800;
          letter-spacing: .18em;
          line-height: 1;
          text-transform: uppercase;
        }
        .site-footer-logo span:last-child {
          color: rgba(241,232,199,.72);
        }
        .site-footer-brand p {
          max-width: 360px;
          color: rgba(241,232,199,.72);
          font-size: 18px;
          line-height: 1.55;
        }
        .site-footer-brand .site-footer-socials {
          margin-top: 28px;
        }
        .site-footer-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(160px, 1fr));
          gap: 72px;
        }
        .site-footer-link-group {
          display: grid;
          gap: 18px;
          align-content: start;
        }
        .site-footer-link-group + .site-footer-link-group {
          margin-top: 42px;
        }
        .site-footer h3 {
          color: ${CREAM};
          font-family: ${INTER_REGULAR};
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 0;
          margin-bottom: 4px;
        }
        .site-footer a {
          color: rgba(241,232,199,.72);
          text-decoration: none;
          transition: color .18s ease, opacity .18s ease;
        }
        .site-footer a:hover {
          color: ${CREAM};
        }
        .site-footer-socials {
          display: flex;
          flex-wrap: wrap;
          gap: 22px;
        }
        .site-footer-socials a {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: auto;
          padding: 0;
          color: ${CREAM};
          font-size: 14px;
          font-weight: 800;
        }
        .site-footer-socials a:hover {
          opacity: .82;
        }
        .site-footer-waitlist-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 18px;
          min-height: 42px;
          padding: 0 20px;
          border-radius: 8px;
          background: ${CREAM};
          color: ${BROWN} !important;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          text-decoration: none;
        }
        .site-footer-waitlist-btn:hover {
          color: ${BROWN} !important;
          opacity: .86;
        }
        .site-footer-bottom {
          display: grid;
          gap: 18px;
          justify-items: center;
          color: rgba(241,232,199,.62);
          font-size: 14px;
          line-height: 1.6;
          text-align: center;
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
          border: 1px solid rgba(116,130,63,.1);
          background: linear-gradient(180deg, #fffefb 0%, #fffaf4 100%);
          box-shadow: 0 18px 40px rgba(116,130,63,.06);
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
          border: 1px solid rgba(116,130,63,.12);
          background: rgba(255,255,255,.78);
          color: ${RED};
          text-align: left;
          cursor: pointer;
          transition: all .22s ease;
        }
        .demo-progress-step:hover {
          border-color: rgba(116,130,63,.24);
          transform: translateY(-1px);
        }
        .demo-progress-step.active {
          background: ${RED};
          border-color: ${RED};
          color: ${CREAM};
          box-shadow: 0 8px 20px rgba(116,130,63,.16);
        }
        .demo-progress-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(116,130,63,.08);
          color: rgba(116,130,63,.76);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .04em;
          flex-shrink: 0;
        }
        .demo-progress-step.active .demo-progress-index {
          background: rgba(241,232,199,.18);
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
          background: rgba(116,130,63,.06);
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
          color: rgba(116,130,63,.56);
        }
        .demo-counter-pill {
          flex-shrink: 0;
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(116,130,63,.05);
          border: 1px solid rgba(116,130,63,.08);
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
          border: 1px solid rgba(116,130,63,.1);
          background: rgba(255,255,255,.92);
          text-align: left;
        }
        .demo-recipe-thumb {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border-radius: 16px;
          background: radial-gradient(circle at 30% 25%, rgba(255,255,255,.9), rgba(255,255,255,.2) 34%, rgba(116,130,63,.18) 35%, rgba(116,130,63,.08) 100%);
          border: 1px solid rgba(116,130,63,.08);
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
          box-shadow: inset 0 -6px 10px rgba(116,130,63,.18);
        }
        .demo-thumb-swirl {
          position: absolute;
          width: 16px;
          height: 16px;
          right: 14px;
          top: 12px;
          border-radius: 999px;
          background: rgba(241,232,199,.9);
          box-shadow: 0 0 0 5px rgba(241,232,199,.2);
        }
        .demo-tag {
          flex-shrink: 0;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(116,130,63,.05);
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
          border: 1px solid rgba(116,130,63,.08);
          background: rgba(116,130,63,.03);
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
          border-color: rgba(116,130,63,.14);
        }
        .demo-ingredient-pill.is-selected {
          background: rgba(116,130,63,.06);
          border-color: rgba(116,130,63,.12);
        }
        .demo-ingredient-pill.is-muted {
          background: rgba(116,130,63,.02);
        }
        .demo-ingredient-marker {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 1px solid rgba(116,130,63,.18);
          background: rgba(255,255,255,.9);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all .18s ease;
        }
        .demo-ingredient-marker.is-neutral {
          border-color: rgba(116,130,63,.12);
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
          background: rgba(116,130,63,.04);
          color: rgba(116,130,63,.55);
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
          color: rgba(116,130,63,.5);
        }
        .demo-ingredient-meta.is-strong {
          background: rgba(116,130,63,.08);
          color: ${RED};
        }
        .demo-result-card {
          border-radius: 18px;
          border: 1px solid rgba(116,130,63,.08);
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
          color: rgba(116,130,63,.5);
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
          color: rgba(116,130,63,.7);
        }
        .demo-result-placeholder {
          margin-top: 14px;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(116,130,63,.5);
        }
        .demo-result-summary {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(116,130,63,.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 11px;
          color: rgba(116,130,63,.55);
        }
        .demo-result-summary strong {
          font-size: 14px;
          color: ${RED};
        }
        .demo-result-summary.subtle strong {
          font-size: 12px;
          color: rgba(116,130,63,.62);
        }
        .demo-footer-note {
          font-size: 11px;
          color: rgba(116,130,63,.56);
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
          box-shadow: 0 12px 24px rgba(116,130,63,.14);
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
          border: 1px solid rgba(116,130,63,.1);
          background: rgba(116,130,63,.03);
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
          border: 1px solid rgba(116,130,63,.08);
          background: ${WHITE};
          text-align: center;
        }
        .compare-cell.selected {
          background: rgba(116,130,63,.1);
          border-color: rgba(116,130,63,.24);
          box-shadow: inset 0 0 0 1px rgba(116,130,63,.08);
        }
        .store-logo {
          position: relative;
          width: 32px;
          height: 28px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .store-logo img {
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
        .about-section-grid {
          display: grid;
          grid-template-columns: minmax(280px, 360px) minmax(320px, 460px);
          align-items: center;
          justify-content: space-between;
          gap: 56px;
        }
        .about-bucket-wrap {
          width: 100%;
          max-width: 460px;
          justify-self: end;
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
          background: rgba(116,130,63,.05);
          border: 1px solid rgba(116,130,63,.06);
          display: flex;
          align-items: end;
          justify-content: start;
          text-align: left;
          font-size: 9px;
          line-height: 1.3;
          white-space: pre-line;
          color: rgba(116,130,63,.62);
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
          border: 1px solid rgba(116,130,63,.12);
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
          color: rgba(116,130,63,.72);
        }
        .split-flow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(116,130,63,.55);
          animation: splitPulse 1.4s ease-in-out infinite;
        }
        .split-flow-end {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          color: ${RED};
          background: rgba(116,130,63,.07);
          border: 1px solid rgba(116,130,63,.14);
          border-radius: 999px;
          padding: 4px 10px;
        }
        .split-summary {
          margin-top: 12px;
          padding: 11px 12px;
          border: 1px solid rgba(116,130,63,.14);
          border-radius: 10px;
          background: rgba(116,130,63,.03);
          animation: splitGlow 2.8s ease-in-out infinite;
        }

        @media (max-width: 980px) {
          .hero-section {
            min-height: auto;
            padding: 78px 22px 72px;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 46px;
          }
          .hero-copy {
            max-width: 620px;
          }
          .hero-visual {
            min-height: 420px;
          }
          .hero-recipe-card,
          .hero-cart-card {
            width: min(58%, 320px);
          }
          .sticky-feature-section {
            padding: 82px 22px 68px;
          }
          .features-section {
            padding: 62px 22px 64px;
          }
          .features-heading,
          .features-board,
          .creators-shell {
            grid-template-columns: 1fr;
          }
          .feature-showcase-card {
            min-height: auto;
          }
          .creators-shell {
            gap: 32px;
          }
          .sticky-feature-scroll {
            display: none;
          }
          .feature-mobile-stack {
            display: flex;
            flex-direction: column;
            gap: 32px;
          }
          .feature-mobile-scene {
            display: grid;
            gap: 18px;
          }
          .recipe-demo-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .recipe-demo-image-card {
            justify-self: center;
            width: min(320px, 100%);
            height: 486px;
          }
          .site-footer-main {
            grid-template-columns: 1fr;
            gap: 54px;
            margin-bottom: 54px;
          }
          .site-footer-links {
            gap: 36px;
          }
          .feature-mobile-scene .sticky-feature-asset {
            height: auto;
            min-height: 500px;
          }
          .sticky-feature-card {
            min-height: auto;
            height: auto;
          }
          .sticky-feature-card-inner {
            opacity: 1;
            transform: none;
          }
          .product-demo-card {
            max-width: 100%;
          }
          .about-section-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-bucket-wrap {
            justify-self: start;
            max-width: 460px;
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
          .hero-section {
            padding: 58px 18px 56px;
          }
          .hero-title {
            font-size: clamp(2.15rem, 12vw, 3rem);
          }
          .hero-body {
            font-size: 15px;
            margin-bottom: 28px;
          }
          .hero-primary-link {
            width: 100%;
          }
          .hero-actions {
            align-items: stretch;
          }
          .hero-visual {
            min-height: 470px;
          }
          .hero-recipe-card {
            top: 0;
            left: 0;
            width: 82%;
          }
          .hero-cart-card {
            right: 0;
            bottom: 0;
            width: 82%;
          }
          .hero-pulse {
            top: 47%;
          }
          .store-chip {
            min-height: 44px;
            padding: 0 16px;
          }
          .recipe-demo-section {
            padding: 52px 18px 54px;
          }
          .recipe-demo-heading {
            margin-bottom: 24px;
            text-align: left;
          }
          .recipe-demo-heading h2 {
            font-size: 30px;
          }
          .recipe-demo-heading > div {
            font-size: 14px;
          }
          .recipe-demo-image-card {
            width: min(280px, 100%);
            height: 426px;
          }
          .recipe-demo-panel-head,
          .recipe-demo-item,
          .recipe-demo-checkout {
            padding-left: 14px;
            padding-right: 14px;
          }
          .recipe-demo-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .recipe-demo-qty {
            justify-self: start;
          }
          .recipe-demo-checkout {
            align-items: stretch;
            flex-direction: column;
          }
          .recipe-demo-checkout-actions {
            width: 100%;
          }
          .recipe-demo-checkout a {
            flex: 1;
          }
          .recipe-demo-checkout-disabled {
            flex: 1;
          }
          .recipe-demo-store-option {
            grid-template-columns: 30px minmax(0,1fr);
          }
          .recipe-demo-store-price {
            grid-column: 2;
            text-align: left;
          }
          .sticky-feature-heading {
            margin-bottom: 18px;
          }
          .features-heading {
            gap: 14px;
            margin-bottom: 22px;
          }
          .features-heading p {
            margin-bottom: 0;
          }
          .feature-choice {
            grid-template-columns: 36px minmax(0, 1fr);
            min-height: auto;
            padding: 12px;
          }
          .feature-choice-index {
            width: 36px;
            height: 36px;
            font-size: 11px;
          }
          .feature-showcase-card {
            padding: 16px;
          }
          .creator-earn-card {
            padding: 22px;
          }
          .creator-earn-header {
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
          }
          .creator-earn-amount {
            font-size: 1.6rem;
          }
          .creator-steps {
            gap: 6px;
          }
          .feature-mobile-scene .sticky-feature-asset {
            min-height: 430px;
            padding: 18px;
            border-radius: 26px;
          }
          .sticky-visual-stage {
            min-height: 340px;
          }
          .sticky-feature-card-inner {
            padding: 22px;
            border-radius: 22px;
          }
          .sticky-feature-index {
            top: 18px;
            right: 20px;
          }
          .sticky-feature-card h3 {
            max-width: 320px;
          }
          .feature-source-stack,
          .feature-read-card,
          .feature-cart-card,
          .feature-store-card,
          .feature-cook-card {
            width: 100%;
          }
          .feature-source-card {
            inset: 72px 22px 42px;
          }
          .feature-floating-note {
            display: none;
          }
          .feature-read-grid {
            grid-template-columns: 1fr;
          }
          .site-footer {
            padding: 72px 18px 42px;
          }
          .site-footer-logo {
            margin-bottom: 28px;
            font-size: 28px;
          }
          .site-footer-links {
            grid-template-columns: 1fr;
          }
          .site-footer-socials a {
            min-height: auto;
          }
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

        @media (max-width: 640px) {
          /* Nav */
          div[style*="padding: 8px 20px"] {
            padding: 6px 12px;
          }

          /* Creators section */
          .creators-section {
            padding: 64px 20px;
          }
          .creators-shell {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .creators-copy h2 {
            font-size: 1.85rem;
          }
          .creators-copy > div {
            max-width: 100%;
          }
          .creator-steps {
            flex-direction: column;
            gap: 14px;
          }
          .creator-step-arrow {
            display: none;
          }
          .creator-earn-card {
            padding: 22px 18px;
          }
          .creator-earn-header {
            flex-direction: column;
            gap: 10px;
            margin-bottom: 22px;
          }
          .creator-earn-amount {
            font-size: 1.7rem;
          }

          /* FAQ */
          #faq {
            padding: 64px 18px !important;
          }

          /* Store marquee */
          .store-marquee-track {
            gap: 28px;
          }

          /* Works with section */
          .works-with-section {
            padding: 48px 18px;
          }

          /* Site footer */
          .site-footer {
            padding: 72px 18px 40px;
          }
          .site-footer-main {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .site-footer-links {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .site-footer-logo {
            font-size: 26px;
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
          .split-summary,
          .sticky-visual-stage,
          .feature-cart-row,
          .feature-read-tile {
            animation: none !important;
          }
        }
      `}</style>

      {/* NAV */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '8px 20px' }}>
        <nav style={{ maxWidth: 1180, margin: '0 auto', background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(116,130,63,.08)', borderRadius: 12, boxShadow: 'rgba(0,0,0,0.14) 0px 0.6px 0.6px -1.25px, rgba(0,0,0,0.1) 0px 2.3px 2.3px -2.5px, rgba(0,0,0,0.04) 0px 10px 10px -3.75px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
            <a
              href="#hero"
              className="nav-logo-link"
              aria-label="Go to the first section"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('hero')
              }}
            >
              <Logo size={21} />
            </a>
            <div className="nav-desktop" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <PillMorphTabs
                items={navItems.map(({ label, sectionId }) => ({
                  value: sectionId,
                  label,
                  panel: null,
                }))}
                defaultValue=""
                onValueChange={(sectionId) => {
                  const item = navItems.find(n => n.sectionId === sectionId)
                  if (!item) return
                  if (item.href) {
                    window.location.assign(item.href)
                    return
                  }
                  scrollToSection(item.sectionId)
                }}
              />
            </div>
            <a href="/waitlist"
              style={{ padding: '8px 18px', borderRadius: 999, background: RED, color: CREAM, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'opacity .15s', textDecoration: 'none', flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >Get Started</a>
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
              {navItems.map(({ label, sectionId }) => (
                <button
                  key={`mobile-${label}`}
                  type="button"
                  className="nav-mobile-link"
                  onClick={() => {
                    const item = navItems.find(n => n.sectionId === sectionId)
                    if (item?.href) {
                      window.location.assign(item.href)
                      return
                    }
                    scrollToSection(sectionId)
                  }}
                >
                  {label}
                </button>
              ))}
              <a href="/waitlist"
                style={{ marginTop: 2, display: 'block', width: '100%', padding: '10px 14px', borderRadius: 8, background: RED, color: CREAM, fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      </nav>
      </div>

      {/* HERO */}
      <HeroGridSection>
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow fade-up">
              Early access
            </div>
            <h1 className="hero-title fade-up">
              From saved recipe to{' '}
              <span className="hero-title-nowrap">
                groceries
                <span className="hero-title-word">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={HERO_TITLES[heroTitleNumber]}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
                      style={{ display: 'inline-block' }}
                    >
                      {HERO_TITLES[heroTitleNumber]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h1>
            <p className="hero-body fade-up">
              ate o&apos;clock turns any recipe into an editable cart across any grocery store.
            </p>
            <div id="waitlist-form" className="hero-actions fade-up">
              <a href="/waitlist" className="hero-primary-link">
                Get early access
              </a>
              {waitlistCount !== null && waitlistCount > 0 && (
                <p className="hero-waitlist-count">
                  <span>{waitlistCount.toLocaleString()}</span> people already on the list
                </p>
              )}
            </div>
          </div>

          {/* Animated mockup */}
          <div className="hero-visual">
            <div className="hero-card hero-recipe-card card-hover float-a">
              <div className="hero-card-label">Saved recipe</div>
              <div className="hero-recipe-title">Acai Bowl</div>
              <div className="hero-recipe-byline">by @healthybowl</div>
              <div className="hero-chip-row">
                {['10 min', 'Serves 1', 'Healthy'].map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            <div className="hero-card hero-cart-card card-hover float-b">
              <div className="hero-card-label">Cart built</div>
              <div className="hero-cart-list">
                {ingredients.map((item, i) => (
                  <div key={item} className="hero-cart-row" style={{ opacity: i < cartFill ? 1 : .56 }}>
                    <span className="hero-cart-check" style={{ background: i < cartFill ? RED : `rgba(116,130,63,.12)` }}>
                      {i < cartFill && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke={CREAM} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                    <span style={{ fontWeight: i < cartFill ? 700 : 500 }}>{item}</span>
                  </div>
                ))}
              </div>
              {cartFill >= 4 && (
                <div className="hero-order-button" style={{ animation: 'fadeUp .3s ease' }}>
                  Order on Blinkit
                </div>
              )}
            </div>

            <div className="hero-pulse">
              <span>1 tap</span>
            </div>
          </div>
        </div>
      </HeroGridSection>

      {/* WORKS WITH - scrolling marquee */}
      <section className="store-strip-section">
        <p className="store-strip-label">Works with</p>
        <div className="store-marquee-window">
          <div className="store-marquee-edge store-marquee-edge-left" />
          <div className="store-marquee-edge store-marquee-edge-right" />
          <div className="marquee-track" style={{ display: 'flex', animation: 'marquee 24s linear infinite', width: 'max-content', willChange: 'transform' }}>
            {Array.from({ length: STORE_MARQUEE_GROUPS }).map((_, groupIndex) => (
              <div
                key={groupIndex}
                className="store-marquee-group"
                aria-hidden={groupIndex === 0 ? undefined : true}
              >
                {STORES.map((s) => (
                  <span key={`${groupIndex}-${s.name}`} className="store-chip">
                    <span className="store-logo" aria-hidden="true">
                      <Image src={s.logo} alt="" fill sizes="32px" style={{ objectFit: 'contain' }} />
                    </span>
                    {s.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <RecipeCheckoutDemoSection />

      {/* FEATURES */}
      <UpcomingFeaturesSection />

      {/* CREATORS */}
      <CreatorsSection />

      {/* FAQ */}
      <FAQSection />

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer-shell">
          <div className="site-footer-main">
            <div className="site-footer-brand">
              <div className="site-footer-logo" aria-label="ate o'clock">
                <span>ate</span><span> o&apos;clock</span>
              </div>
              <p>Saved recipes, grocery carts, and creator earnings in one place.</p>
              <div className="site-footer-socials" aria-label="Social links">
                <a href="#" aria-label="Instagram">
                  <InstagramGlyph size={17} />
                  <span>Instagram</span>
                </a>
                <a href="#" aria-label="Substack">
                  <SubstackGlyph size={18} />
                  <span>Substack</span>
                </a>
                <a href="#" aria-label="YouTube">
                  <YouTubeGlyph size={19} />
                  <span>YouTube</span>
                </a>
              </div>
              <a href="/waitlist" className="site-footer-waitlist-btn">Join waitlist</a>
            </div>

            <div className="site-footer-links" aria-label="Footer navigation">
              <div className="site-footer-link-group">
                <h3>Product</h3>
                <a href="#features">Features</a>
                <a href="#creators">For Creators</a>
                <a href="#faq">FAQs</a>
              </div>

              <div>
                <div className="site-footer-link-group">
                  <h3>Legal</h3>
                  <a href="/terms">Terms of Use</a>
                  <a href="/privacy">Privacy Policy</a>
                </div>
                <div className="site-footer-link-group">
                  <h3>About</h3>
                  <a href="/team">Meet the Team</a>
                </div>
              </div>
            </div>
          </div>

          <div className="site-footer-bottom">
            <p>&#169; 2026 ateoclock. All rights reserved.</p>
            <p>hello@ateoclock.app</p>
          </div>
        </div>
      </footer>
      <WalkingMascot />
    </main>
  )
}
