import { Playlist } from '@/domain/playlist/enterprise/entities/playlist'

export class PlaylistPresenter {
  static toHTTP(playlist: Playlist) {
    return {
      id: playlist.id.toString(),
      title: playlist.title,
      description: playlist.description,
      authorId: playlist.authorId.toString(),
      isPublic: playlist.isPublic,
      videos: playlist.videos.getItems().map((item) => ({
        videoId: item.videoId.toString(),
        position: item.position,
      })),
      createdAt: playlist.createdAt,
    }
  }
}
