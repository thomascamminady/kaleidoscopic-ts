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
}

export function parseColorsFromUrl(url: string): string[] {
    const colors = url.split('-');
    return colors;
}
