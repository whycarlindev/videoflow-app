import { ValueObject } from '@/core/entities/value-object'

interface SlugProps {
  value: string
}

export class Slug extends ValueObject<SlugProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: SlugProps) {
    super(props)
  }

  static create(slug: string): Slug {
    return new Slug({ value: slug })
  }

  static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '')

    return new Slug({ value: slugText })
  }
}
