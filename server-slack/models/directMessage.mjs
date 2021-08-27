import Sequelize from 'sequelize';

class DirectMessage extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            text:DataTypes.STRING,

        },{sequelize});
    }
    
    static associate(models) {
        this.belongsTo(models.User,{
            foreignKey:'receiver'
        });
        this.belongsTo(models.User,{
            foreignKey:'sender'
        });
        this.belongsTo(models.Team,{
          foreignKey:'teamId'
        });

    }
}
export default DirectMessage;
