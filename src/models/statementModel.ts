import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database_config";

interface StatementAttributes {
  id: string;
  period: string;
  analysed: boolean;
}

interface StatementCreationAttributes
  extends Optional<StatementAttributes, "id"> {}

const Statement = sequelize.define<
  Model<StatementAttributes, StatementCreationAttributes>
>(
  "statements",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    analysed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "statements",
    modelName: "statement",
  }
);

Statement.sync({ alter: true })
  .then(() => console.log("Statement table synced successfully"))
  .catch((error) => console.error("Error syncing Statement table:", error));

export { Statement };
