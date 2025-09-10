import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type UserRole = "admin" | "seller" | "customer";
export type UserStatus = "pending" | "approved" | "rejected";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  phone!: string;

  @Column()
  password!: string;

  // 👇 FIX: make otp a varchar instead of object
  @Column({ type: "varchar", nullable: true })
  otp!: string | null;

  @Column({ default: false })
  isVerified!: boolean;

  // 👇 use enum for safety
  @Column({ type: "enum", enum: ["admin", "seller", "customer"], default: "customer" })
  role!: UserRole;

  @Column({ type: "enum", enum: ["pending", "approved", "rejected"], default: "pending" })
  status!: UserStatus;

  // Seller-specific fields
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  idCopy?: string;

  @Column({ nullable: true })
  licenseDoc?: string;
}
