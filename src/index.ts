import 'dotenv/config';
import express from 'express';
import path from 'path';
import { parseColorsFromUrl, Palette } from './Palette';
import { MainFactory } from './MainPaletteFactory';
import winston from 'winston';
import mongoose from 'mongoose';
import PaletteModel from './PaletteModel';

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useUnifiedTopology: true } as any)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

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


// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url}`);
  next();
});
app.get('/', async (req, res) => {
  const palettes = await paletteFactory.generatePalettes(1000);
  res.render('landing', { palettes: palettes });
});

const paletteFactory = new MainFactory();
app.get('/palette/:colors', async (req, res) => {
  const colors = parseColorsFromUrl(req.params.colors);
  logger.info(`User viewed a palette: ${req.params.colors}`); // Log the palette view

  // Check if palette exists in the database
  let paletteInDb = await PaletteModel.findOne({ colors: colors });

  if (!paletteInDb) {
    // Palette does not exist in database, create new one
    paletteInDb = new PaletteModel({ colors: colors });
  }

  // Increase the access count and save to database
  paletteInDb.count += 1;
  logger.info(`Counter of palette is ${paletteInDb.count}`);
  await paletteInDb.save();


  const palette = new Palette(colors);
  const chromaColors = palette.getChromaColors();
  const textColors = chromaColors.map((color) => palette.getTextColor(color));
  res.render('palette', { palette: chromaColors, textColors: textColors });
});

app.get('/create', (req, res) => {
  res.render('create'); // this will render a pug view named 'create'
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

