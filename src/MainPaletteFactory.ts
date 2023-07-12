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
        new DistinctPaletteFactory(),
        new InterpolatedPaletteFactory(),
        new ShadePaletteFactory(),
    ];

    constructor() {
        super();
    }

    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
        const palettes: Palette[] = [];

        // Get top palettes
        const topPalettesFactory = new TopPalettesFactory();
        const topPalettes = await topPalettesFactory.generatePalettes(100);
        palettes.push(...topPalettes);

        const numRemainingPalettes = numPalettes - palettes.length;

        // Generate the remaining palettes using the other factories
        for (let i = 0; i < numRemainingPalettes; i++) {
            // Select a random factory
            const factory = this.factories[Math.floor(Math.random() * this.factories.length)];

            // Generate a palette using the selected factory
            const palette = (await factory.generatePalettes(1))[0];
            palettes.push(palette);
        }

        return palettes;
    }
}
