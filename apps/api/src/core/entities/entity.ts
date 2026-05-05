import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityId
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  get id(): UniqueEntityId {
    return this._id
  }

  equals(entity: Entity<unknown>): boolean {
    if (entity === this) return true
    if (!(entity instanceof Entity)) return false
    return entity._id.equals(this._id)
  }
}
