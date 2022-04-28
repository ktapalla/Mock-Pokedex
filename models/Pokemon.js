'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

var pokemonSchema = Schema( {
    id: Number,
    name: String,
    type1: String,
    type2: String,
    abilities: [String],
    category: String,
    height: String,
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