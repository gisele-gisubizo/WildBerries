import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { User } from "./user";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("int")
  stock!: number;

  // ✅ Flexible attributes (category-specific)
  @Column({ type: "jsonb" })
  attributes!: Record<string, any>;

  // ✅ Store multiple image URLs
  @Column("text", { array: true, nullable: true })
  images!: string[];

  // ✅ Relations
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category!: Category;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  seller!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
