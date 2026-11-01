import os, re, sys, unicodedata

def slug(name):
    base, ext = os.path.splitext(name)
    base = unicodedata.normalize('NFKC', base)
    base = re.sub(r'[^A-Za-z0-9]+', '-', base).strip('-') or 'track'
    return base + ext.lower()

root = sys.argv[1] if len(sys.argv) > 1 else 'audio'
for d, _, files in os.walk(root):
    for f in sorted(files):
        if not f.lower().endswith(('.mp3', '.m4a', '.flac', '.wav', '.ogg')):
            continue
        n = slug(f)
        if n != f:
            dst = os.path.join(d, n)
            if os.path.exists(dst):
                print('رد شد (وجود دارد):', dst); continue
            os.rename(os.path.join(d, f), dst)
            print(f'{os.path.join(d, f)}  →  {dst}')
print('تمام.')
