// PaletteFactory.ts
import { Palette } from './Palette';
import { Color } from './Color';
import chroma from 'chroma-js';

export abstract class PaletteFactory {
    public abstract generatePalettes(numPalettes: number): Promise<Palette[]>;

    protected compareBrightness(a: string, b: string): number {
        const brightnessA = chroma(`#${a}`).luminance();
        const brightnessB = chroma(`#${b}`).luminance();
        return brightnessA > brightnessB ? -1 : brightnessA < brightnessB ? 1 : 0;
    }
}
import PaletteModel from './PaletteModel';

export class TopPalettesFactory extends PaletteFactory {
    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
        // Get the top numPalettes from the database
        const topPalettes = await PaletteModel.find().sort({ count: -1 }).limit(numPalettes).exec();

        // Convert the database objects to Palette objects
        const paletteObjects: Palette[] = topPalettes.map((dbPalette, index) => {
            console.log(`Rank: ${index + 1}, Count: ${dbPalette.count}, Colors: ${dbPalette.colors}`);
            return new Palette(dbPalette.colors);
        });

        return paletteObjects;
    }
}


export class RandomPaletteFactory extends PaletteFactory {
    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
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
    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
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
    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
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
    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
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




export class CamminadyDevPaletteFactory extends PaletteFactory {
    public async generatePalettes(numPalettes: number): Promise<Palette[]> {
        const hexpalettes = [
            ['#C4E6C3', '#96D2A4', '#6DBC90', '#4DA284', '#36877A', '#266B6E', '#1D4F60'],
            ['#F7FEAE', '#B7E6A5', '#7CCBA2', '#46AEA0', '#089099', '#00718B', '#045275'],
            ['#EDE5CF', '#E0C2A2', '#D39C83', '#C1766F', '#A65461', '#813753', '#541F3F'],
            ['#FBE6C5', '#F5BA98', '#EE8A82', '#DC7176', '#C8586C', '#9C3F5D', '#70284A'],
            ['#FFC6C4', '#F4A3A8', '#E38191', '#CC607D', '#AD466C', '#8B3058', '#672044'],
            ['#D2FBD4', '#A5DBC2', '#7BBCB0', '#559C9E', '#3A7C89', '#235D72', '#123F5A'],
            ['#D3F2A3', '#97E196', '#6CC08B', '#4C9B82', '#217A79', '#105965', '#074050'],
            ['#F3CBD3', '#EAA9BD', '#DD88AC', '#CA699D', '#B14D8E', '#91357D', '#6C2167'],
            ['#E4F1E1', '#B4D9CC', '#89C0B6', '#63A6A0', '#448C8A', '#287274', '#0D585F'],
            ['#ECDA9A', '#EFC47E', '#F3AD6A', '#F7945D', '#F97B57', '#F66356', '#EE4D5A'],
            ['#FDE0C5', '#FACBA6', '#F8B58B', '#F59E72', '#F2855D', '#EF6A4C', '#EB4A40'],
            ['#FEF6B5', '#FFDD9A', '#FFC285', '#FFA679', '#FA8A76', '#F16D7A', '#E15383'],
            ['#F9DDDA', '#F2B9C4', '#E597B9', '#CE78B3', '#AD5FAD', '#834BA0', '#573B88'],
            ['#F3E0F7', '#E4C7F1', '#D1AFE8', '#B998DD', '#9F82CE', '#826DBA', '#63589F'],
            ['#F6D2A9', '#F5B78E', '#F19C7C', '#EA8171', '#DD686C', '#CA5268', '#B13F64'],
            ['#FCDE9C', '#FAA476', '#F0746E', '#E34F6F', '#DC3977', '#B9257A', '#7C1D6F'],
            ['#F3E79B', '#FAC484', '#F8A07E', '#EB7F86', '#CE6693', '#A059A0', '#5C53A5'],
            ['#B0F2BC', '#89E8AC', '#67DBA5', '#4CC8A3', '#38B2A3', '#2C98A0', '#257D98'],
            ['#D1EEEA', '#A8DBD9', '#85C4C9', '#68ABB8', '#4F90A6', '#3B738F', '#2A5674'],
            ['#245668', '#0F7279', '#0D8F81', '#39AB7E', '#6EC574', '#A9DC67', '#EDEF5D'],
            ['#4B2991', '#872CA2', '#C0369D', '#EA4F88', '#FA7876', '#F6A97A', '#EDD9A3'],
            ['#D7F9D0', '#C7EDBD', '#B5E1A9', '#A4D698', '#92CB86', '#80C176', '#6BB767', '#54AE5B', '#39A553', '#1C9A51', '#0B8F4F', '#07824C', '#0D7648', '#136A43', '#185E3D', '#1A5336', '#1A472E', '#183B26', '#162F1D', '#122414'],
            ['#F1EDEC', '#EADDDA', '#E4CDC6', '#DFBEB3', '#DBAE9F', '#D69F8C', '#D18F78', '#CD8066', '#C87155', '#C36143', '#BD5134', '#B63F29', '#AE2D24', '#A21E25', '#931228', '#830E29', '#700E27', '#5F0E21', '#4D0C1A', '#3C0912'],
            ['#FDFECC', '#E3F4BD', '#C6EAB0', '#AAE0A8', '#8BD6A3', '#73CBA3', '#61BEA4', '#56B0A4', '#50A3A2', '#4A959F', '#46889C', '#427A99', '#3F6D97', '#3E6094', '#3F508E', '#424380', '#3F3869', '#392E54', '#30243E', '#281A2C'],
            ['#000000', '#060606', '#151414', '#212121', '#2E2E2E', '#3A3939', '#474646', '#525251', '#5E5E5D', '#6B6B6A', '#777776', '#858484', '#929191', '#9F9F9E', '#AEADAD', '#BCBCBB', '#CCCCCB', '#DCDCDB', '#EEEDEC', '#FFFFFD'],
            ['#C4E6C3', '#96D2A4', '#6DBC90', '#4DA284', '#36877A', '#266B6E', '#1D4F60'],
            ['#F7FEAE', '#B7E6A5', '#7CCBA2', '#46AEA0', '#089099', '#00718B', '#045275'],
            ['#EDE5CF', '#E0C2A2', '#D39C83', '#C1766F', '#A65461', '#813753', '#541F3F'],
            ['#FFFFFF', '#F0F0F0', '#E1E1E1', '#D2D2D2', '#C3C3C3', '#B5B5B5', '#A6A6A6', '#999999', '#8B8B8B', '#7D7D7D', '#717171', '#636363', '#575757', '#4B4B4B', '#3E3E3E', '#333333', '#272727', '#1D1D1D', '#111111', '#000000'],
            ['#8C0273', '#8F1966', '#92295A', '#93364F', '#954445', '#97513C', '#995F32', '#9B6C2A', '#9C7B21', '#9D8D1C', '#9A9F20', '#93B033', '#88BE4C', '#7CC867', '#6FD286', '#64DAA2', '#5FE4C2', '#6DEBDC', '#8FF0F1', '#B3F2FD'],
            ['#1A33B3', '#1F3CAE', '#2446A9', '#284EA5', '#2D57A0', '#31609C', '#376896', '#3E708F', '#457788', '#4E8181', '#598B7D', '#66987A', '#72A576', '#7FB273', '#8DC070', '#9CCE6C', '#AFDE69', '#C6EB67', '#E4F666', '#FFFF66'],
            ['#FFFFCC', '#FEF7B5', '#FCED9C', '#F9E184', '#F5D06C', '#F1BF5D', '#EDAD56', '#EA9D53', '#E68E52', '#E17D50', '#DA6C4E', '#CA5B4B', '#B54D46', '#9D4440', '#843D37', '#6E362D', '#562F21', '#412817', '#2B210D', '#1A1A01'],
            ['#1A0C64', '#1F1D6F', '#222C7A', '#263A84', '#29498D', '#2E5695', '#34639B', '#3C70A0', '#467BA3', '#5487A4', '#6390A2', '#76999F', '#879F9B', '#99A497', '#AEAA95', '#C5B49B', '#DEC3AB', '#F0D4C2', '#FAE5DC', '#FEF2F3'],
            ['#05598C', '#195D88', '#286284', '#366882', '#467083', '#577986', '#6A848B', '#7B8E91', '#8B9795', '#9AA198', '#A6A997', '#AFB094', '#B6B690', '#BBBB8B', '#C1C186', '#C8C883', '#D3D385', '#E1E18F', '#F1F1A0', '#FEFEB2'],
            ['#1A2659', '#2E3A6D', '#445083', '#596699', '#727EB1', '#8996C9', '#A3AFE1', '#B9C6F2', '#CBD8F8', '#DEEAFD', '#2A5100', '#495A01', '#65660C', '#837628', '#A18A47', '#BE9F65', '#DEB886', '#F2D0A7', '#F9E7C7', '#FDFDE6'],
            ['#010101', '#080F17', '#0D1A28', '#0F2439', '#12304C', '#173B60', '#1D4875', '#255589', '#31629E', '#4472B3', '#5982C2', '#6E90C8', '#7E9ACA', '#8DA3C9', '#9EAEC9', '#AEB9CB', '#C2C7D1', '#D5D8DC', '#EBECED', '#FFFFFF'],
            ['#1A0E34', '#2E153F', '#431F4B', '#572B58', '#6B3A64', '#794A6E', '#835A76', '#88677C', '#8C7480', '#8E8184', '#918D87', '#93998B', '#95A58E', '#98B292', '#9FC197', '#AAD2A0', '#C0E5AE', '#D7F3BD', '#EDFBCC', '#FEFED8'],
            ['#000000', '#151513', '#23231F', '#30302A', '#3F3F34', '#4D4C3B', '#5B5B42', '#686848', '#77754F', '#898456', '#9C925F', '#B29D6A', '#C4A474', '#D3A67F', '#E1A98C', '#EDAF9C', '#F7BBB1', '#FCC8C4', '#FFD8D6', '#FFE6E6'],
            ['#798234', '#A3AD62', '#D0D3A2', '#FDFBE4', '#F0C6C3', '#DF91A3', '#D46780'],
            ['#A16928', '#BD925A', '#D6BD8D', '#EDEAC2', '#B5C8B8', '#79A7AC', '#2887A1'],
            ['#3D5941', '#778868', '#B5B991', '#F6EDBD', '#EDBB8A', '#DE8A5A', '#CA562C'],
            ['#008080', '#70A494', '#B4C8A8', '#F6EDBD', '#EDBB8A', '#DE8A5A', '#CA562C'],
        ]
        const filteredPalettes = hexpalettes.filter(palette => palette.length >= 3 && palette.length <= 7);


        const hexpalettesWithoutHash = filteredPalettes.map(palette => {
            return palette.map(hex => hex.slice(1));
        });
        const palettes: Palette[] = [];

        for (let i = 0; i < numPalettes; i++) {
            palettes.push(new Palette(hexpalettesWithoutHash[Math.floor(Math.random() * hexpalettesWithoutHash.length)]));
        }
        return palettes
    }
}
