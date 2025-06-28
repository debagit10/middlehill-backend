import { statementServices } from "../services/statementServices";
import { Request, Response } from "express";
import { getStatement } from "../utils/mono";
import { userServices } from "../services/userServices";

export const uploadStatement = async (req: Request, res: Response) => {
  const user_id = res.locals.user_id;

  try {
    const { error, user } = await userServices.getUser(user_id);

    if (error) {
      res.status(500).json(error);
      return;
    }

    const statement = await getStatement(user?.dataValues.mono_id);

    if (statement.error) {
      res.status(500).json(statement.error);
      return;
    }

    res.status(200).json(statement);
  } catch (error) {
    console.error("Error uploading statement", error);
    res.status(500).json({ error: "Error uploading statement " });
    return;
  }
};
