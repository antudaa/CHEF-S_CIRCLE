import { Schema, model, Document } from "mongoose";
import { IBaseUser, BaseUserModel } from "./generalUser.interface";
import bcrypt from "bcrypt";
import config from "../../config";

// User Schema Definition
const baseUserSchema = new Schema<IBaseUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: null,
            unique: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        status: {
            type: String,
            enum: ['active', 'deactivated', 'suspended', 'blocked'],
            default: 'active',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

baseUserSchema.pre("save", async function (next) {
    const user = this as Document & IBaseUser;
    console.log("This is from General User Schema", user);

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(
            user.password,
            Number(config.bcrypt_salt_rounds)
        );
    }
    next();
});

// Remove sensitive data like password in the output
baseUserSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

// Static Methods
baseUserSchema.statics.findByEmail = async function (email: string): Promise<IBaseUser | null> {
    return await this.findOne({ email });
};

baseUserSchema.statics.isUserExistsByEmail = async function (email: string): Promise<IBaseUser | null> {
    return this.findOne({ email });
};

baseUserSchema.statics.isPasswordMatched = async function (
    plainPassword: string,
    hashedPassword: string,
): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
};


export const BaseUser = model<IBaseUser, BaseUserModel>("BaseUser", baseUserSchema);
