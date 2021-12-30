import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@ArgsType()
export class UpdateEpisodeDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  title?: string;
  @Field((type) => String)
  @IsString()
  category?: string;
  @Field((type) => Number)
  @IsString()
  rating?: number;
}
