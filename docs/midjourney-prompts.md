# Payve Midjourney prompt pack

One style system for every image on getpayve.com. Generate in Midjourney, then the build swaps images in per page.

## The style system

Every prompt shares the same base so the whole site reads as one photographer's body of work:

- Editorial documentary photography, real working world of supply chains
- Cool morning light, overcast or dawn, never golden-hour warmth
- Color grade toward the site palette: cool near-white (#F7F8F9), muted sage greens (#8DA89A, #3B5448), deep ink shadows (#0B0D12). Desaturated, restrained, no neon, no purple
- People only as small distant figures, never faces or close-ups, never posed
- No text, no logos, no signage that reads as a brand
- Shot on medium format digital, 50mm or wider, deep focus, slight atmospheric haze

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

## After generating

Drop selects into `public/images/` named by page (`hero-home.jpg`, `hero-seafood.jpg`, ...). The imagery integration PR wires them in with graded overlays so type stays readable. Aim for 2400px wide exports for heroes.
