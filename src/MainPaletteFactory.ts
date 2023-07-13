import { Palette } from './Palette';
import {
    PaletteFactory,
    DistinctPaletteFactory,
    ShadePaletteFactory,
    InterpolatedPaletteFactory,
    CamminadyDevPaletteFactory,
    TopPalettesFactory
} from './PaletteFactory';

export class MainFactory extends PaletteFactory {
    private factories: PaletteFactory[] = [
        new CamminadyDevPaletteFactory(),
        new CamminadyDevPaletteFactory(),
        new CamminadyDevPaletteFactory(),
        // new DistinctPaletteFactory(),
        new InterpolatedPaletteFactory(),
        new ShadePaletteFactory(),
    ];

    constructor() {
        super();
    }
    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
        const palettes: Palette[] = [];
        const paletteSet: Set<string> = new Set();

        // Get top palettes
        const topPalettesFactory = new TopPalettesFactory();
        const topPalettes = await topPalettesFactory.generatePalettes(100);
        for (const palette of topPalettes) {
            const key = palette.colors.join('');
            if (!paletteSet.has(key)) {
                palettes.push(palette);
                paletteSet.add(key);
            }
        }

        // Generate the remaining palettes using the other factories
        while (palettes.length < numPalettes) {
            // Select a random factory
            const factory = this.factories[Math.floor(Math.random() * this.factories.length)];

            // Generate a palette using the selected factory
            const palette = (await factory.generatePalettes(1))[0];
            const key = palette.colors.join('');
            if (!paletteSet.has(key)) {
                palettes.push(palette);
                paletteSet.add(key);
            }
        }

        return palettes;
    }

}
