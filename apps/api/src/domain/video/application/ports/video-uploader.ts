export type UploadVideoParams = {
  fileName: string
  fileType: string
  body: Buffer
}

export type UploadVideoResult = {
  url: string
}

export abstract class VideoUploader {
  abstract upload(params: UploadVideoParams): Promise<UploadVideoResult>
}
