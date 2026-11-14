"""Rebuild public photo credits from the menu photo source records."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
records = []
for manifest in sorted((ROOT / 'scripts').glob('menu-*-photo-sources.json')):
    data = json.loads(manifest.read_text())
    records.extend(data if isinstance(data, list) else data.get('photos', [data]))

def value(record, *keys):
    return next((str(record[key]) for key in keys if record.get(key)), '')

def escape(text):
    return html.escape(text, quote=True)

rows, markdown = [], []
for record in records:
    asset = value(record, 'file', 'assetPath', 'path', 'asset')
    if not asset:
        raise ValueError(f'Missing image path: {record}')
    source = value(record, 'sourceURL', 'directSource', 'source', 'sourceUrl', 'originalUrl', 'directSourceUrl')
    page = value(record, 'pageURL', 'photoPageUrl', 'page', 'pageUrl', 'photoPage', 'photo_page') or source
    author = value(record, 'photographer', 'author', 'creator') or 'See original photo page'
    license_name = value(record, 'license')
    license_url = value(record, 'licenseURL', 'licenseUrl', 'license_url')
    label = Path(asset).stem.replace('-', ' ').title()
    license_link = f'<a href="{escape(license_url)}">{escape(license_name)}</a>' if license_url else escape(license_name)
    rows.append(f'<li><h2>{escape(label)}</h2><p>{escape(author)} · {license_link}</p><a href="{escape(page)}">Original photograph</a></li>')
    license_md = f'[{license_name}]({license_url})' if license_url else license_name
    markdown.append(f'| `{asset}` | {author} | [Photo page]({page}) | [Image source]({source}) | {license_md} |')

page = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Photo credits · MIKLOL</title><style>
body{margin:0;background:#f4eee4;color:#30251e;font:16px/1.6 system-ui,sans-serif}main{max-width:880px;margin:auto;padding:48px 24px}a{color:#88431f;text-underline-offset:4px}h1{font:500 46px/1.2 Georgia,serif}h2{font-size:20px;margin:0 0 6px}p{margin:0 0 12px}ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}li{padding:24px;border:1px solid #c7b8a6;border-radius:6px}li p{color:#675b4f}a:focus-visible{outline:2px solid #88431f;outline-offset:4px}
</style></head><body><main><a href="/#menu">← Back to the menu</a><h1>Photo credits</h1>
<p>These photographs illustrate our menu selections. They are representative images, rather than photographs of dishes prepared at MIKLOL.</p>
<p>Images were resized and converted to WebP for the website. Any Creative Commons photographs and their resized versions retain the license linked below.</p><ul>'''
page += '\n'.join(rows) + '</ul></main></body></html>\n'
(ROOT / 'public/photo-credits.html').write_text(page)
marker = '<!-- OWNER-MENU-PHOTO-CREDITS -->'
credits = (ROOT / 'CREDITS.md').read_text().split(marker)[0].rstrip()
credits += '\n\n' + marker + '\n## Owner menu selection photographs\n\n'
credits += 'Menu names and prices come from the owner’s uploaded menu pages. These photographs are representative stock images. New photographs were resized to a maximum of 900 pixels and converted to WebP; four existing local derivatives are reused unchanged; Creative Commons derivatives retain the source license. Public attribution is available at `/photo-credits.html`.\n\n'
credits += '| Local file | Photographer | Primary photo page | Original source | License |\n| --- | --- | --- | --- | --- |\n'
credits += '\n'.join(markdown) + '\n'
(ROOT / 'CREDITS.md').write_text(credits)
print(f'Credited {len(records)} menu photographs.')
