# Slab-vaas mallengenerator

Berekent de mallen voor hoekige vazen die je uit vlakke kleiplaten bouwt.
Alles zit in één bestand: **`index.html`**. Open het in een browser (gsm of desktop).
Je hebt geen server en geen build-stap nodig.

## Modi
- **Silhouetvaas**: je tekent het voorpaneel als veelhoek (raster, snapt op 0,5 cm, of via de tabel).
  De app berekent voor- en achterpaneel en een zijstrook (breedte = diepte − 2t) met de vouwlijnen.
  Kies per rand of die open is. Je kunt de strook ook in losse stukken per rand laten tekenen.
  Met **Symmetrisch** teken je alleen de rechterhelft (x ≥ 0) en wordt de linkerhelft live gespiegeld rond x = 0.
- **Facetvaas**: je stapelt doorsneden (rechthoek of regelmatige n-hoek, met verschuiving per niveau).
  Per zijde krijg je één mal met kraslijnen, ware hoogtes, knikhoeken en afschuinhoeken van de naden.
  De app tekent ook de bodemplaat. **Symmetrisch** zet alle x-verschuivingen op 0, zodat links en rechts gelijk zijn.

**Verbindingsnaden:** standaard rekent de silhouetvaas met **verstek** (45°) tussen paneel en zijstrook. Dan is de strook zo breed als de volle diepte, en een paarse stippellijn toont waar de schuine snede de andere kant van de plaat raakt.
Strookhoeken krijgen een V-groef (doorlopende strook) of een verstek per uiteinde (losse stukken). Bij een binnenhoek is de binnenkant langer, dus daar schuift de snijlijn naar buiten.
In de facetvaas krijg je de verstekken van de verticale naden, de bodemnaad en de V-groeven op de knikken.
Kies **stomp** als de strook tussen de panelen moet zitten (breedte = diepte − 2t).

Instellingen: krimp % (maten × 1/(1 − krimp)), slabdikte, buiten- of binnenmaat en naadmarge.

## Mijn vazen
Geef een ontwerp een naam en klik op **Bewaar vaas**. Je vaas komt dan met een 3D-miniatuur in de lijst “Mijn vazen”, waar je hem kunt openen, kopiëren, hernoemen of verwijderen. Bewaar je opnieuw met dezelfde naam, dan werk je de vaas bij.
De lijst staat in de browser (localStorage). Met **Alle vazen exporteren** maak je een reservekopie of zet je de vazen over naar een ander toestel; inladen gaat via “Ontwerp laden…”.

## Mallen bekijken
Tik op een mal om hem schermvullend te bekijken. Je kunt zoomen (knijpen of scrollen) en schuiven, en met de pijltjes naar de volgende mal gaan. Met **PNG opslaan** krijg je een afbeelding met grote, leesbare maten.

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
