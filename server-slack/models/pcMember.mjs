import Sequelize from 'sequelize';

class PCMember extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            userId:DataTypes.INTEGER,
            channelId:DataTypes.INTEGER,
            
        },{sequelize});
    }
    
    static associate(models) {
        this.belongsTo(models.Channel,{
            foreignKey:'channelId'
        });
        this.belongsTo(models.User,{
            foreignKey:'userId'
        })

    }
}
export default PCMember;
