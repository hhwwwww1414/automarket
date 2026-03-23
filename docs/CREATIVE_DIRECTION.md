# Creative Direction: Luxury-Tech Automotive

## Концепция

**«Cinematic luxury automotive marketplace»**

Соединяем:
- **Premium automotive editorial** — как в каталогах Mercedes/Porsche
- **Cinematic storytelling** — скролл как путешествие
- **Luxury dark-tech** — глубокие surfaces, акцентные свечения
- **Trust-driven UX** — доверие через визуальный вес и материалы
- **Subtle futurism** — cursor glow, layered light, carbon accents

---

## Визуальная система

### 1. Цветовая философия
- **Primary mode:** Dark-first (не light). Deep blacks (#0A0A0B), не pure black
- **Surfaces:** Layered — `--surface-1` (darkest) → `--surface-2` → `--surface-3` (elevated)
- **Accent:** Teal как tech-accent — glow, highlight, CTA. Не flat fill
- **Carbon:** Subtle overlay — тёмные панели, trust blocks, hero accents

### 2. Light & Depth
- **Vignette:** Края экрана затемнены (radial gradient)
- **Light beams:** Subtle diagonal gradients, не агрессивные
- **Glow:** Accent glow на hover/focus для CTA и trust
- **Blur:** Glassmorphism дозировано — header, overlays

### 3. Carbon Material Language
- **Где:** Hero overlays, trust blocks (VIN, seller), dark panels, footer accents
- **Как:** SVG texture 3–8% opacity, тёмный фон
- **Эффект:** Premium automotive, не tuner noise

### 4. Typography
- **Display:** Смелый, для hero и заголовков (Syne / DM Sans Display)
- **Body:** Читаемый, современный (Inter или текущий)
- **Hierarchy:** Сильный контраст размеров, tracking-tight для display

### 5. Motion Philosophy
- **Controlled, not chaotic:** Каждое движение с purpose
- **Stagger:** 40–80ms между элементами
- **Easing:** smooth, premium (ease-out для entrance)
- **Reduced motion:** Все анимации за медиа-запросом

---

## Первый экран (Hero)

- **Full-viewport atmosphere:** Градиенты, subtle mesh, vignette
- **Cursor-reactive glow:** Мягкий свет следует за курсором (desktop)
- **Headline:** Крупный, aspirational: «Найдите свой автомобиль»
- **Search:** В hero, как главный CTA, на elevated surface
- **Scroll cue:** Subtle indicator — «листайте»

---

## Storytelling sections

1. **Hero** — атмосфера, главный поиск
2. **Trust intro** — «Проверенные авто» + ключевые цифры (reveal)
3. **Popular brands** — visual rhythm, carbon accent
4. **Recommendations** — premium cards, staggered, cinematic grid
5. **Footer** — trust bar с весом, carbon footer

---

## Carbon Usage Map

| Zone            | Usage                              | Intensity |
|-----------------|------------------------------------|-----------|
| Hero background | Subtle overlay, bottom gradient    | 3–5%      |
| Trust blocks    | VIN, seller card backgrounds       | 5–8%      |
| Dark panels     | Search panel (dark mode), footer   | 5–10%     |
| Card hover      | Specular/gloss accent on premium   | Optional  |
