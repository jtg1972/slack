import Sequelize from 'sequelize';

class Message extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            text:DataTypes.STRING,
            url:DataTypes.STRING,
            filetype:DataTypes.STRING

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
export default Message;
