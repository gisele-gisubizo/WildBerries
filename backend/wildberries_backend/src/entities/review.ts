import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Product } from "./product";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn()
  customer!: User;

  @ManyToOne(() => Product)
  @JoinColumn()
  product!: Product;

  @Column({ type: "int", width: 1 })
  rating!: number; // 1-5 stars

  @Column({ type: "text", nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
