export type GetVideoStreamParams = {
  videoKey: string
  rangeStart?: number
  rangeEnd?: number
}

export type GetVideoStreamResult = {
  streamUrl: string
  contentLength: number
  contentRange?: string
}

export abstract class VideoStreamProvider {
  abstract getStreamUrl(params: GetVideoStreamParams): Promise<GetVideoStreamResult>
}
