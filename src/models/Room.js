const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    room_id: Number,
    bed_count: Number,
    price: Number,
    booked: {
       type: Boolean,
       default: false,
    },
    book_time: String,
    booker_name: String,
})

module.exports = mongoose.model('rooms', schema);
