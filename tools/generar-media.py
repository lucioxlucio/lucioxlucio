#!/usr/bin/env python3
"""
Completa el campo "m" de data/projects.json leyendo lo que hay en las carpetas de media/.

Uso (desde la carpeta del proyecto):
    Mac / Linux:  python3 tools/generar-media.py
    Windows:      python tools/generar-media.py

Reglas, por cada carpeta  media/<categoria>/<proyecto>/ :
  - Si hay un video (.mp4, .webm, .mov, .m4v)  -> se usa como video.
        Si hay una imagen llamada "poster.jpg" (o .png/.webp) se usa como portada.
  - Si no hay video y hay UNA imagen            -> imagen (si es más grande que el recuadro, se desplaza dentro).
  - Si hay varias imágenes                      -> slider horizontal, en orden alfabético (01.jpg, 02.jpg…).
  - Si hay imágenes cuyo nombre empieza con "scroll" (scroll-01.jpg, scroll-02.jpg…)
                                                -> se apilan en una sola columna con scroll (ideal para landing pages).
  - Si la carpeta está vacía, no se toca lo que ya tenga el proyecto.
Después de correrlo, sube data/projects.json actualizado a GitHub.
"""
import json, os, re, sys, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO = ('.mp4', '.webm', '.mov', '.m4v')
IMG = ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif')

def slug(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def natural(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', s)]

def main():
    ruta = os.path.join(RAIZ, 'data', 'projects.json')
    with open(ruta, encoding='utf-8') as f:
        data = json.load(f)
    conocidos, hechos, vacios, avisos = set(), [], [], []
    for c in data:
        for it in c['items']:
            n = it['n'][0] if isinstance(it['n'], list) else it['n']
            s = slug(n)
            conocidos.add((c['id'], s))
            carpeta = os.path.join(RAIZ, 'media', c['id'], s)
            archivos = sorted([f for f in os.listdir(carpeta) if not f.startswith('.')], key=natural) if os.path.isdir(carpeta) else []
            rel = lambda f: 'media/%s/%s/%s' % (c['id'], s, f)
            videos = [f for f in archivos if f.lower().endswith(VIDEO)]
            posters = [f for f in archivos if f.lower().startswith('poster') and f.lower().endswith(IMG)]
            imgs = [f for f in archivos if f.lower().endswith(IMG) and not f.lower().startswith('poster')]
            for f in archivos:
                if f != f.lower() or ' ' in f:
                    avisos.append('%s/%s/%s: mejor usa minúsculas y sin espacios (GitHub Pages distingue mayúsculas)' % (c['id'], s, f))
            m = None
            if videos:
                m = {'type': 'video', 'src': rel(videos[0]), 'poster': rel(posters[0]) if posters else ''}
            elif imgs:
                scroll = [f for f in imgs if f.lower().startswith('scroll')]
                if scroll:
                    m = {'type': 'image', 'src': [rel(f) for f in scroll]}
                elif len(imgs) == 1:
                    m = {'type': 'image', 'src': rel(imgs[0])}
                else:
                    m = {'type': 'slider', 'dir': 'h', 'slides': [rel(f) for f in imgs]}
            if m:
                it['m'] = m; hechos.append('%s / %s  ->  %s' % (c['id'], n, m['type']))
            else:
                vacios.append('%s / %s' % (c['id'], n))
    # carpetas dentro de media/ que no corresponden a ningún proyecto (nombre mal escrito)
    base = os.path.join(RAIZ, 'media')
    if os.path.isdir(base):
        for cat in sorted(os.listdir(base)):
            p = os.path.join(base, cat)
            if os.path.isdir(p):
                for proy in sorted(os.listdir(p)):
                    if os.path.isdir(os.path.join(p, proy)) and (cat, proy) not in conocidos:
                        avisos.append('media/%s/%s: no coincide con ningún proyecto de projects.json' % (cat, proy))
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('\nProyectos con media cargada (%d):' % len(hechos)); [print('  ✓', h) for h in hechos]
    print('\nProyectos sin archivos todavía (%d):' % len(vacios)); [print('  ·', v) for v in vacios]
    if avisos:
        print('\nAvisos:'); [print('  !', a) for a in avisos]
    print('\nListo. Sube data/projects.json a GitHub.')

if __name__ == '__main__':
    main()
