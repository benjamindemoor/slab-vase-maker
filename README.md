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

## Maten op de tekening
Standaard krijgt elke slab een **nummer** (1, 2, 3…) en elke zijde een **letter** (a, b, c…). De maten, hoeken en verstekken staan in een legende onder de slab, en in de PDF en SVG ook op ware grootte. De zijstrook zegt tegen welke zijde van paneel 1 en 2 elk stuk komt. Wil je toch alle maten op de lijnen, kies dan bij Instellingen “alle maten op de lijnen”.

## Stencil
Met **Afbeelding als stencil…** laad je een schets of foto (PNG/JPG) onder het raster van de silhouet-editor. Stel de echte breedte of hoogte in (of klik op “Hoogte = vaas”), verschuif hem eventueel met slepen, en teken je punten erover. Het stencil wordt bewaard bij je vaas, maar niet mee geprint.

## Ongedaan maken
Gebruik **↶ Ongedaan maken** / **↷ Opnieuw** bovenaan, of ⌘Z / ⇧⌘Z (Ctrl+Z / Ctrl+Y). Slepen of typen telt als één stap.

## Mallen bekijken
Tik op een mal om hem schermvullend te bekijken. Je kunt zoomen (knijpen of scrollen) en schuiven, en met de pijltjes naar de volgende mal gaan. Met **PNG opslaan** krijg je een afbeelding met grote, leesbare maten.

## Export
- SVG op ware grootte (mm)
- PDF op **A4 of A3** (staand of liggend, automatisch het minste aantal bladen), met een overzichtsblad (welk blad waar komt), overlapstroken, paskruisjes en een controleblok van 10 × 10 cm
- **Printen**: opent die PDF in een nieuw tabblad; print op 100 % (werkelijke grootte)
- HPGL voor een Roland-penplotter (40 eenheden/mm; pen 1 = snijlijnen en tekst, pen 2 = kras- en maatlijnen)
- maten als platte tekst kopiëren
- ontwerp opslaan en laden als JSON, met automatische opslag in localStorage

## Tests
```
node tests/geometry.test.js     # of: npm test
```
De test leest de geometriecode tussen `/*GEO-START*/` en `/*GEO-END*/` uit `index.html`.
Daarna controleert hij de testwaarden uit de briefing.
