import Sequelize from 'sequelize';

class Member extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            userId:DataTypes.INTEGER,
            teamId:DataTypes.INTEGER,
            admin:{
                type:DataTypes.BOOLEAN,
                defaultValue:false
            }
        },{sequelize});
    }
    
    static associate(models) {
        this.belongsTo(models.Team,{
            foreignKey:'teamId'
        });
        this.belongsTo(models.User,{
            foreignKey:'userId'
        })

    }
}
export default Member;
