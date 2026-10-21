# Drink image prompts

Product shots for The Lineup, the drink pages and the home page. The site uses each image as a cutout floating on a colour block, so every image needs a **transparent background**.

## How to generate

1. Use **ChatGPT** (image generation supports transparent PNGs). Gemini and Midjourney work too, but they can't do transparency; remove the background afterwards with a tool like remove.bg.
2. Start a new chat and paste the **style block** below once. Then send the drink prompts one at a time in the same chat, so every image keeps the same look.
3. If a result has a background, reply: "Same image, transparent background PNG."
4. Download each image as PNG, about 1024 × 1024, and name it exactly as shown (for example `house-vanilla-latte.png`).
5. Put the files in `public/drinks/`. The site picks each one up automatically on the next build (restart `npm run dev`), and the illustrated cup for that drink is replaced.

You don't need all of them at once. Any drink without a photo keeps its illustration.

## Style block (paste first)

```
I'm making product photos for a coffee shop menu. Every image in this chat must follow this style:
- One drink, centered, shot from a slight three-quarter angle (camera a little above the cup).
- Studio product photography, crisp and sharp, soft key light from the left, a subtle purple rim light on the right edge.
- Realistic textures: crema, milk foam, condensation on cold cups, a little steam on hot drinks.
- Hot drinks in a plain matte dark-brown ceramic cup. Iced drinks in a plain clear glass tumbler with ice. Blended drinks in a tall clear cup with a dome lid and a purple straw.
- No text, no logos, no brand marks, no hands, no table, no props unless I ask.
- Transparent background, PNG, square 1:1.
Reply "ready" and wait for the drinks.
```

## Drinks

| File | Prompt |
| --- | --- |
| `popping-shot.png` | A double espresso in a small matte dark-brown espresso cup, thick golden crema on top. |
| `tutting-cortado.png` | A cortado in a short clear glass: equal parts espresso and steamed milk in two clean, sharply separated layers, thin foam on top. |
| `locking-flat-white.png` | A flat white in a matte dark-brown ceramic cup, velvety microfoam with a simple heart latte art. |
| `breakin-americano.png` | A hot americano in a matte dark-brown ceramic mug, dark coffee with a thin ring of crema. |
| `hip-hop-mocha.png` | An iced mocha in a clear glass tumbler: chocolate swirled through coffee and milk, ice cubes, a dusting of cocoa on top. |
| `waacking-caramel-macchiato.png` | An iced caramel macchiato in a clear glass tumbler: milk at the bottom, espresso layered on top, glossy caramel drizzle in a criss-cross pattern over the foam. |
| `house-vanilla-latte.png` | A hot vanilla latte in a matte dark-brown ceramic cup, smooth foam with rosetta latte art. |
| `afro-spice-latte.png` | A hot spiced latte in a matte dark-brown ceramic cup, foam dusted with cinnamon and a single star anise resting on the saucer edge. |
| `dancehall-coco-cold-brew.png` | An iced cold brew in a clear glass tumbler, dark coffee topped with a thick layer of coconut cream cascading down into it, ice cubes. |
| `amapiano-shaken-espresso.png` | A brown sugar shaken espresso in a clear glass tumbler: foamy caramel-colored espresso on top, oat milk swirling below, ice cubes. |
| `krump-cold-brew.png` | An extra-strong iced cold brew in a clear glass tumbler, almost black coffee, large clear ice cubes, condensation on the glass. |
| `open-style.png` | A creative iced latte in a clear glass tumbler with a purple ube cold foam on top and a few edible flower petals. |
| `vogue-rose-latte.png` | A hot rose latte in a matte dark-brown ceramic cup, pale pink foam with a few dried rose petals on top. |
| `jersey-club-frappe.png` | A cookies-and-cream coffee frappe in a tall clear cup with a dome lid and purple straw, whipped cream, crushed cookie pieces and colorful sprinkles. |
| `heels-strawberry-cream.png` | A blended strawberry cream frappe in a tall clear cup with a dome lid and purple straw, pink with strawberry swirls, whipped cream and a fresh strawberry on top. |
| `k-choreo-ube-latte.png` | An iced ube latte in a clear glass tumbler, vivid purple ube milk layered under white milk, ice cubes. |
| `lyrical-matcha.png` | An iced matcha latte in a clear glass tumbler, bright green matcha layered over milk, ice cubes, a thin drizzle of honey. |
| `litefeet-lemonade.png` | A sparkling mint lemonade in a clear glass tumbler, bubbles, lemon slices and fresh mint leaves, ice cubes. |
| `8-count-cookie.png` | A large chocolate chip cookie, golden edges and melted chocolate chunks, slightly angled. |
| `toprock-croissant.png` | A flaky golden butter croissant with visible layers. |
| `pirouette-cinnamon-roll.png` | A swirled cinnamon roll with a glossy white glaze dripping down the sides. |
| `battle-banana-bread.png` | A thick slice of banana bread with a caramelised top and a few banana slices baked in. |

## Optional

Freestyle uses a live illustrated cup that changes as you build, so it doesn't need photos.
