# Menu category banner images

Each menu category (accordion section) shows a banner of up to **3 images** at the
top. Drop your images into the matching folder, named **`1.jpg`, `2.jpg`, `3.jpg`**.

```
public/menu/
  the-ogs/            1.jpg  2.jpg  3.jpg
  bubble-waffles/     1.jpg  2.jpg  3.jpg
  waffle-cakes/       1.jpg  2.jpg  3.jpg
  ...
```

- Folder names are the **slug** of the category name (lowercase, spaces → `-`,
  `&` → `and`). e.g. "Waffle Cakes" → `waffle-cakes`, "Add Ons" → `add-ons`.
- Supported names: `1.jpg`, `2.jpg`, `3.jpg` (also `.png` / `.webp` work — see
  `CategoryBanner.tsx` for the extension order it tries).
- If a folder has **no images**, the banner shows a clean gradient placeholder, so
  the layout never looks broken.
- Recommended size: ~**600×450** (4:3), under ~150 KB each for fast loading.

Current category folders:

| Category | Folder |
| --- | --- |
| Best Sellers | `best-sellers` |
| The OGs | `the-ogs` |
| Cheesecake Inspired | `cheesecake-inspired` |
| Ice Cream Waffle Sandwiches | `ice-cream-waffle-sandwiches` |
| Flavor Explorations | `flavor-explorations` |
| Bubble Waffles | `bubble-waffles` |
| Waffle Pops | `waffle-pops` |
| Waffle Cakes | `waffle-cakes` |
| Milkshakes | `milkshakes` |
| Ice Cream Sundaes | `ice-cream-sundaes` |
| Mini Bubble Pancakes | `mini-bubble-pancakes` |
| Summer Coolers | `summer-coolers` |
| Mini Waffle Box of 4 | `mini-waffle-box-of-4` |
| Add Ons | `add-ons` |
