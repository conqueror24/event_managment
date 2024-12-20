class PriorityTree {
    constructor() {
      this.tree = { Root: [] };
    }
  
    addChild(parent, child) {
      if (!this.tree[parent]) this.tree[parent] = [];
      this.tree[parent].push(child);
    }
  
    remove(child) {
      for (const key in this.tree) {
        this.tree[key] = this.tree[key].filter((c) => c.id !== child.id);
      }
    }
  
    getChildren(parent) {
      return this.tree[parent] || [];
    }
  }
  
  module.exports = PriorityTree;
  