import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product";
import { User } from "./user";

export type CategoryType =
  | "Fashion & Clothing"
  | "Electronics & Gadgets"
  | "Home & Furniture"
  | "Food & Beverages"
  | "Beauty & Personal Care"
  | "Books & Stationery"
  | "Health & Fitness"
  | "Automotive & Accessories"
  | "Kids & Baby Products"
  | "Real Estate & Property"
  | "Services";

export interface CategoryField {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "date";
  required: boolean;
  options?: string[]; // for enum/array fields
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: [
      "Fashion & Clothing",
      "Electronics & Gadgets",
      "Home & Furniture",
      "Food & Beverages",
      "Beauty & Personal Care",
      "Books & Stationery",
      "Health & Fitness",
      "Automotive & Accessories",
      "Kids & Baby Products",
      "Real Estate & Property",
      "Services",
    ],
    unique: true,
  })
  name!: CategoryType;

  // ✅ Dynamic fields per category (size, brand, color, etc.)
  @Column({ type: "jsonb" })
  fields!: CategoryField[];

  @Column({ nullable: true })
  description?: string;

  // ✅ Relation: one category has many products
  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  // ✅ Relation: one category has many sellers
  @OneToMany(() => User, (user) => user.category)
  sellers!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
