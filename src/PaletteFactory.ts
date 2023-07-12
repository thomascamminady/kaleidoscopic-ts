// PaletteFactory.ts
import { Palette } from './Palette';
import { Color } from './Color';
import chroma from 'chroma-js';

export abstract class PaletteFactory {
    public abstract generatePalettes(numPalettes: number): Palette[];

    protected compareBrightness(a: string, b: string): number {
        const brightnessA = chroma(`#${a}`).luminance();
        const brightnessB = chroma(`#${b}`).luminance();
        return brightnessA > brightnessB ? -1 : brightnessA < brightnessB ? 1 : 0;
    }
}

export class RandomPaletteFactory extends PaletteFactory {
    public generatePalettes(numPalettes: number): Palette[] {
        const randomPalettes: Palette[] = [];
        for (let i = 0; i < numPalettes; i++) {
            const randomColors: string[] = [];
            const numColors = Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
            for (let j = 0; j < numColors; j++) {
                randomColors.push(Color.generateRandomColor());
            }

            // Sort colors by brightness
            randomColors.sort((a, b) => this.compareBrightness(a, b));
            randomPalettes.push(new Palette(randomColors));
        }
        return randomPalettes;
    }
}

export class DistinctPaletteFactory extends PaletteFactory {
    public generatePalettes(numPalettes: number): Palette[] {
        const distinctPalettes: Palette[] = [];

        for (let i = 0; i < numPalettes; i++) {
            distinctPalettes.push(new Palette(this.generateDistinctColors()));
        }

        return distinctPalettes;
    }

    private generateDistinctColors(): string[] {
        const numColors = Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
        const colors: string[] = [];

        // Generate a random hue for the first color
        let hue = Math.random() * 360;

        for (let i = 0; i < numColors; i++) {
            // For subsequent colors, increment the hue by (360 / numColors)
            if (i > 0) {
                hue = (hue + 360 / numColors) % 360;
            }

            colors.push(Color.generateColorWithHue(hue));
        }

        return colors.sort((a, b) => this.compareBrightness(a, b));
    }
}

export class ShadePaletteFactory extends PaletteFactory {
    public generatePalettes(numPalettes: number): Palette[] {
        const shadePalettes: Palette[] = [];

        for (let i = 0; i < numPalettes; i++) {
            shadePalettes.push(new Palette(this.generateColorShades()));
        }

        return shadePalettes;
    }

    private generateColorShades(): string[] {
        const numShades = Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
        const shades: string[] = [];

        // Generate a random hue for the base color
        const hue = Math.random() * 360;

        for (let i = 0; i < numShades; i++) {
            // Vary the lightness for each shade between 0.1 and 0.9
            const lightness = 0.1 + (i / (numShades - 1)) * 0.8;
            shades.push(Color.generateShadeWithHue(hue, lightness));
        }

        return shades.sort((a, b) => this.compareBrightness(a, b));
    }
}

export class InterpolatedPaletteFactory extends PaletteFactory {
    public generatePalettes(numPalettes: number): Palette[] {
        const interpolatedPalettes: Palette[] = [];
        for (let i = 0; i < numPalettes; i++) {
            const interpolatedColors: string[] = [];

            // Generate two random colors
            const colorA = Color.generateRandomColor();
            const colorB = Color.generateRandomColor();

            // Interpolate between the two colors
            const numColors = Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
            for (let j = 0; j < numColors; j++) {
                const t = j / (numColors - 1); // t goes from 0 to 1
                const color = chroma.mix(colorA, colorB, t).hex().substring(1); // remove the # from the hex code
                interpolatedColors.push(color);
            }

            // Sort colors by brightness
            interpolatedColors.sort((a, b) => this.compareBrightness(a, b));
            interpolatedPalettes.push(new Palette(interpolatedColors));
        }
        return interpolatedPalettes;
    }
}
