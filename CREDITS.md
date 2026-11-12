# Image credits

## Kitchen team collection — checked 12 November 2026

**0 qualifying real stock photographs selected; 6 unique placeholder slots.**

No result could be verified against all criteria together: a real Ethiopian/Habesha woman, actively preparing or serving food or coffee, in a chef uniform, with commercial website use permitted by Unsplash, Pexels, or Pixabay. This is a record of this search, not a claim that no suitable photograph exists. No ethnicity was inferred from a face or skin tone. No AI images, face edits, generative fills, or unrelated people were used. The AI-edited image from the earlier conversation is not included.

The former generic chef photograph is no longer rendered in the story section. The story reuses the first kitchen slot (a repeated placement, not a seventh unique slot). The existing food-only hero and gallery remain while no qualifying photo is available; changing a kitchen filename automatically reuses genuine photos there.

### Placeholder inventory

These are original, hand-coded SVG camera symbols, not photographs or simulated people. There is no photographer or third-party photo license to attribute.

| File in `public/images/team/` | Intended photograph | Source | Photographer / photo license |
| --- | --- | --- | --- |
| `injera.placeholder.svg` | Woman in chef uniform making injera | Original project placeholder | Not applicable |
| `buna.placeholder.svg` | Woman in chef uniform pouring buna from a jebena | Original project placeholder | Not applicable |
| `doro-wat.placeholder.svg` | Woman in chef uniform stirring doro wat | Original project placeholder | Not applicable |
| `ingredients.placeholder.svg` | Woman in chef uniform chopping vegetables | Original project placeholder | Not applicable |
| `plating.placeholder.svg` | Woman in chef uniform plating food | Original project placeholder | Not applicable |
| `serving.placeholder.svg` | Woman in chef uniform serving a meal | Original project placeholder | Not applicable |

### Sources reviewed, not used

Searches included “Ethiopian woman chef”, “Habesha woman cooking”, “Ethiopian kitchen”, “injera cooking”, “Ethiopian coffee ceremony woman”, “African woman chef kitchen”, and “Black woman chef cooking”, scoped to the three permitted sources. Broad search pages often returned unrelated results and were not treated as evidence about a person.

