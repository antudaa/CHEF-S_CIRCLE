import { Model, Types } from "mongoose";
import { IBaseUser } from "../GeneralUser/generalUser.interface";

export type TAdmin = IBaseUser & {
  email: string;
  name: string;
  password: string;
  role: "admin";
  permissions?: string[];
  user: Types.ObjectId;
  passwordChangedAt: Date;
}

export interface AdminModel extends Model<TAdmin> {
  // Activate an admin by their ID
  activateAdmin(id: string): Promise<void>;

  // Deactivate an admin by their ID
  deactivateAdmin(id: string): Promise<void>;

  // Update permissions for an admin
  updateAdminPermissions(id: string, permissions: string[]): Promise<void>;

  // Find an admin by email
  findAdminByEmail(email: string): Promise<TAdmin | null>;

  // Promote a user to admin
  promoteToAdmin(userId: Types.ObjectId): Promise<TAdmin>;

  // Demote an admin back to a user
  demoteAdmin(id: Types.ObjectId): Promise<void>;
}