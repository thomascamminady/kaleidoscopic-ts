import express from 'express';
import path from 'path';
import { parseColorsFromUrl, Palette } from './Palette';
import { MainFactory } from './MainPaletteFactory';

const app = express();
app.use(express.static(path.join(__dirname)));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const paletteFactory = new MainFactory();

app.get('/', (req, res) => {
    const palettes = paletteFactory.generatePalettes(1000);
    res.render('landing', { palettes: palettes });
});

app.get('/palette/:colors', (req, res) => {
    const colors = parseColorsFromUrl(req.params.colors);
    const palette = new Palette(colors);
    const chromaColors = palette.getChromaColors();
    const textColors = chromaColors.map((color) => palette.getTextColor(color));
    res.render('palette', { palette: chromaColors, textColors: textColors });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