| Photographer / uploader | Source page | License checked | Reason not selected |
| --- | --- | --- | --- |
| JALO HOTEL | [Traditional coffee, Shashemene](https://unsplash.com/photos/a-woman-in-a-red-and-white-striped-shirt-pouring-tea-into-a-teapot-g3WSATud3o4) | [Unsplash License](https://unsplash.com/license) | Ethiopian location documented; source describes a striped shirt, not a chef uniform. |
| Gift Habeshaw | [Traditional Ethiopian woman in cultural dress](https://www.pexels.com/photo/traditional-ethiopian-woman-in-cultural-dress-33609158/) | [Pexels License](https://www.pexels.com/license/) | Traditional dress; metadata does not verify chef uniform or the required cooking action. |
| Getafric | [Woman, Habesha, Ethiopian](https://pixabay.com/photos/woman-habesha-ethiopian-africa-8182443/) | [Pixabay Content License](https://pixabay.com/service/license-summary/) | Street/lifestyle photograph; no verified cooking action. |
| August de Richelieu | [Woman preparing food](https://www.pexels.com/photo/woman-preparing-food-4262014/) | [Pexels License](https://www.pexels.com/license/) | Cooking action documented, but Ethiopian identity and chef uniform not verified. |
| Andres Ayrton | [Woman preparing batter](https://www.pexels.com/photo/black-woman-preparing-batter-for-pastry-6579080/) | [Pexels License](https://www.pexels.com/license/) | Source describes an African American cook; not evidence of an Ethiopian subject. |

License pages permit website use subject to their terms; this does not establish a model’s ethnicity, employment at MIKLOL, or endorsement. No reviewed-but-rejected photo was downloaded into the project.

### Replacing a slot

1. Put the original, authorized photograph in `public/images/team/`. Prefer JPEG/WebP, approximately 1200–1600 px on the long edge; use ordinary resizing/compression only, never AI face or skin changes.
2. In `data/kitchen-team.ts`, replace the `.placeholder.svg` filename with that photo’s filename. There is no separate boolean to change. The placeholder label disappears automatically.
3. The existing alt text and caption describe the planned shot; change them if the supplied photo depicts a different action. The story, hero and gallery all use this config and update automatically.
4. If using stock, add `credit: { photographer, source, license }` to its config entry and record the photographer, photo-page URL, license URL and check date here. The site then labels it illustrative stock and disclaims MIKLOL employment. Never add invented names or biographies.

`next/image` (and `getImageProps` in the existing server-rendered hero) supplies responsive optimized images. People are displayed without tinting, filters, face edits, or text overlays.

---

## Existing preview photographs (pre-existing inventory)

The photographs in this design preview come from [Unsplash](https://unsplash.com/) and are used under the [Unsplash License](https://unsplash.com/license). They are illustrative stock photographs, not photographs of the actual MIKLOL premises, staff, or dishes.

Each image is stored locally as an optimized progressive JPEG. Exact source image links are retained below; these identify the original images even when a photographer name was not supplied by the CDN. No Unsplash+ images were selected.

| Local file | Original image source | Photo page, where available |
| --- | --- | --- |
| `public/images/coffee/espresso.jpg` | [Unsplash source](https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/coffee/hero-coffee.jpg` | [Unsplash source](https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=82) | — |
| `public/images/coffee/iced-latte.jpg` | [Unsplash source](https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/coffee/matcha.jpg` | [Unsplash source](https://images.unsplash.com/photo-1791980225878-7082caf3a23b?auto=format&fit=crop&w=1100&q=82) | [Photo page](https://unsplash.com/photos/matcha-latte-in-glass-W4k6kSimSxY) |
| `public/images/food/avocado-toast.jpg` | [Unsplash source](https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/breakfast.jpg` | [Unsplash source](https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/burger.jpg` | [Unsplash source](https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/cake.jpg` | [Unsplash source](https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/croissant.jpg` | [Unsplash source](https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/dessert.jpg` | [Unsplash source](https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/donut.jpg` | [Unsplash source](https://images.unsplash.com/photo-1516549445027-be9aebc57853?auto=format&fit=crop&w=1100&q=82) | [Photo page](https://unsplash.com/photos/macro-photography-of-chocolate-donuts-XjyH9_hXEyA) |
| `public/images/food/pancakes.jpg` | [Unsplash source](https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/pasta.jpg` | [Unsplash source](https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/pizza.jpg` | [Unsplash source](https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/salmon.jpg` | [Unsplash source](https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/food/steak.jpg` | [Unsplash source](https://images.unsplash.com/photo-1761138785048-9dae4abb0a0c?auto=format&fit=crop&w=1100&q=82) | [Photo page](https://unsplash.com/photos/grilled-steak-served-in-a-cast-iron-pan-with-wine-r67OB1KaI4A) |
| `public/images/gallery/gallery-01.jpg` | [Unsplash source](https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/gallery/gallery-02.jpg` | [Unsplash source](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/gallery/gallery-03.jpg` | [Unsplash source](https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/gallery/gallery-04.jpg` | [Unsplash source](https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/gallery/gallery-05.jpg` | [Unsplash source](https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/gallery/gallery-06.jpg` | [Unsplash source](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/gallery/gallery-07.jpg` | [Unsplash source](https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/gallery/gallery-08.jpg` | [Unsplash source](https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/interior/ambience.jpg` | [Unsplash source](https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=82) | — |
| `public/images/interior/birthday.jpg` | [Unsplash source](https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/interior/business.jpg` | [Unsplash source](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/interior/cafe.jpg` | [Unsplash source](https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/interior/date.jpg` | [Unsplash source](https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/interior/family.jpg` | [Unsplash source](https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1100&q=82) | — |
| `public/images/people/chef.jpg` | [Unsplash source](https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1100&q=82) | — |

## Rebuild the collection

Run `python3 scripts/download-images.py` with the `requests` and `Pillow` Python packages installed. Internet access is required. This refreshes only the image files and this credits file.

## Hero collage photographs

The light hero uses these locally optimized derivatives of the credited Unsplash photographs above. They remain illustrative stock images; their source license is unchanged. Original images elsewhere on the page are untouched.

| Local hero file | Local original | Original image source |
| --- | --- | --- |
| `public/images/hero/pasta.jpg` | Optimized derivative of `public/images/food/pasta.jpg` | [Unsplash source](https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1100&q=82) |
| `public/images/hero/pizza.jpg` | Optimized derivative of `public/images/food/pizza.jpg` | [Unsplash source](https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1100&q=82) |
| `public/images/hero/burger.jpg` | Optimized derivative of `public/images/food/burger.jpg` | [Unsplash source](https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=82) |
| `public/images/hero/salmon.jpg` | Optimized derivative of `public/images/food/salmon.jpg` | [Unsplash source](https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1100&q=82) |
| `public/images/hero/dessert.jpg` | Optimized derivative of `public/images/food/cake.jpg` | [Unsplash source](https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=82) |
| `public/images/hero/coffee.jpg` | Optimized derivative of `public/images/coffee/hero-coffee.jpg` | [Unsplash source](https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=82) |
| `public/images/hero/interior.jpg` | Optimized derivative of `public/images/interior/cafe.jpg` | [Unsplash source](https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=82) |

### Phone first-screen pasta image

`public/images/hero/pasta-mobile.avif` is a 480 × 320 AVIF derivative of the same credited pasta photograph, encoded at quality 50. Its pixels and crop come from `public/images/hero/pasta.jpg`; the original files are unchanged. A base64 copy in `data/hero-mobile.ts` is embedded by the server-rendered hero only for AVIF-capable phone viewports, avoiding an extra first-screen image request. Desktop and unsupported browsers retain the responsive Next.js-optimized original.

Source: [Unsplash pasta photograph](https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1100&q=82), under the same Unsplash License documented above.
