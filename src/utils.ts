// utils.ts
import chroma from 'chroma-js';

export class Palette {
    colors: string[];

    constructor(colors: string[]) {
        this.colors = colors;
    }

    getChromaColors(): chroma.Color[] {
        return this.colors.map(color => chroma(`#${color}`));
    }
    getTextColor(color: chroma.Color): string {
        return color.luminance() < 0.5 ? 'white' : 'black';
    }
}

export function parseColorsFromUrl(url: string): string[] {
    const colors = url.split('-');
    return colors;
}
