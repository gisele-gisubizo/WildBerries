import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

  @Column({ type: "enum", enum: [
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
    "Services"
  ] })
  name!: CategoryType;

  @Column({ type: "json" })
  fields!: CategoryField[];

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
