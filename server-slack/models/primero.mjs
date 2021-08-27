//https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/

import Sequelize from 'sequelize';

class Primero extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            primero:DataTypes.STRING,
            segundo:DataTypes.STRING,
            tecero:DataTypes.STRING,
            cuarto:DataTypes.STRING
        },{sequelize});
    }
    
    static associate(models) {


    }
}
export default Primero;


/*COdigo que si sirve
const Sequelize = require('sequelize');

class Primero extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            primero:DataTypes.STRING,
            segundo:DataTypes.STRING,
            tecero:DataTypes.STRING
        },{sequelize});
    }
    
    static associate(models) {


    }
}

module.exports=Primero;
Fin condigo si sirve*/