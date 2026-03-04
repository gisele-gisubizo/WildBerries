import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product";
import { Users } from "./user";

export type CategoryType =
  | "Women's Clothing"
  | "Men's Clothing"
  | "Kids & Baby Clothing"
  | "Shoes & Footwear"
  | "Bags & Accessories"
  | "Jewelry & Watches"
  | "Beauty & Makeup"
  | "Skincare & Hair Care"
  | "Sportswear & Activewear"
  | "Lingerie & Sleepwear"
  | "Home & Living"
  | "Phone & Electronics Accessories";

export interface CategoryField {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "date";
  required: boolean;
  options?: string[];
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: [
      "Women's Clothing",
      "Men's Clothing",
      "Kids & Baby Clothing",
      "Shoes & Footwear",
      "Bags & Accessories",
      "Jewelry & Watches",
      "Beauty & Makeup",
      "Skincare & Hair Care",
      "Sportswear & Activewear",
      "Lingerie & Sleepwear",
      "Home & Living",
      "Phone & Electronics Accessories",
    ],
    unique: true,
  })
  name!: CategoryType;

  @Column({ type: "jsonb" })
  fields!: CategoryField[];

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  @OneToMany(() => Users, (user) => user.category)
  sellers!: Users[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
