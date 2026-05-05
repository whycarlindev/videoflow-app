import { WatchedList } from '@/core/entities/watched-list'
import { PlaylistItem } from './playlist-item'

export class PlaylistVideosList extends WatchedList<PlaylistItem> {
  compareItems(a: PlaylistItem, b: PlaylistItem): boolean {
    return a.videoId.equals(b.videoId)
  }
}
