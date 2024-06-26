import mongoose from 'mongoose';

const remediesSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    }
}, { collection: 'Remedies', timestamps: true });

const Remedies = mongoose.model('Remedies', remediesSchema);

export default Remedies;
