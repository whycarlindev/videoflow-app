export enum VideoStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PUBLISHED = 'published',
  DELETED = 'deleted',
}

import { ValueObject } from '@/core/entities/value-object'

interface VideoStatusProps {
  value: VideoStatusEnum
}

export class VideoStatus extends ValueObject<VideoStatusProps> {
  get value(): VideoStatusEnum {
    return this.props.value
  }

  private constructor(props: VideoStatusProps) {
    super(props)
  }

  static create(value: VideoStatusEnum): VideoStatus {
    return new VideoStatus({ value })
  }

  static pending(): VideoStatus {
    return new VideoStatus({ value: VideoStatusEnum.PENDING })
  }

  static processing(): VideoStatus {
    return new VideoStatus({ value: VideoStatusEnum.PROCESSING })
  }

  static published(): VideoStatus {
    return new VideoStatus({ value: VideoStatusEnum.PUBLISHED })
  }

  static deleted(): VideoStatus {
    return new VideoStatus({ value: VideoStatusEnum.DELETED })
  }

  isPending(): boolean {
    return this.props.value === VideoStatusEnum.PENDING
  }
  isProcessing(): boolean {
    return this.props.value === VideoStatusEnum.PROCESSING
  }
  isPublished(): boolean {
    return this.props.value === VideoStatusEnum.PUBLISHED
  }
  isDeleted(): boolean {
    return this.props.value === VideoStatusEnum.DELETED
  }

  toString(): string {
    return this.props.value
  }
}
