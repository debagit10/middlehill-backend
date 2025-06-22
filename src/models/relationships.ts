import { User } from "./userModel";
import { Admin } from "./adminModel";
import { OTP } from "./otpModel";
import { Token } from "./tokenModel";
import { Transaction } from "./transactionModel";
import { User_Profile } from "./userProfileModel";
import { Statement } from "./statementModel";
import { Statement_Txn } from "./statement_txnModel";

User.hasOne(User_Profile, { foreignKey: "user_id", onDelete: "CASCADE" });
User_Profile.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Transaction, { foreignKey: "user_id", onDelete: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

Statement.hasMany(Statement_Txn, {
  foreignKey: "statement_id",
  onDelete: "CASCADE",
});
Statement_Txn.belongsTo(Statement, { foreignKey: "statement_id" });
