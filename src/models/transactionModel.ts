import { sequelize } from "../config/database_config";
import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";

interface TransactionAttributes {
  id: string;
  user_id: string;
  item_name: string;
  quantity: number;
  amount: number;
  deleted: boolean;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, "id"> {}

const Transaction = sequelize.define<
  Model<TransactionAttributes, TransactionCreationAttributes>
>(
  "user",
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
    user_id: { type: DataTypes.STRING, allowNull: false },
    item_name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.NUMBER, allowNull: false },
    amount: { type: DataTypes.NUMBER, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    timestamps: true,
    tableName: "transactions",
    modelName: "transaction",
  }
);

Transaction.sync({ alter: true })
  .then(() => console.log("Transaction table synced successfully."))
  .catch((error) => console.error("Error syncing transaction table", error));

export { Transaction };
