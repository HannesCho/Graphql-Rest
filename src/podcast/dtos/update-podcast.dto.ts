import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString, Length } from 'class-validator';
import { Episode } from '../entities/episode.entity';

@InputType()
export class UpdatePodcastDto {
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

  @Field((type) => [Episode])
  @IsArray()
  episodes?: Episode[];
}
