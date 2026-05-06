import {
  GetVideoStreamParams,
  GetVideoStreamResult,
  VideoStreamProvider,
} from '@/domain/video/application/ports/video-stream-provider'

export class FakeVideoStreamProvider implements VideoStreamProvider {
  async getStreamUrl(params: GetVideoStreamParams): Promise<GetVideoStreamResult> {
    return {
      streamUrl: `https://stream.fake/${params.videoKey}`,
      contentLength: 0,
      contentRange: params.rangeStart !== undefined
        ? `bytes ${params.rangeStart}-${params.rangeEnd ?? '*'}/*`
        : undefined,
    }
  }
}
