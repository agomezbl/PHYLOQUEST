# PhiloQuest — ficha para Claude

Juego de filosofía (8-13 años), FR/ES: el mochuelo Noctua contra Doxa, la Reina del «Porque sí».
Versión **0.5**: jugables prólogo y capítulos I-VI (Tales, Sócrates, Platón, Aristóteles, Diógenes, Confucio).
**Pendiente:** capítulos VII-X (Epicteto, Hipatia, Descartes, Kant) y el Gran Debate final. Sus guiones **no** estaban
guardados en ningún sitio: se escriben al hacer cada capítulo, con el mismo esquema que VI (ver `data.js`).
Historial en `CAMBIOS.md`.
En Curionauta: `/juegos/philoquest/` (clave `philoquest.v3.store`, ajustes `philoquest.v3.settings`).

## Construir
- `src/`: `data.js` (textos), `art.js`/`art2.js`/`art3.js` (SVG; `art3.js` = estilo tinta china del cap. VI), `audio.js`, `main.js` (motor y partidas), un archivo por capítulo (`ch1_…`).
- Capítulo nuevo: texto en `data.js` (`playable: true`), juego en `chN_….js` (`GAMES.<id>`), escenas en `SCENES`, y añadir los archivos a `order` en `build.py`.
- `python3 build.py` regenera `index.html` (un solo archivo, funciona sin conexión). Subir `index.html` a `main`.

## Cómo trabajar con Alejandro
- Escribe en **español**, para alguien que **no programa**: pasos numerados, sin jerga, y di qué botón pulsar.
- Pregunta antes de construir algo grande o caro de rehacer; lo pequeño, hazlo directamente.
- Nivel de producto profesional: probar en navegador real (PC y móvil) antes de dar algo por terminado.
- Idiomas: **francés y español** como mínimo (público: Francia y España); inglés más adelante.
- Diseño para niños: sin ansiedad, sin perseguir al niño, sin publicidad ni rastreadores.
- Los repositorios son **públicos**: nada de datos personales de la familia ni del niño.
- **Nunca** guardes ni pidas claves secretas en el chat o en el repositorio (ElevenLabs, Gemini, `service_role` de Supabase).
  Las claves van como secretos de GitHub Actions. La clave `sb_publishable_…` de Supabase sí es pública.
- Commits: `git -c user.name="agomezbl" -c user.email="agomezbl@users.noreply.github.com" commit …`.
- Después de publicar un cambio aquí, la web **curionauta** no se actualiza sola: hay que subir un commit
  (aunque sea vacío) a `agomezbl/curionauta` para que Cloudflare vuelva a montarla.
