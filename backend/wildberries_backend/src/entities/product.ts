import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Category } from "./category";

export type ProductStatus =
  | "draft"
  | "active"
  | "out_of_stock"
  | "ordered"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "text" })
  description!: string;

  @Column({ default: 0 })
  stockQuantity!: number;

  @Column({ type: "enum", enum: [
    "draft",
    "active",
    "out_of_stock",
    "ordered",
    "shipped",
    "delivered",
    "cancelled",
    "returned"
  ], default: "draft" })
  status!: ProductStatus;

  @ManyToOne(() => User)
  @JoinColumn()
  seller!: User;

  @ManyToOne(() => Category)
  @JoinColumn()
  category!: Category;

  @Column({ type: "json", nullable: true })
  categoryFields?: Record<string, any>; // Dynamic fields based on category

  @Column({ type: "json", nullable: true })
  images?: string[]; // Array of image URLs

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
