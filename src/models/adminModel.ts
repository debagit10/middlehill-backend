import { sequelize } from "../config/database_config";
import { DataTypes, Model, Optional } from "sequelize";

interface AdminAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  suspended: boolean;
  deleted: boolean;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, "id"> {}

export const Admin = sequelize.define<
  Model<AdminAttributes, AdminCreationAttributes>
>(
  "admin",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    suspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true, tableName: "admins", modelName: "admin" }
);

// Sync the Admin model with the database (create the table if it doesn't exist)
Admin.sync({ alter: true })
  .then(() => console.log("Admin table synced successfully"))
  .catch((error) => console.error("Error syncing Admin table:", error));
