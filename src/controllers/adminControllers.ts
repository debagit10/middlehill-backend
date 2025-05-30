import { adminServices } from "../services/adminServices";
import { Request, Response } from "express";
import { admin_mgt_Services } from "../services/admin_mgt_Services";
import { verifyPin } from "../utils/pin";
import {
  encryptToken,
  generateAccessToken,
  generateRefreshToken,
} from "../config/token";

interface AdminData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface EditPasswordData {
  curPassword: string;
  newPassword: string;
}

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const adminData: AdminData = req.body;

    const { exists, suspended } = await adminServices.adminExists(
      adminData.email
    );

    if (!exists) {
      res.status(409).json({ error: "Admin already exists" });
      return;
    }

    if (suspended) {
      res.status(403).json({ error: "Account suspended" });
    }

    const { success, error, data } = await adminServices.addAdmin({
      ...adminData,
    });

    if (error) {
      res.status(500).json({ error });
      return;
    }

    res
      .status(201)
      .json({ success, message: "Admin added successfully", data });
    return;
  } catch (error) {
    console.error("Error in addAdmin controller", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const adminData: LoginData = req.body;

    const { exists, error, admin, suspended } = await adminServices.adminExists(
      adminData.email
    );

    if (!exists) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    if (suspended) {
      res.status(403).json({ error: "Account suspended" });
    }

    if (error) {
      res.status(401).json({ error });
      return;
    }

    const checkPin = await verifyPin(
      adminData.password,
      String(admin?.password)
    );

    if (!checkPin) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    const accessToken = generateAccessToken({
      userId: String(admin?.id),
      role: admin?.role,
    });

    const refreshToken = await generateRefreshToken({
      userId: String(admin?.id),
      role: admin?.role,
    });

    res.status(200).json({
      message: "Login successful",
      admin,
      accessToken: encryptToken(accessToken),
      refreshToken: encryptToken(refreshToken),
    });
    return;
  } catch (error) {
    console.error("Error in loginAdmin controller", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = await adminServices.getAllAdmins();

    if (error) {
      res.status(404).json({ error });
      return;
    }

    res.status(200).json({ success, data });
  } catch (error) {
    console.error("Error in getAllAdmins controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editAdmin = async (req: Request, res: Response) => {
  try {
    const { admin_id } = req.params;
    const editData: AdminData = req.body;

    const { success, error } = await admin_mgt_Services.editAdmin(
      admin_id,
      editData
    );

    if (error) {
      res.status(404).json({ error });
      return;
    }

    res.status(200).json({ success });
  } catch (error) {
    console.error("Error in editAdmin controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
    const { admin_id } = req.params;
    const passwordData: EditPasswordData = req.body;

    const { exists, admin, suspended } = await adminServices.adminExists(
      admin_id
    );

    if (!exists) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    if (suspended) {
      res.status(403).json({ error: "Account suspended" });
    }

    if (!admin || !admin.password) {
      res.status(500).json({ error: "Admin password not found" });
      return;
    }

    const { success, error } = await admin_mgt_Services.changePassword(
      admin.id,
      {
        ...passwordData,
        hashPassword: admin.password,
      }
    );

    if (error) {
      res.status(404).json({ error });
      return;
    }

    res.status(200).json({ success });
  } catch (error) {
    console.error("Error in changeAdminPassword controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const suspendAdmin = async (req: Request, res: Response) => {
  try {
    const { admin_id } = req.params;

    const { success, error } = await admin_mgt_Services.suspendAdmin(admin_id);

    if (error) {
      res.status(404).json({ error });
      return;
    }

    res.status(200).json({ success });
  } catch (error) {
    console.error("Error in suspendAdmin controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reinstateAdmin = async (req: Request, res: Response) => {
  try {
    const { admin_id } = req.params;

    const { success, error } = await admin_mgt_Services.reinstateAdmin(
      admin_id
    );

    if (error) {
      res.status(404).json({ error });
      return;
    }

    res.status(200).json({ success });
  } catch (error) {
    console.error("Error in reinstateAdmin controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { admin_id } = req.params;

    const { success, error } = await admin_mgt_Services.deleteAdmin(admin_id);

    if (error) {
      res.status(404).json({ error });
      return;
    }

    res.status(200).json({ success });
  } catch (error) {
    console.error("Error in deleteAdmin controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
