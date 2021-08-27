//import { buildSchemaFromTypeDefinitions } from 'apollo-server-express';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
class User extends Sequelize.Model {
    static init(sequelize,DataTypes){
        return super.init({
            username:{
                type:DataTypes.STRING,
                unique:true,
                validate:{
                    isAlphanumeric:{
                        args:true,
                        msg:"The username can only contain letters and numbers"
                    },
                    len:{
                        args:[3,25],
                        msg:"The username can only be from 3 to 25 characters long"
                    },
                }
            },
            email:{
                type:DataTypes.STRING,
                unique:true,
                validate:{
                    isEmail:{
                        args:true,
                        msg:"Must be a valid email address"
                    }
                }
            },
            password:{
                type:DataTypes.STRING,
                validate:{
                    len:{
                        args:[3,25],
                        msg:"The password can only be from 3 to 25 characters long"
                    }
                }
            }  
            
        },
        {
            hooks:{
                afterValidate:async(user)=>{
                    user.password=await bcrypt.hash(user.password,12);
                }

            },
            sequelize
        });
    }
    
    static associate(models) {

        this.belongsToMany(models.Team,{
            through:models.Member,
            foreignKey:'userId',

        });
        this.belongsToMany(models.Channel,{
            through:models.PCMember,
            foreignKey:'userId'
        })
    }
}
export default User;
