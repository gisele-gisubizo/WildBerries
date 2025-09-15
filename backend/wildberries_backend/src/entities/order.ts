import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Product } from "./product";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number; // Price at time of order
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn()
  customer!: User;

  @Column({ type: "json" })
  items!: OrderItem[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: "enum", enum: [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
    "returned"
  ], default: "pending" })
  status!: OrderStatus;

  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
