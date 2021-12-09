const Room = require('../models/Room');
const _ = require('lodash');
const { roomBookKeeper } = require('../crons/roomsHandler');

const show = async (ctx) => {
   const { room: roomFromQuery } = ctx.query;
   let rooms = await Room.find({});
   rooms = await roomBookKeeper(rooms);
   const groopedRoomsById = _.keyBy(rooms, 'room_id');
   let roomInfo = null;
      if (roomFromQuery) {
         roomInfo = groopedRoomsById[roomFromQuery];
      }
   const bookData = { 
      isUserLoggedIn: ctx.session.authenticated || false,
      userName: ctx.session.name,
      rooms: groopedRoomsById,
      isYourRoom: roomInfo ? ctx.session.id === roomInfo.booker_name : false,
      roomInfo,
      title: 'Бронювання номеру',
      get: _.get
    };
   
   await ctx.render('book', bookData);
}

const save = async (ctx) => {
   const { roomInfo, bookDays, bookHours } = ctx.request.body;
   
   if (!roomInfo.room_id && (!bookDays || !bookHours)) {
      ctx.status = 422;
   }
   
   if (ctx.session.authenticated === false){
      ctx.status = 400;
      return;
   }

   const bookTimeStr = [bookHours, bookDays, new Date().getTime()].join('|');
   try {
      if (bookTimeStr && (+bookHours || +bookDays)) {
         await Room.findByIdAndUpdate(roomInfo._id, { book_time: bookTimeStr, booked: true, booker_name: ctx.session.id });
      }
   } catch (error) {
      console.error(error);
   }
   ctx.status = 200;
   ctx.redirect(ctx.request.url);
}

module.exports = { show, save };