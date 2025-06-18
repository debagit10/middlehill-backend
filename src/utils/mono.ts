import { Request, Response } from "express";
import axios from "axios";
import { User } from "../models/userModel";

export const connectMono = async (req: Request, res: Response) => {
  const user_id = res.locals.user_id;

  try {
    const { code } = req.body;

    const response = await axios.post(
      "https://api.withmono.com/account/auth",
      { code },
      {
        headers: {
          "mono-sec-key": process.env.MONO_SEC_KEY,
        },
      }
    );

    const { id: accountId } = response.data;

    await User.update({ mono_id: accountId }, { where: { id: user_id } });

    res.status(200).json({
      success: true,
      message: "Account linked successfully",
    });
    return;
  } catch (error: any) {
    console.error("Error in connectMono:", error);
    res
      .status(500)
      .json({ error: "Error connecting to mono", message: error.data });
    return;
  }
};
