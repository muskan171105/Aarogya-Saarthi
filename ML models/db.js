const mongoose = require('mongoose');

const InputDataSchema = new mongoose.Schema({
    October: Number,
    November: Number,
    December: Number,
    January: Number,
    February: Number,
    timestamp: { type: Date, default: Date.now }
});

const InputData = mongoose.model('InputData', InputDataSchema);

module.exports = InputData;
