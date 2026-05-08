import { Module } from '@nestjs/common'
import { CommentLikesRepository } from '@/domain/comment/application/repositories/comment-likes-repository'
import { CommentsRepository } from '@/domain/comment/application/repositories/comments-repository'
import { PlaylistsRepository } from '@/domain/playlist/application/repositories/playlists-repository'
import { SubscriptionsRepository } from '@/domain/account/application/repositories/subscriptions-repository'
import { UsersRepository } from '@/domain/account/application/repositories/users-repository'
import { VideoLikesRepository } from '@/domain/video/application/repositories/video-likes-repository'
import { VideosRepository } from '@/domain/video/application/repositories/videos-repository'
import { WatchHistoryRepository } from '@/domain/watch-history/application/repositories/watch-history-repository'
import { PrismaCommentLikesRepository } from './prisma/repositories/prisma-comment-likes-repository'
import { PrismaCommentsRepository } from './prisma/repositories/prisma-comments-repository'
import { PrismaPlaylistsRepository } from './prisma/repositories/prisma-playlists-repository'
import { PrismaService } from './prisma/prisma.service'
import { PrismaSubscriptionsRepository } from './prisma/repositories/prisma-subscriptions-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { PrismaVideoLikesRepository } from './prisma/repositories/prisma-video-likes-repository'
import { PrismaVideosRepository } from './prisma/repositories/prisma-videos-repository'
import { PrismaWatchHistoryRepository } from './prisma/repositories/prisma-watch-history-repository'

@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: SubscriptionsRepository, useClass: PrismaSubscriptionsRepository },
    { provide: VideosRepository, useClass: PrismaVideosRepository },
    { provide: VideoLikesRepository, useClass: PrismaVideoLikesRepository },
    { provide: CommentsRepository, useClass: PrismaCommentsRepository },
    { provide: CommentLikesRepository, useClass: PrismaCommentLikesRepository },
    { provide: PlaylistsRepository, useClass: PrismaPlaylistsRepository },
    { provide: WatchHistoryRepository, useClass: PrismaWatchHistoryRepository },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    SubscriptionsRepository,
    VideosRepository,
    VideoLikesRepository,
    CommentsRepository,
    CommentLikesRepository,
    PlaylistsRepository,
    WatchHistoryRepository,
  ],
})
export class DatabaseModule {}
