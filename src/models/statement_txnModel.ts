import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database_config";

interface Statement_TxnAttributes {
  id: string;
  statement_id: string;
  amount: number;
  date: Date;
}

interface Statement_TxnCreationAttributes
  extends Optional<Statement_TxnAttributes, "id"> {}

const Statement_Txn = sequelize.define<
  Model<Statement_TxnAttributes, Statement_TxnCreationAttributes>
>(
  "statement_txn",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    statement_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE,
  },
  {
    timestamps: true,
    tableName: "statements_txn",
    modelName: "statement_txn",
  }
);

Statement_Txn.sync({ alter: true })
  .then(() => console.log("Statement table synced successfully"))
  .catch((error) => console.error("Error syncing Statement table:", error));

export { Statement_Txn };
