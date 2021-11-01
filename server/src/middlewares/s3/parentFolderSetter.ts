class ParentFolderSetter {
  private parent_id: number

  constructor(parent_id: number) {
    this.parent_id = parent_id
  }

  public setParentId(parent_id: number) {
    this.parent_id = parent_id
  }

  public getParentId() {
    return this.parent_id
  }
}

export default ParentFolderSetter
