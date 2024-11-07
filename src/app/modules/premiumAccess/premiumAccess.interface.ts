import { Model, Types } from "mongoose";

export type TPremiumAccess = {
  user: Types.ObjectId;
  date: Date;
  startDate: Date;
  endDate: Date;
  paymentStatus: "pending" | "successful" | "failed";
  transactionId: string;
  pricePerMonth?: number;
  payableAmount: number;
  isPremiumMember: boolean;
  isAccessExpired: boolean;
};

export interface PremiumAccessModel extends Model<TPremiumAccess> {
  calculatePayableAmount(startDate: Date, endDate: Date, price: number): number;
  checkIfExpired(): boolean;
  updateAccessStatus(userId: Types.ObjectId, status: "successful" | "failed"): Promise<void>;
}
