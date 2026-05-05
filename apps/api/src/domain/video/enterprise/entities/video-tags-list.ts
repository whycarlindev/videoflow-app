import { WatchedList } from '@/core/entities/watched-list'

export class VideoTagsList extends WatchedList<string> {
  compareItems(a: string, b: string): boolean {
    return a.toLowerCase() === b.toLowerCase()
  }
}
