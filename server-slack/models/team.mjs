import Sequelize from 'sequelize';

class Team extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
           name:{
               type:DataTypes.STRING,
               unique:true,
               validate:{
                   len:{
                       args:[5,25],
                       msg:"El equipo puede ser desde 5 hasta 25 caracteres de longitud"
                   }
               }
           }
        },{sequelize});
    }
    
    static associate(models) {
        this.belongsToMany(models.User,{
            through:models.Member,
            foreignKey:'teamId'
        });
        /*this.belongsTo(models.User,{
            foreignKey:'owner',
        })*/

    }
}
export default Team;
