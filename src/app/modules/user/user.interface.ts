import { Model, Types } from "mongoose";
import { IBaseUser } from "../GeneralUser/generalUser.interface";
import { USER_ROLE } from "./user.constant";

export type TPayment = {
  transactionId: string;
  paymentStatus: string;
}

export type TUser = IBaseUser & {
  password: string;
  profileImage: string;
  isPremium: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  user: Types.ObjectId;
  name: string;
  bio?: string;
  memberShipExpiration?: Date;
  favouriteRecipeList: Types.ObjectId[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  notificationPreferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  recipeCount?: number;
  isDeleted: boolean;
  paymentInfo?: TPayment;
  passwordChangedAt: Date;
}


export interface UserModel extends Model<TUser> {

  // Hash a user's password
  hashPassword(password: string): Promise<string>;

  // Compare a plain password with a hashed password
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;

  // Block a user by their ID
  blockUserByID(id: Types.ObjectId): Promise<Types.ObjectId>;

  // Delete a user by their ID
  deleteUserByID(id: Types.ObjectId): Promise<Types.ObjectId>;

  // Check if a user is blocked by their ID
  isUserBlocked(id: Types.ObjectId): Promise<Types.ObjectId>;

  // Check if a user exists by their ID
  isUserExistsByID(id: string): Promise<string>;

  // Check if a user exists by their email
  isUserExistsByEmail(email: string): Promise<TUser | null>;

  // Check if a user is deleted by their ID
  isUserDeleted(id: Types.ObjectId): Promise<Types.ObjectId>;

  // Check if JWT is issued before the user's password change
  isJWTIssuedBeforePasswordChanged(passwordChangeTimeStamp: Date, jwtIssuedTimeStamp: number): Promise<boolean>;

  // Update a user's profile
  updateUserProfile(id: Types.ObjectId, updateData: Partial<TUser>): Promise<TUser>;

  // List user's followers
  getUserFollowers(id: Types.ObjectId): Promise<TUser[]>;

  // List users the user is following
  getUserFollowing(id: Types.ObjectId): Promise<TUser[]>;
};

export type TUserRole = keyof typeof USER_ROLE;