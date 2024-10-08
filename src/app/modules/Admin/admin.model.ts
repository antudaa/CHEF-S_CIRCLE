import { Schema, model, Document, Types } from "mongoose";
import { TAdmin, AdminModel } from "./admin.interface";
import bcrypt from "bcrypt";
import config from "../../config";

// Admin Schema Definition
const adminSchema = new Schema<TAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'admin',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['active', 'deactivated', 'suspended'],
      default: 'active',
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

adminSchema.pre("save", async function (next) {
  const admin = this as Document & TAdmin;
  console.log("This sir from Admin Schema", admin)

  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(
      admin.password,
      Number(config.bcrypt_salt_rounds)
    );
    admin.passwordChangedAt = new Date();
  }
  next();
});

adminSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// Static Methods Implementation
adminSchema.statics.activateAdmin = async function (id: string): Promise<void> {
  await this.updateOne({ _id: id }, { status: 'active' });
};

adminSchema.statics.deactivateAdmin = async function (id: string): Promise<void> {
  await this.updateOne({ _id: id }, { status: 'deactivated' });
};

adminSchema.statics.updateAdminPermissions = async function (id: string, permissions: string[]): Promise<void> {
  await this.updateOne({ _id: id }, { permissions });
};

adminSchema.statics.findAdminByEmail = async function (email: string): Promise<TAdmin | null> {
  return await this.findOne({ email });
};

adminSchema.statics.promoteToAdmin = async function (userId: Types.ObjectId): Promise<TAdmin> {
  const user = await this.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.role = 'admin';
  await user.save();
  return user;
};

adminSchema.statics.demoteAdmin = async function (id: Types.ObjectId): Promise<void> {
  await this.updateOne({ _id: id }, { role: 'user' });
};

// Exporting the New Admin model
export const Admin = model<TAdmin, AdminModel>("Admin", adminSchema);
