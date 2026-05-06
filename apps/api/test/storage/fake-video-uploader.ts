import {
  UploadVideoParams,
  UploadVideoResult,
  VideoUploader,
} from '@/domain/video/application/ports/video-uploader'

export class FakeVideoUploader implements VideoUploader {
  public uploads: UploadVideoParams[] = []

  async upload(params: UploadVideoParams): Promise<UploadVideoResult> {
    this.uploads.push(params)
    return { url: `https://storage.fake/${params.fileName}` }
  }
}
