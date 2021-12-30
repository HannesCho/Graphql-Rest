import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';

@Resolver((of) => Podcast)
export class PodcastsResolver {
  private podcasts: Podcast[] = [];
  @Query((returns) => [Podcast])
  getAllPodcasts(): Podcast[] {
    return this.podcasts;
  }

  @Mutation((returns) => Boolean)
  createPodcast(@Args() createPodcastInput: CreatePodcastDto): boolean {
    const { title, category } = createPodcastInput;
    const id = Date.now();
    this.podcasts.push({ id, title, category, rating: 0, episodes: [] });
    return true;
  }

  @Query((returns) => Podcast || String)
  getPodcast(@Args('id') id: string): Podcast | string {
    const foundPodcasts = this.podcasts.filter((podcast) => podcast.id === +id);
    if (foundPodcasts.length === 0) {
      return 'Podcast not found.';
    }
    if (foundPodcasts.length === 1) {
      return foundPodcasts[0];
    }
    if (foundPodcasts.length > 2) {
      return 'More than one items with same id.';
    }
  }

  @Mutation((returns) => Boolean)
  deletePodcast(@Args('id') id: string): boolean {
    this.podcasts = this.podcasts.filter((p) => p.id !== +id);
    return true;
  }

  @Mutation((returns) => String || Boolean)
  updatePodcast(
    @Args('id') id: string,
    @Args('updatePodcastDto') updatePodcastDto: UpdatePodcastDto,
  ): string | boolean {
    const podcast = this.getPodcast(id);
    if (typeof podcast === 'string') {
      return podcast;
    }
    this.deletePodcast(id);
    this.podcasts.push({ ...podcast, ...updatePodcastDto });
    return true;
  }

  @Query((returns) => [Episode] || String)
  getEpisodes(@Args('podcastId') podcastId: string): Episode[] | string {
    const podcast = this.getPodcast(podcastId);
    if (typeof podcast === 'string') {
      return podcast;
    }
    return podcast.episodes;
  }

  @Mutation((returns) => String || Number)
  createEpisode(
    @Args('podcastId') podcastId: string,
    @Args() CreateEpisodeDto: CreateEpisodeDto,
  ): number | string | null {
    const { title, category } = CreateEpisodeDto;
    const podcast = this.getPodcast(podcastId);
    if (typeof podcast === 'string') {
      return podcast;
    }
    const episodeId = Date.now();
    const newEpisode: Episode = { id: episodeId, title, category, rating: 0 };
    const update = this.updatePodcast(podcastId, {
      ...podcast,
      episodes: [...podcast.episodes, newEpisode],
    });
    if (typeof update === 'string') {
      return update;
    }
    return episodeId;
  }

  @Mutation((returns) => String || Boolean)
  deleteEpisode(
    @Args('podcastId') podcastId: string,
    @Args('episodeId') episodeId: string,
  ): string | boolean {
    const podcast = this.getPodcast(podcastId);
    if (typeof podcast === 'string') {
      return podcast;
    }
    const update = this.updatePodcast(podcastId, {
      episodes: podcast.episodes.filter((episode) => episode.id !== +episodeId),
    });
    if (typeof update === 'string') {
      return update;
    }
    return true;
  }

  @Query((returns) => Episode || String)
  findEpisode(
    @Args('podcastId') podcastId: string,
    @Args('episodeId') episodeId: string,
  ): Episode | string {
    const episodes = this.getEpisodes(podcastId);
    if (typeof episodes === 'string') {
      return episodes;
    }
    const episode = episodes.find((episode) => episode.id === +episodeId);
    if (!episode) {
      return 'Episode not found';
    }
    return episode;
  }

  @Mutation((returns) => String || Boolean)
  updateEpisode(
    @Args('podcastId') podcastId: string,
    @Args('episodeId') episodeId: string,
    @Args() updateEpisodeDto: UpdateEpisodeDto,
  ): string | boolean {
    const episode = this.findEpisode(podcastId, episodeId);
    if (typeof episode === 'string') {
      return episode;
    }
    const deleteResult = this.deleteEpisode(podcastId, episodeId);
    if (typeof deleteResult === 'string') {
      return deleteResult;
    }
    const podcast = this.getPodcast(podcastId);
    if (typeof podcast === 'string') {
      return podcast;
    }
    this.updatePodcast(podcastId, {
      ...podcast,
      episodes: [...podcast.episodes, { ...episode, ...updateEpisodeDto }],
    });
    return true;
  }
}
