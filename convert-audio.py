import os, re, shutil, subprocess, sys, unicodedata

def slug(base):
    base = unicodedata.normalize('NFKC', base)
    return re.sub(r'[^A-Za-z0-9]+', '-', base).strip('-') or 'track'

def is_clean_mp3(p):
    with open(p, 'rb') as f: h = f.read(12)
    if h[4:8] == b'ftyp': return False        
    return h[:3] == b'ID3' or (len(h) > 1 and h[0] == 0xFF and (h[1] & 0xE0) == 0xE0)

if shutil.which('ffmpeg') is None:
    sys.exit('ffmpeg پیدا نشد. نصبش کنید (https://ffmpeg.org) و دوباره اجرا کنید.')
root = sys.argv[1] if len(sys.argv) > 1 else 'audio'
for d, _, files in sorted(os.walk(root)):
    for f in sorted(files):
        name, ext = os.path.splitext(f)
        if ext.lower() not in ('.mp3', '.m4a', '.flac', '.wav', '.ogg', '.aac'): continue
        src = os.path.join(d, f)
        dst = os.path.join(d, slug(name) + '.mp3')
        if ext.lower() == '.mp3' and is_clean_mp3(src) and dst == src:
            print('سالم است:', src); continue
        tmp = dst + '.tmp.mp3'
        r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-vn', '-map_metadata', '-1',
                            '-c:a', 'libmp3lame', '-b:a', '160k', '-f', 'mp3', tmp])
        if r.returncode:
            print('خطا در تبدیل:', src); continue
        bak = os.path.join('audio-src', os.path.relpath(src, root)); os.makedirs(os.path.dirname(bak), exist_ok=True)
        shutil.move(src, bak)
        os.replace(tmp, dst)
        print(f'{src}  →  {dst}')
print('تمام. حالا commit و push کنید (audio-src را نه).')
