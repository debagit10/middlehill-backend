import { sequelize } from "../config/database_config";
import { Model, Optional, DataTypes, UUIDV4 } from "sequelize";

interface UserProfileAttributes {
  id: string;
  user_id: string;
  email: string;
  bank_acc_no: string;
  bank_name: string;
  business_name: string;
  pic: string;
  address: string;
}

interface UserProfileCreationAttributes
  extends Optional<UserProfileAttributes, "id"> {}

const User_Profile = sequelize.define<
  Model<UserProfileAttributes, UserProfileCreationAttributes>
>(
  "user_profiles",
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    bank_acc_no: { type: DataTypes.STRING, allowNull: false },
    bank_name: { type: DataTypes.STRING, allowNull: false },
    business_name: { type: DataTypes.STRING, defaultValue: false },
    pic: { type: DataTypes.STRING, defaultValue: false },
    address: { type: DataTypes.STRING, defaultValue: false },
  },
  {
    timestamps: true,
    tableName: "user_profiles",
    modelName: "user_profile",
  }
);

User_Profile.sync({ alter: true })
  .then(() => console.log("User profile table synced successfully."))
  .catch((error) => console.error("Error syncing user profile table", error));

export { User_Profile };
