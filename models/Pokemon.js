'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

var pokemonSchema = Schema( {
    Id: Number,
    name: String,
    Type1: String,
    Type2: String,
    abilities: [String],
    category: String,
    height: Number,
    weight: Number,
    captureRate: Number,
    eggSteps: Number,
    expGroup: String,
    total: Number,
    hp: Number,
    attack: Number,
    defense: String,
    spAttack: Number,
    spDefense: Number,
    speed: Number,
    moves: Mixed
} )

module.exports = mongoose.model( 'Pokemon', pokemonSchema );