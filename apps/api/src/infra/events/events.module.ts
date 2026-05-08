import { Module } from '@nestjs/common'
import { OnCommentCreated } from './on-comment-created'
import { OnCommentLiked } from './on-comment-liked'
import { OnPlaylistCreated } from './on-playlist-created'
import { OnUserCreated } from './on-user-created'
import { OnUserFollowed } from './on-user-followed'
import { OnVideoAddedToPlaylist } from './on-video-added-to-playlist'
import { OnVideoCreated } from './on-video-created'
import { OnVideoLiked } from './on-video-liked'
import { OnVideoPublished } from './on-video-published'
import { OnVideoRemovedFromPlaylist } from './on-video-removed-from-playlist'

@Module({
  providers: [
    OnUserCreated,
    OnUserFollowed,
    OnVideoCreated,
    OnVideoPublished,
    OnVideoLiked,
    OnCommentCreated,
    OnCommentLiked,
    OnPlaylistCreated,
    OnVideoAddedToPlaylist,
    OnVideoRemovedFromPlaylist,
  ],
})
export class EventsModule {}
