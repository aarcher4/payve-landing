# Payve Midjourney prompt pack

One style system for every image on getpayve.com. Generate in Midjourney, then the build swaps images in per page.

## The style system (v2, locked by Alex 2026-07-07)

v1 (cool/hazy/gray documentary) was generated and REJECTED: "too hazy and weird and gray." The locked direction is v2: **golden-sunrise cinematic optimism in beautiful working landscapes, with distribution elements kept in frame.**

Every prompt shares the same base so the whole site reads as one photographer's body of work:

- Cinematic editorial photography, film still quality, epic scale, subtle lens flare where it fits
- Golden sunrise / morning golden-hour light, crisp clear air, sun-drenched and optimistic. NOT overcast, NOT hazy-gray
- Beautiful working environments of the supply chain: Michoacán orchard mountains, Andean terraces, Nebraska sandhills grain, sunlit harbors, valley farmland
- Distribution elements stay in frame: harvest crates, pallets, packing lines, grain elevators and rail cars, harbor totes and cranes, warehouse and packing-shed architecture. NO semi trucks or trailers (the model mangles them; a broken truck reads as AI instantly)
- Vibrant natural color; the site's sage palette comes from the landscapes themselves, not a desaturated grade
- People only as small distant figures, never faces or close-ups, never posed
- No text, no logos, no signage that reads as a brand
- Medium format digital, deep focus

**Aspect ratios:** `--ar 16:9` for page heroes, `--ar 4:5` for cards and split layouts. Generate both for any image you like.

**Flags:** append `--style raw --v 7` to every prompt. When you get the first image that feels right, grab its URL and add `--sref <that URL>` to all remaining prompts so the set stays consistent.

**Workflow:** run the homepage hero first, iterate until the grade feels right, lock it as the --sref anchor, then batch the rest.

## Base suffix (paste onto every prompt)

```
editorial documentary photography, cool overcast morning light, desaturated color grade with muted sage green and cool gray tones, deep ink shadows, atmospheric haze, medium format digital, deep focus, no people in foreground, no text, no logos --style raw --v 7
```

## The prompts

### 1. Homepage hero (16:9)
```
aerial view of a produce distribution hub at dawn, rows of white refrigerated trailers at loading docks, pallets of fresh produce moving between warehouse and trucks, cool blue-gray morning fog, one strip of soft green field visible beyond the pavement --ar 16:9
```

### 2. Payments (16:9 + 4:5)
```
wide interior of a modern produce warehouse office mezzanine overlooking the floor, stacked crates and forklift lanes below, clean geometry of steel and concrete, cool daylight through high windows, calm and orderly --ar 16:9
```

### 3. Early pay (16:9 + 4:5)
```
close detail of fresh green produce being packed into cartons on a stainless steel line, water droplets on leaves, crisp cold light, shallow depth on the produce with the packline receding into soft focus --ar 4:5
```

### 4. Agents (16:9 + 4:5)
```
long empty corridor of a cold storage facility at night, symmetrical racks of palletized cartons vanishing to a point, frost haze in the air, cool white industrial light with a faint green cast, quiet and precise --ar 16:9
```

### 5. Fresh produce solutions (16:9)
```
low aerial over rows of leafy crops at first light, irrigation mist drifting, a distant packing shed and parked reefer trucks at the field edge, cool green and gray palette, vast and calm --ar 16:9
```

### 6. Seafood solutions (16:9)
```
commercial fishing harbor at dawn, stacked insulated fish totes on a wet concrete quay, boats moored in cold gray-green water, gulls in fog, muted tones, no people close up --ar 16:9
```

### 7. Packaging solutions (16:9)
```
interior of a packaging plant, tall stacks of flat corrugated cartons and paper rolls in ordered rows, cool skylight illumination, geometry of repeating rectangles, restrained industrial palette --ar 16:9
```

### 8. Customers hub (16:9)
```
two semi trucks crossing an international border bridge at dawn, refrigerated trailers, cool haze over the river below, long shadows, sense of movement between two countries --ar 16:9
```

### 9. Security page (16:9)
```
detail of a steel cold room door with heavy hinges and a polished handle, frost on the metal, single cool light source, minimal composition, solid and protective --ar 16:9
```

### 10. Company page (16:9)
```
distant figures walking a produce warehouse floor between tall pallet racks, seen from high above, cool morning light shafts through skylights, small human scale against orderly industry --ar 16:9
```

### 11. Social/OG card backdrop (16:9)
```
minimal still life of three fresh green vegetables on a cool gray concrete surface, soft directional daylight, generous negative space on the left for type, muted sage and gray palette --ar 16:9
```

### 12. CTA band texture (16:9, subtle)
```
extreme close up of morning condensation on the corrugated steel wall of a refrigerated warehouse, abstract vertical ribs, cool gray-green gradient, almost monochrome, quiet texture --ar 16:9
```

## r2 additions (2026-07-07 team critique)

Write these in the locked v2 style (golden-sunrise cinematic base above, NOT the v1 base suffix kept below for history). The critique retires the security cold-room and rebalances two solutions pages.

**NO SEMI TRUCKS OR TRAILERS in any prompt (Alex 2026-07-07): the model consistently mangles them (wrong wheel counts, melted cabs, warped trailers) and a broken truck reads instantly as AI. Carry distribution scale with crates, pallets, packing lines, grain elevators, rail cars, harbors, and warehouse architecture instead.**

### 13. Security page replacement (16:9)
```
golden sunrise over a modern distribution campus, long clean warehouse rooflines and a quiet paved yard seen from a calm elevated angle, rows of stacked produce crates near the dock doors, crisp clear morning air, sense of order and stewardship, distant small figures only, no vehicles --ar 16:9 --style raw --v 7
```

### 14. Packaging solutions replacement (16:9)
```
sunlit interior of a corrugated packaging operation, tall stacks of flat cardboard cartons on wooden pallets receding in ordered rows, warm golden shafts through high skylights onto the concrete floor, paper rolls along one wall, calm ordered geometry, no vehicles --ar 16:9 --style raw --v 7
```

### 15. Seafood solutions replacement (16:9)
```
working seafood harbor at golden sunrise, moored fishing boats beside a quay stacked with insulated totes and ice bins, a dockside crane lifting a net of crates, processing house with open doors in the background, warm light on cold water, broad industry scene not a single catch --ar 16:9 --style raw --v 7
```

### 16. Customers hub alternate, in case a warm atmosphere band returns (16:9)
```
golden-hour orchard valley with wooden harvest crates stacked at the row ends and a packing shed glowing in the distance, long soft shadows across the rows, crisp air, sense of a full harvest day ending well, small distant figures only, no vehicles --ar 16:9 --style raw --v 7
```

### 17. Company page alternate (16:9)
```
early morning inside a produce packing house, sorting line with bright produce moving past, workers as small figures along the line, golden light through open bay doors, stacked cartons and pallets in soft focus foreground, honest working atmosphere, no vehicles --ar 16:9 --style raw --v 7
```

### 18. Hero-home alternate, only if the current Michoacán select needs a sibling (16:9)
```
aerial golden sunrise over terraced orchard mountains, a winding dirt road with NO vehicles, mist in the valley folds, a small cluster of packing sheds with stacked crates at the mountain base, epic scale, crisp optimistic light --ar 16:9 --style raw --v 7
```

## After generating

Drop selects into `public/images/` named by page (`hero-home.jpg`, `hero-seafood.jpg`, ...). The imagery integration PR wires them in with graded overlays so type stays readable. Aim for 2400px wide exports for heroes.
