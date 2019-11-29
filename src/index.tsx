import Editor from './components/Editor';
import Graph from './components/Graph';
import Flow from './components/Flow';
import Command from './components/Command';
import ItemPanel, { Item } from './components/ItemPanel';
import { NodePanel, EdgePanel, MultiPanel, CanvasPanel } from './components/DetailPanel';
import {
  RegisterNode,
  RegisterEdge,
  RegisterCommand,
  RegisterBehavior,
} from './components/Register';
import { withEditorContext } from './components/EditorContext';

export {
  Graph,
  Flow,
  Command,
  Item,
  ItemPanel,
  NodePanel,
  EdgePanel,
  MultiPanel,
  CanvasPanel,
  RegisterNode,
  RegisterEdge,
  RegisterCommand,
  RegisterBehavior,
  withEditorContext,
};

export default Editor;
