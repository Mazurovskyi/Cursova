const _ = require('lodash');
const Room = require('../models/Room');

async function updateRoomsBookTime(rooms) {
  const roomsIds = rooms.map(({ room_id }) => room_id); 
  await Room.updateMany({room_id: {$in: roomsIds}}, { $set: { book_time: "" }}, { upsert: false });
}

// ...
async function roomBookKeeper(rooms) {
    const bookedRooms = rooms.filter((room) => {
        return room.book_time;
    });
    const roomsBookTimeToUpdate = [];
    for (const item of bookedRooms) {
        const [hours, days, beginTime] = item.book_time.split('|');
        const beginBookTimeDate = new Date(beginTime);
        const currDate = new Date().getTime();
        let bookTime = 0;
            if(hours && days) {
                bookTime = ((days * 24) + hours) * 360000;
            } else if (hours) {
                bookTime = hours * 360000;
            } else if (days) {
                bookTime = (days * 24) * 360000;
            }
        const isBookTimeExpired = (currDate - beginBookTimeDate) > bookTime;
            if (isBookTimeExpired) {
                item.book_time = "";
                roomsBookTimeToUpdate.push(item);
            }
    }
    if (roomsBookTimeToUpdate.length) {
        await updateRoomsBookTime(roomsBookTimeToUpdate);
    }
    return rooms;
};

module.exports = { roomBookKeeper };