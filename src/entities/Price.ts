import { Field, Float, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './Product';

@ObjectType()
@Entity()
export class Price extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Field()
  @Column()
  size!: string;

  @ManyToOne(() => Product, (product) => product.prices)
  product: Product;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
