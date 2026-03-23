# План редизайна «АвтоСделка»

## Визуальное направление

**Концепция:** Premium, технологичный, high-trust маркетплейс с чистой композицией и уверенным брендом.

**Ключевые принципы:**
- Сильная иерархия: чёткие уровни заголовков и контента
- Щедрые отступы, ритм 8px
- Depth через shadows и surfaces, не плоский gray
- Trust-signals визуально усилены
- Аккуратный motion: stagger, hover, transition
- Design tokens везде (no hardcoded gray/green/blue)

---

## Этапы реализации

### Этап 1: Header
- Высота h-16, subtle shadow при scroll
- Logo крупнее, возможно словесный знак
- Blur/backdrop при scroll
- Более чёткие ghost vs primary кнопки
- Touch targets ≥ 44px для мобили

### Этап 2: Search panel
- Усиленная панель (shadow, ring)
- Chips на tokens
- Tabs с более выразительным индикатором
- Trust-подпись под поиском
- Упорядоченные отступы

### Этап 3: Vehicle cards + Recommendations
- Shadow-sm default, shadow-lg hover
- Padding p-4–5, счётчик фото
- Бейджи крупнее
- Staggered reveal (framer-motion)
- Recommendations section: заголовок, отступы

### Этап 4: Listing page
- Hero: крупнее заголовок, подзаголовок
- Price/specs: tokens для status
- Gallery frame, Seller card выделение
- Breadcrumb компонент

### Этап 5: Similar cars, motion, mobile, dark
- Similar cars блок
- Hover/active microinteractions
- Mobile refinement (touch, spacing)
- Dark theme: все хардкоды → tokens

---

## Design tokens (дополнения к globals.css)

```css
/* Spacing rhythm: 4, 6, 8, 10, 12, 16, 20, 24, 32 */
/* Typography: text-xs..4xl, font-medium/semibold/bold */
/* Shadows: shadow-sm, shadow-md, shadow-lg, shadow-xl */
/* Status: --status-success, --status-warning, --status-info */
```
