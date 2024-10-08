import { Model, Types } from "mongoose";

export interface IBaseUser {
    id: string | Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
    role: 'user' | 'admin';
    status: 'active' | 'deactivated' | 'suspended' | 'blocked';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export interface BaseUserModel extends Model<IBaseUser> {
    // Check if a user exists by their email
    isUserExistsByEmail(email: string): Promise<IBaseUser | null>;

    // Compare a plain password with a hashed password
    isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;

    findByEmail(email: string): Promise<IBaseUser | null>;
};