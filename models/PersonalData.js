'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var personalDataSchema = Schema( {
  userId: ObjectId,
  pokemonName: String,
  seen: String,
  caught: String,
  favorite: String,
} );

module.exports = mongoose.model( 'PersonalData', personalDataSchema );
