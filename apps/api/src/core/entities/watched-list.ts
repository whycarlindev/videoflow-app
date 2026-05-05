export abstract class WatchedList<T> {
  public currentItems: T[]
  private newItems: T[]
  private removedItems: T[]

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems ? [...initialItems] : []
    this.newItems = []
    this.removedItems = []
  }

  abstract compareItems(a: T, b: T): boolean

  public getItems(): T[] {
    return this.currentItems
  }

  public getNewItems(): T[] {
    return this.newItems
  }

  public getRemovedItems(): T[] {
    return this.removedItems
  }

  private isCurrentItem(item: T): boolean {
    return this.currentItems.some((c) => this.compareItems(item, c))
  }

  private isNewItem(item: T): boolean {
    return this.newItems.some((n) => this.compareItems(item, n))
  }

  private isRemovedItem(item: T): boolean {
    return this.removedItems.some((r) => this.compareItems(item, r))
  }

  private removeFromNew(item: T): void {
    this.newItems = this.newItems.filter((n) => !this.compareItems(item, n))
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter((c) => !this.compareItems(item, c))
  }

  private removeFromRemoved(item: T): void {
    this.removedItems = this.removedItems.filter((r) => !this.compareItems(item, r))
  }

  public add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item)
    }
    if (!this.isNewItem(item) && !this.isCurrentItem(item)) {
      this.newItems.push(item)
    }
    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item)
    }
  }

  public remove(item: T): void {
    this.removeFromCurrent(item)
    if (this.isNewItem(item)) {
      this.removeFromNew(item)
      return
    }
    if (!this.isRemovedItem(item)) {
      this.removedItems.push(item)
    }
  }

  public update(items: T[]): void {
    const removedItems = this.currentItems.filter(
      (c) => !items.some((i) => this.compareItems(i, c)),
    )
    const addedItems = items.filter((i) => !this.currentItems.some((c) => this.compareItems(i, c)))
    this.currentItems = items
    addedItems.forEach((i) => {
      if (!this.isNewItem(i)) this.newItems.push(i)
    })
    removedItems.forEach((r) => {
      if (this.isNewItem(r)) this.removeFromNew(r)
      else if (!this.isRemovedItem(r)) this.removedItems.push(r)
    })
  }
}
