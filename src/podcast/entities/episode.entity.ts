import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
  @Field((is) => Number)
  id: number;
  @Field((is) => String)
  title: string;
  @Field((is) => String)
  category: string;
  @Field((is) => Number)
  rating: number;
}
