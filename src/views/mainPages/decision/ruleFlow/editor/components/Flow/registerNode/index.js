import customNode from './customNode';
import customPolygon from './customPolygon';
import testNode from './testNode';

export default function registerNode() {
  customNode()
  customPolygon()
  testNode();
};
