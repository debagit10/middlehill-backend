import { User } from "./userModel";
import { Admin } from "./adminModel";
import { OTP } from "./otpModel";
import { Token } from "./tokenModel";
import { Transaction } from "./transactionModel";
import { User_Profile } from "./userProfileModel";

User.hasOne(User_Profile, { foreignKey: "user_id", onDelete: "CASCADE" });
User_Profile.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(OTP, { foreignKey: "user_id", onDelete: "CASCADE" });
OTP.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Token, { foreignKey: "user_id", onDelete: "CASCADE" });
Token.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Transaction, { foreignKey: "user_id", onDelete: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

Admin.hasMany(OTP, { foreignKey: "user_id", onDelete: "CASCADE" });
OTP.belongsTo(Admin, { foreignKey: "user_id" });
