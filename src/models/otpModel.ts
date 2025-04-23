import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database_config";

interface OtpAttributes {
  id: string;
  user_id: string;
  otp_code: string;
  expiresAt: Date;
  used?: boolean;
}

// Define the optional attributes for when creating a new user (e.g., when not specifying an ID)
interface OtpCreationAttributes extends Optional<OtpAttributes, "id"> {}

const OTP = sequelize.define<Model<OtpAttributes, OtpCreationAttributes>>(
  "otp",
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
    otp_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "otps",
    modelName: "otp",
  }
);

// Sync the User model with the database (create the table if it doesn't exist)
OTP.sync({ alter: true })
  .then(() => console.log("OTP table synced successfully"))
  .catch((error) => console.error("Error syncing OTP table:", error));

export { OTP };
