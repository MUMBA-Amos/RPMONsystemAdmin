export interface INode {
  _id: string;
  children?: any;
  [x: string]: string | INode[];
}

export class NodeService {
  public static mapParentAndChildren = (nodes: INode[]): INode[] => {
    const mappedNodes: INode[] = [];

    // Map the parent nodes
    nodes.forEach((node) => {
      if (!node.parentId) {
        mappedNodes.push(node);
      }
    });

    // Map the children nodes
    nodes.forEach((node: INode) => {
      if (node.parentId) {
        const parent = mappedNodes.find(
          (mappedNode) => mappedNode._id === node.parentId
        );
        if (parent) {
          parent.children = parent.children || [];

          if (!parent?.children?.find((c1: any) => c1._id == node._id))
            parent.children.push({ ...node });
        }
      }
    });

    return mappedNodes;
  };
}
