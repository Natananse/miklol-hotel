#!/usr/bin/env python3
"""Download and optimize the local Unsplash image collection used by MIKLOL."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
import html
import re
import requests
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    "coffee/hero-coffee.jpg": "photo-1509042239860-f550ce710b93",
    "coffee/espresso.jpg": "photo-1510707577719-ae7c14805e3a",
    "coffee/iced-latte.jpg": "photo-1461023058943-07fcbe16d735",
    "coffee/matcha.jpg": "photo-1791980225878-7082caf3a23b",
    "food/breakfast.jpg": "photo-1533089860892-a7c6f0a88666",
    "food/pasta.jpg": "photo-1473093295043-cdd812d0e601",
    "food/pizza.jpg": "photo-1513104890138-7c749659a591",
    "food/burger.jpg": "photo-1568901346375-23c9450c58cd",
    "food/dessert.jpg": "photo-1488477181946-6428a0291777",
    "food/croissant.jpg": "photo-1555507036-ab1f4038808a",
    "food/donut.jpg": "photo-1551024506-0bccd828d307",
    "food/cake.jpg": "photo-1578985545062-69928b1d9587",
    "food/avocado-toast.jpg": "photo-1525351484163-7529414344d8",
    "food/pancakes.jpg": "photo-1528207776546-365bb710ee93",
    "food/salmon.jpg": "photo-1467003909585-2f8a72700288",
    "food/steak.jpg": "photo-1546833999-b9f581a1996d",
    "interior/ambience.jpg": "photo-1552566626-52f8b828add9",
    "interior/cafe.jpg": "photo-1554118811-1e0d58224f24",
    "interior/date.jpg": "photo-1414235077428-338989a2e8c0",
    "interior/family.jpg": "photo-1555396273-367ea4eb4db5",
    "interior/birthday.jpg": "photo-1530103862676-de8c9debad1d",
    "interior/business.jpg": "photo-1517248135467-4c7edcad34c4",
    "people/chef.jpg": "photo-1577219491135-ce391730fb2c",
    "gallery/gallery-01.jpg": "photo-1442512595331-e89e73853f31",
    "gallery/gallery-02.jpg": "photo-1495474472287-4d71bcdd2085",
    "gallery/gallery-03.jpg": "photo-1551782450-a2132b4ba21d",
    "gallery/gallery-04.jpg": "photo-1547592180-85f173990554",
    "gallery/gallery-05.jpg": "photo-1551024709-8f23befc6f87",
    "gallery/gallery-06.jpg": "photo-1501339847302-ac426a4a7cbb",
    "gallery/gallery-07.jpg": "photo-1504754524776-8f4f37790ca0",
    "gallery/gallery-08.jpg": "photo-1498654896293-37aacf113fd9",
}


def download(entry):
    filename, source = entry
    page = "https://unsplash.com/photos/matcha-latte-in-glass-W4k6kSimSxY" if filename == "coffee/matcha.jpg" else ""
    if source.startswith("https:"):
        page = source
        response = requests.get(source, timeout=40)
        response.raise_for_status()
        match = re.search(r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"', response.text)
        if not match:
            match = re.search(r'<meta[^>]+content="([^"]+)"[^>]+property="og:image"', response.text)
        if not match:
            raise RuntimeError(f"No source image in {source}")
        source_url = html.unescape(match.group(1)).split("?")[0]
    else:
        source_url = f"https://images.unsplash.com/{source}"
    width = 1600 if filename in {"interior/ambience.jpg", "coffee/hero-coffee.jpg"} else 1100
    url = f"{source_url}?auto=format&fit=crop&w={width}&q=82"
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    image = ImageOps.exif_transpose(Image.open(BytesIO(response.content))).convert("RGB")
    image.thumbnail((width, width * 1.5))
    target = ROOT / "public" / "images" / filename
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "JPEG", quality=82, optimize=True, progressive=True)
    return filename, url, page, target.stat().st_size, image.size


def main():
    results = []
    errors = []
    with ThreadPoolExecutor(max_workers=7) as executor:
        tasks = {executor.submit(download, item): item for item in SOURCES.items()}
        for task in as_completed(tasks):
            try:
                result = task.result()
                results.append(result)
                print(f"OK {result[0]} {result[3] // 1024} KB {result[4]}", flush=True)
            except Exception as error:
                errors.append((tasks[task][0], str(error)))
                print(f"ERROR {tasks[task][0]}: {error}", flush=True)
    lines = [
        "# Image credits", "",
        "The photographs in this design preview come from [Unsplash](https://unsplash.com/) and are used under the [Unsplash License](https://unsplash.com/license). They are illustrative stock photographs, not photographs of the actual MIKLOL premises, staff, or dishes.", "",
        "Each image is stored locally as an optimized progressive JPEG. Exact source image links are retained below; these identify the original images even when a photographer name was not supplied by the CDN. No Unsplash+ images were selected.", "",
        "| Local file | Original image source | Photo page, where available |", "| --- | --- | --- |",
    ]
    for filename, url, page, _, _ in sorted(results):
        photo_link = f"[Photo page]({page})" if page else "—"
        lines.append(f"| `public/images/{filename}` | [Unsplash source]({url}) | {photo_link} |")
    lines += ["", "## Rebuild the collection", "", "Run `python3 scripts/download-images.py` with the `requests` and `Pillow` Python packages installed. Internet access is required. This refreshes only the image files and this credits file.", ""]
    (ROOT / "CREDITS.md").write_text("\n".join(lines))
    print(f"Downloaded {len(results)} images, {sum(item[3] for item in results) / 1024 / 1024:.2f} MiB", flush=True)
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
