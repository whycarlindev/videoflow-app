import { ValueObject } from '@/core/entities/value-object'

interface DurationProps {
  seconds: number
}

export class Duration extends ValueObject<DurationProps> {
  get seconds(): number {
    return this.props.seconds
  }

  private constructor(props: DurationProps) {
    super(props)
  }

  static create(seconds: number): Duration {
    if (seconds < 0) {
      throw new Error('Duration cannot be negative')
    }
    return new Duration({ seconds })
  }

  format(): string {
    const h = Math.floor(this.props.seconds / 3600)
    const m = Math.floor((this.props.seconds % 3600) / 60)
    const s = this.props.seconds % 60
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${m}:${String(s).padStart(2, '0')}`
  }
}
