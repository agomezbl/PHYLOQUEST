# PhiloQuest — La senda del mochuelo

Juego web de filosofía para niños de 8 a 13 años. Noctua, un mochuelo salido de una moneda griega de 1 euro, lleva al jugador a conocer a filósofos reales. En cada capítulo se vive su historia, se juega su gran idea, se piensa un dilema y se gana una Llave del Pensamiento para vencer a Doxa, la Reina del «Porque sí».

**Jugar:** https://agomezbl.github.io/PHYLOQUEST/

## Contenido (versión 0.4)

| Capítulo | Pensador | Reto | Estado |
| --- | --- | --- | --- |
| Prólogo | Noctua y Doxa | — | Jugable |
| I | Tales de Mileto | Mito o Logos + el eclipse del 585 a.C. | Jugable |
| II | Sócrates | Duelo de preguntas en el ágora | Jugable |
| III | Platón | La caverna: detective de sombras + la salida | Jugable |
| IV | Aristóteles | La balanza del justo medio + laboratorio de lógica | Jugable |
| V | Diógenes | La mochila de Diógenes (arcade) | Jugable |
| VI–X | Confucio, Epicteto, Hipatia, Descartes, Kant | Guion escrito | Próximamente |
| Final | El Gran Debate contra Doxa | Guion escrito | Próximamente |

- Castellano y francés (botón ES/FR), con narrador en voz alta.
- Dos niveles: Aprendiz (8-10 años, con pistas) y Filósofo (11-13 años, más rondas).
- Monedas, cartas con datos reales y cuaderno de «preguntas para la cena».

## Partidas

- Se guarda solo en el navegador después de cada paso; si se cierra a medias, el mapa ofrece «Continuar».
- Hasta 4 partidas por navegador (una por jugador).
- «Copia de seguridad» (en la portada o en Ajustes): descarga todas las partidas en un archivo `.json` y las carga en otro ordenador o tablet. Sin cuentas ni servidor.

## Estructura

- `index.html` — el juego completo en un solo archivo (se puede abrir sin internet; las fuentes se cargan de Google Fonts si hay conexión).
- `src/` — código fuente por partes: textos (`data.js`), arte SVG (`art.js`, `art2.js`), sonido (`audio.js`), motor y partidas (`main.js`) y un archivo por capítulo (`ch1_…` a `ch5_…`).
- `build.py` — vuelve a generar `index.html` a partir de `src/`: `python3 build.py`.
