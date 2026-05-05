import { uuidv7 } from 'uuidv7'

export class UniqueEntityId {
  private readonly _value: string

  constructor(value?: string) {
    this._value = value ?? uuidv7()
  }

  toString() {
    return this._value
  }
  toValue() {
    return this._value
  }

  equals(id: UniqueEntityId) {
    return id._value === this._value
  }
}
