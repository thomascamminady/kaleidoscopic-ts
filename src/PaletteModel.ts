import mongoose from 'mongoose';
const { Schema } = mongoose;

const paletteSchema = new Schema({
    colors: {
        type: [String],
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    }
});

const PaletteModel = mongoose.model('Palette', paletteSchema);

export default PaletteModel;
