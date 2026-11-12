# Slab-vaas mallengenerator

Berekent de mallen voor hoekige vazen die je uit vlakke kleiplaten bouwt.
Alles zit in één bestand: **`index.html`**. Open het in een browser (gsm of desktop).
Je hebt geen server en geen build-stap nodig.

## Modi
- **Silhouetvaas**: je tekent het voorpaneel als veelhoek (raster, snapt op 0,5 cm, of via de tabel).
  De app berekent voor- en achterpaneel en een zijstrook (breedte = diepte − 2t) met de vouwlijnen.
  Kies per rand of die open is. Je kunt de strook ook in losse stukken per rand laten tekenen.
- **Facetvaas**: je stapelt doorsneden (rechthoek of regelmatige n-hoek, met verschuiving per niveau).
  Per zijde krijg je één mal met kraslijnen, ware hoogtes, knikhoeken en afschuinhoeken van de naden.
  De app tekent ook de bodemplaat.

Instellingen: krimp % (maten × 1/(1 − krimp)), slabdikte, buiten- of binnenmaat en naadmarge.

## Export
- SVG op ware grootte (mm)
- PDF over A4-pagina's, met overlapstroken, paskruisjes en een controleblok van 10 × 10 cm
- HPGL voor een Roland-penplotter (40 eenheden/mm; pen 1 = snijlijnen en tekst, pen 2 = kras- en maatlijnen)
- maten als platte tekst kopiëren
- ontwerp opslaan en laden als JSON, met automatische opslag in localStorage

## Tests
```
node tests/geometry.test.js     # of: npm test
```
De test leest de geometriecode tussen `/*GEO-START*/` en `/*GEO-END*/` uit `index.html`.
Daarna controleert hij de testwaarden uit de briefing.
