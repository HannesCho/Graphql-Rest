import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@ArgsType()
export class CreateEpisodeDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  title: string;
  @Field((type) => String)
  @IsString()
  category: string;
}
