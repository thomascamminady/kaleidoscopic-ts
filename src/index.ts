import express from 'express';
import path from 'path';
import { parseColorsFromUrl, Palette } from './utils';

const app = express();
app.use(express.static(path.join(__dirname)));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Generate random palettes
function generateRandomPalettes(numPalettes: number): Palette[] {
    const randomPalettes: Palette[] = [];
    for (let i = 0; i < numPalettes; i++) {
        const randomColors: string[] = [];
        const numColors = Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
        for (let j = 0; j < numColors; j++) {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            randomColors.push(randomColor.padStart(6, '0')); // Ensure 6-digit hex code
        }
        randomPalettes.push(new Palette(randomColors));
    }
    return randomPalettes;
}


app.get('/', (req, res) => {
    const randomPalettes = generateRandomPalettes(200);
    res.render('landing', { palettes: randomPalettes });
});

app.get('/palette/:colors', (req, res) => {
    const colors = parseColorsFromUrl(req.params.colors);
    const palette = new Palette(colors);
    const chromaColors = palette.getChromaColors();
    const textColors = chromaColors.map(color => palette.getTextColor(color));
    res.render('palette', { palette: chromaColors, textColors: textColors });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
