import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['email'])
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
