import chroma from 'chroma-js';

export class Color {
  public static generateRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor.padStart(6, '0'); // Ensure 6-digit hex code
  }

  public static generateColorWithHue(hue: number): string {
    const color = chroma.hsl(hue, 0.5, 0.5);
    return color.hex().substring(1); // Remove '#' from start of string
  }

  public static generateShadeWithHue(hue: number, lightness: number): string {
    const shade = chroma.hsl(hue, 0.5, lightness);
    return shade.hex().substring(1); // Remove '#' from start of string
  }
}
