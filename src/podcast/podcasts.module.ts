import { Module } from '@nestjs/common';
import { PodcastsResolver } from './podcats.resolver';

@Module({
  providers: [PodcastsResolver],
})
export class PodcastsModule {}
