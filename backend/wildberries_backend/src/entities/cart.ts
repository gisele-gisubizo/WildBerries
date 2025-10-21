import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Users } from "./user";
import { CartItem } from "./cartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Users, (user) => user.cart, { eager: true })
  user!: Users;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true, eager: true })
  items!: CartItem[];
}
