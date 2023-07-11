// index.ts
import express from 'express';
import path from 'path';
import { parseColorsFromUrl, Palette } from './utils';

const app = express();
app.use(express.static(path.join(__dirname)));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/palette/:colors', (req, res) => {
    const colors = parseColorsFromUrl(req.params.colors);
    const palette = new Palette(colors);
    res.render('palette', { palette: palette.getChromaColors() });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
