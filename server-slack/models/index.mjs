//https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/

import Primero from "./primero.mjs";
import Sequelize from 'sequelize';
const sequelize = new Sequelize('postgres://localhost:5432/nuevo');
import Channel from "./channel.mjs";
import Message from "./message.mjs";
import Team from "./team.mjs";
import User from "./user.mjs";
import Member from "./member.mjs";
import DirectMessage from "./directMessage.mjs";
import PCMember from "./pcMember.mjs";
const models = {
  //Primero: Primero.init(sequelize, Sequelize),
  Channel: Channel.init(sequelize,Sequelize),
  Message: Message.init(sequelize,Sequelize),
  Team: Team.init(sequelize,Sequelize),
  User: User.init(sequelize,Sequelize),
  Member: Member.init(sequelize,Sequelize),
  DirectMessage: DirectMessage.init(sequelize,Sequelize),
  PCMember: PCMember.init(sequelize,Sequelize)
};

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize
};

export default db;



/*BLOQUE QUE SI FUNCIONA

const Primero = require("./primero.js");
const Sequelize=require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/nuevo');

const models = {
  Primero: Primero.init(sequelize, Sequelize),
  };

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize
};

module.exports = db;
TERMINA BLOQUE QUE SI FUNCIONA*/