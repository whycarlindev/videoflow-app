import { Module } from '@nestjs/common'
import { AddCommentController } from './controllers/add-comment.controller'
import { AddVideoToPlaylistController } from './controllers/add-video-to-playlist.controller'
import { AuthenticateUserController } from './controllers/authenticate-user.controller'
import { ClearWatchHistoryController } from './controllers/clear-watch-history.controller'
import { CreatePlaylistController } from './controllers/create-playlist.controller'
import { DeleteCommentController } from './controllers/delete-comment.controller'
import { DeletePlaylistController } from './controllers/delete-playlist.controller'
import { DeleteVideoController } from './controllers/delete-video.controller'
import { EditCommentController } from './controllers/edit-comment.controller'
import { FollowUserController } from './controllers/follow-user.controller'
import { GetPlaylistController } from './controllers/get-playlist.controller'
import { GetUserProfileController } from './controllers/get-user-profile.controller'
import { GetUserWatchHistoryController } from './controllers/get-user-watch-history.controller'
import { GetVideoDetailsController } from './controllers/get-video-details.controller'
import { LikeCommentController } from './controllers/like-comment.controller'
import { LikeVideoController } from './controllers/like-video.controller'
import { ListVideosController } from './controllers/list-videos.controller'
import { PublishVideoController } from './controllers/publish-video.controller'
import { RegisterUserController } from './controllers/register-user.controller'
import { RegisterWatchController } from './controllers/register-watch.controller'
import { RemoveVideoFromPlaylistController } from './controllers/remove-video-from-playlist.controller'
import { UnfollowUserController } from './controllers/unfollow-user.controller'
import { UnlikeCommentController } from './controllers/unlike-comment.controller'
import { UnlikeVideoController } from './controllers/unlike-video.controller'
import { UpdateUserProfileController } from './controllers/update-user-profile.controller'
import { UploadVideoController } from './controllers/upload-video.controller'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/storage.module'

// Use case imports — account
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/authenticate-user'
import { FollowUserUseCase } from '@/domain/account/application/use-cases/follow-user'
import { GetUserProfileUseCase } from '@/domain/account/application/use-cases/get-user-profile'
import { RegisterUserUseCase } from '@/domain/account/application/use-cases/register-user'
import { UnfollowUserUseCase } from '@/domain/account/application/use-cases/unfollow-user'
import { UpdateUserProfileUseCase } from '@/domain/account/application/use-cases/update-user-profile'

// Use case imports — video
import { DeleteVideoUseCase } from '@/domain/video/application/use-cases/delete-video'
import { GetVideoDetailsUseCase } from '@/domain/video/application/use-cases/get-video-details'
import { LikeVideoUseCase } from '@/domain/video/application/use-cases/like-video'
import { ListVideosUseCase } from '@/domain/video/application/use-cases/list-videos'
import { PublishVideoUseCase } from '@/domain/video/application/use-cases/publish-video'
import { UnlikeVideoUseCase } from '@/domain/video/application/use-cases/unlike-video'
import { UploadVideoUseCase } from '@/domain/video/application/use-cases/upload-video'

// Use case imports — comment
import { AddCommentUseCase } from '@/domain/comment/application/use-cases/add-comment'
import { DeleteCommentUseCase } from '@/domain/comment/application/use-cases/delete-comment'
import { EditCommentUseCase } from '@/domain/comment/application/use-cases/edit-comment'
import { LikeCommentUseCase } from '@/domain/comment/application/use-cases/like-comment'
import { UnlikeCommentUseCase } from '@/domain/comment/application/use-cases/unlike-comment'

// Use case imports — playlist
import { AddVideoToPlaylistUseCase } from '@/domain/playlist/application/use-cases/add-video-to-playlist'
import { CreatePlaylistUseCase } from '@/domain/playlist/application/use-cases/create-playlist'
import { DeletePlaylistUseCase } from '@/domain/playlist/application/use-cases/delete-playlist'
import { GetPlaylistUseCase } from '@/domain/playlist/application/use-cases/get-playlist'
import { RemoveVideoFromPlaylistUseCase } from '@/domain/playlist/application/use-cases/remove-video-from-playlist'

// Use case imports — watch-history
import { ClearWatchHistoryUseCase } from '@/domain/watch-history/application/use-cases/clear-watch-history'
import { GetUserWatchHistoryUseCase } from '@/domain/watch-history/application/use-cases/get-user-watch-history'
import { RegisterWatchUseCase } from '@/domain/watch-history/application/use-cases/register-watch'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    // account
    RegisterUserController,
    AuthenticateUserController,
    GetUserProfileController,
    UpdateUserProfileController,
    FollowUserController,
    UnfollowUserController,
    // video
    UploadVideoController,
    PublishVideoController,
    DeleteVideoController,
    GetVideoDetailsController,
    ListVideosController,
    LikeVideoController,
    UnlikeVideoController,
    // comment
    AddCommentController,
    DeleteCommentController,
    EditCommentController,
    LikeCommentController,
    UnlikeCommentController,
    // playlist
    CreatePlaylistController,
    DeletePlaylistController,
    GetPlaylistController,
    AddVideoToPlaylistController,
    RemoveVideoFromPlaylistController,
    // watch-history
    RegisterWatchController,
    GetUserWatchHistoryController,
    ClearWatchHistoryController,
  ],
  providers: [
    // account use cases
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    // video use cases
    UploadVideoUseCase,
    PublishVideoUseCase,
    DeleteVideoUseCase,
    GetVideoDetailsUseCase,
    ListVideosUseCase,
    LikeVideoUseCase,
    UnlikeVideoUseCase,
    // comment use cases
    AddCommentUseCase,
    DeleteCommentUseCase,
    EditCommentUseCase,
    LikeCommentUseCase,
    UnlikeCommentUseCase,
    // playlist use cases
    CreatePlaylistUseCase,
    DeletePlaylistUseCase,
    GetPlaylistUseCase,
    AddVideoToPlaylistUseCase,
    RemoveVideoFromPlaylistUseCase,
    // watch-history use cases
    RegisterWatchUseCase,
    GetUserWatchHistoryUseCase,
    ClearWatchHistoryUseCase,
  ],
})
export class HttpModule {}
