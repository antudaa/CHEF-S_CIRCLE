import { Schema, model, Document } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import { UserStatus } from "./user.constant";

// User Schema Definition
const userSchema = new Schema<TUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    profileImage: String,
    isPremium: {
      type: Boolean,
      default: false,
    },
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    bio: {
      type: String,
      required: false,
    },
    memberShipExpiration: {
      type: Date,
      required: false,
    },
    favouriteRecipeList: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: false,
    }],
    socialLinks: {
      instagram: String,
      twitter: String,
      facebook: String,
    },
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: false,
      },
      pushNotifications: {
        type: Boolean,
        default: false,
      },
    },
    recipeCount: {
      type: Number,
      default: 0,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Pre-save hook to hash the password if it's new or modified
userSchema.pre("save", async function (next) {
  const user = this as Document & TUser;
  console.log("This is from user Schema", user)

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
    user.passwordChangedAt = new Date();
  }
  next();
});

// Remove sensitive data like password in the output
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// Static methods for additional functionality
userSchema.statics = {
  // Hash a given password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
  },

  // Check if the user exists by email
  async isUserExistsByEmail(email: string): Promise<TUser | null> {
    return this.findOne({ email });
  },

  // Check if the user exists by ID
  async isUserExistsByID(id: string): Promise<TUser | null> {
    return this.findById(id);
  },

  // Block a user by their ID
  async blockUserByID(id: Schema.Types.ObjectId): Promise<TUser | null> {
    return this.findByIdAndUpdate(
      id,
      { status: 'blocked' },
      { new: true },
    );
  },

  // Check if a user is blocked
  async isUserBlocked(id: Schema.Types.ObjectId): Promise<boolean> {
    const user = await this.findById(id);
    return user && user.status === 'blocked';
  },

  // Soft delete a user by ID (mark as deleted)
  async deleteUserByID(id: Schema.Types.ObjectId): Promise<TUser | null> {
    return this.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  },

  // Check if a user is deleted by their ID
  async isUserDeleted(id: Schema.Types.ObjectId): Promise<boolean> {
    const user = await this.findById(id);
    return user && user.isDeleted === true;
  },

  // Check if JWT is issued before the password was changed
  async isJWTIssuedBeforePasswordChanged(
    passwordChangedAt: Date,
    jwtIssuedAt: number
  ): Promise<boolean> {
    const passwordChangeTime = new Date(passwordChangedAt).getTime() / 1000;
    return passwordChangeTime > jwtIssuedAt;
  },

  // Compare a plain password with a hashed password
  async isPasswordMatched(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
};

// Exporting the User model
export const User = model<TUser, UserModel>("User", userSchema);
