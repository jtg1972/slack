import Sequelize from 'sequelize';

class Channel extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            name:DataTypes.STRING,
            public:{
                type:DataTypes.BOOLEAN,
                defaultValue:true
            },
            dm:{
                type:DataTypes.BOOLEAN,
                defaultValue:false
            }
        },{sequelize});
    }
    
    static associate(models) {
        this.belongsTo(models.Team,{
            foreignKey:'teamId'
        });
        
        this.belongsToMany(models.User,{
            through:models.PCMember,
            foreignKey:'channelId'

        })

    }
}
export default Channel;
