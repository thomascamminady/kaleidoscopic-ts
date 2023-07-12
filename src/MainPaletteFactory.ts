import { Palette } from './Palette';
import {
    PaletteFactory,
    DistinctPaletteFactory,
    ShadePaletteFactory,
    InterpolatedPaletteFactory,
    CamminadyDevPaletteFactory
} from './PaletteFactory';

export class MainFactory extends PaletteFactory {
    private factories: PaletteFactory[];

    constructor() {
        super();
        this.factories = [
            new CamminadyDevPaletteFactory(),
            new DistinctPaletteFactory(),
            new InterpolatedPaletteFactory(),
            new ShadePaletteFactory(),
        ];
    }

    public generatePalettes(numPalettes: number): Palette[] {
        const palettes: Palette[] = [];
        for (let i = 0; i < numPalettes; i++) {
            // Select a random factory
            const factory =
                this.factories[Math.floor(Math.random() * this.factories.length)];

            // Generate a palette using the selected factory
            // Note: This assumes each factory generates at least one palette
            const palette = factory.generatePalettes(1)[0];
            palettes.push(palette);
        }
        return palettes;
    }
}
