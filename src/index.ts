import express from 'express';
import path from 'path';
import { parseColorsFromUrl, Palette } from './Palette';
import { MainFactory } from './MainPaletteFactory';
import winston from 'winston';

const app = express();
app.use(express.static(path.join(__dirname)));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the logging level
  format: winston.format.combine(
    winston.format.timestamp(), // Add a timestamp to the logs
    winston.format.simple() // Set the log format
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'logs.log' }) // Log to a file
  ]
});

const paletteFactory = new MainFactory();

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  const palettes = paletteFactory.generatePalettes(1000);
  logger.info('User accessed the / route'); // Log the access to the / route
  res.render('landing', { palettes: palettes });
});

app.get('/palette/:colors', (req, res) => {
  const colors = parseColorsFromUrl(req.params.colors);
  const palette = new Palette(colors);
  const chromaColors = palette.getChromaColors();
  const textColors = chromaColors.map((color) => palette.getTextColor(color));
  logger.info(`User viewed a palette: ${req.params.colors}`); // Log the palette view
  res.render('palette', { palette: chromaColors, textColors: textColors });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

