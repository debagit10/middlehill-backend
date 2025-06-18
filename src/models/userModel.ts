import { sequelize } from "../config/database_config";
import { Model, Optional, DataTypes, UUIDV4 } from "sequelize";

interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  pin: string;
  suspended: boolean;
  deleted: boolean;
  verified: boolean;
  mono_id: string | null; // Mono account ID
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
  "user",
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false },
    pin: { type: DataTypes.STRING, allowNull: false },
    suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    mono_id: { type: DataTypes.STRING, allowNull: true }, // Mono account ID
  },
  {
    timestamps: true,
    tableName: "users",
    modelName: "user",
  }
);

User.sync({ alter: true })
  .then(() => console.log("User table synced successfully."))
  .catch((error) => console.error("Error syncing user table", error));

export { User };
