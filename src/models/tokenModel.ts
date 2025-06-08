import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database_config";

interface TokenAttributes {
  id: string;
  user_id: string;
  token: string;
}

// Define the optional attributes for when creating a new user (e.g., when not specifying an ID)
interface TokenCreationAttributes extends Optional<TokenAttributes, "id"> {}

const Token = sequelize.define<Model<TokenAttributes, TokenCreationAttributes>>(
  "token",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "tokens",
    modelName: "token",
  }
);

// Sync the User model with the database (create the table if it doesn't exist)
Token.sync({ alter: true })
  .then(() => console.log("Token table synced successfully"))
  .catch((error) => console.error("Error syncing OTP table:", error));

export { Token };
