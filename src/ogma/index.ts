import {
  EntityType,
  ForceLayoutMode,
  HierarchicalLayoutMode,
  IOgmaConfig,
  LayoutAlgorithm,
  LkEdgeData,
  LkNodeData,
  PopulatedVisualization,
  VizEdge,
  VizNode
} from '@linkurious/rest-client';
import Ogma, {
  EdgeList,
  ForceLayoutOptions,
  HierarchicalLayoutOptions,
  NodeList,
  NonObjectPropertyWatcher,
  RadialLayoutOptions,
  RawEdge,
  RawGraph,
  RawNode
} from 'ogma';

import {StyleRules} from '..';
import {Tools} from '../tools/tools';

import {StylesViz} from './features/styles';
import {TransformationsViz} from './features/transformations';
import {CaptionsViz} from './features/captions';
import {RxViz} from './features/reactive';
import {OgmaStore} from './features/OgmaStore';

export {default as Ogma} from 'ogma';
export const ANIMATION_DURATION = 750;

export class LKOgma extends Ogma<LkNodeData, LkEdgeData> {
  private _reactive: RxViz;
  public LKStyles!: StylesViz;
  public LKCaptions!: CaptionsViz;
  public LKTransformation: TransformationsViz;
  // Trigger an event with node category changes
  public nodeCategoriesWatcher: NonObjectPropertyWatcher<LkNodeData, LkEdgeData>;
  // Trigger an event with edge type changes
  public edgeTypeWatcher: NonObjectPropertyWatcher<LkNodeData, LkEdgeData>;
  public store: OgmaStore;

  constructor(_configuration: IOgmaConfig) {
    // set Ogma global configuration
    super(_configuration);
    this.nodeCategoriesWatcher = this.schema.watchNodeNonObjectProperty({
      path: 'categories',
      unwindArrays: true,
      filter: 'all'
    });
    this.edgeTypeWatcher = this.schema.watchEdgeNonObjectProperty({
      path: 'type',
      filter: 'all'
    });
    Object.setPrototypeOf(this, new.target.prototype);
    // set ogma max zoom value  and selection with mouse option (false?)
    this.setOptions({
      interactions: {
        zoom: {
          maxValue: (params: any) => {
            return 128 / params.smallestNodeSize;
          }
        },
        selection: {
          enabled: false
        }
      }
    });

    this._reactive = new RxViz(this);
    this.store = this._reactive.store;
    this.initSelection();
    this.initStyles(_configuration);
    this.initCaptions(_configuration);
    this.LKTransformation = new TransformationsViz(this);

    this.LKStyles.setNodesDefaultHalo();
    this.LKStyles.setEdgesDefaultHalo();
    this.LKStyles.setBadgeRule();
    this.LKStyles.setFilterClass();
  }

  /**
   * Initialize selection behavior
   */
  public initSelection(): void {
    this.events.onClick((e) => {
      if (e !== undefined && e.button === 'left') {
        if (e.target !== null) {
          const multiSelectionKey = navigator.platform === 'MacIntel' ? 'cmd' : 'ctrl';
          if (this.keyboard.isKeyPressed(multiSelectionKey)) {
            if (e.target.isNode && this.getSelectedEdges().size > 0) {
              this.getSelectedEdges().setSelected(false);
            }
            if (!e.target.isNode && this.getSelectedNodes().size > 0) {
              this.getSelectedNodes().setSelected(false);
            }
            if (e.target.isSelected()) {
              e.target.setSelected(false);
            } else {
              e.target.setSelected(true);
            }
          } else {
            this.getSelectedNodes().setSelected(false);
            this.getSelectedEdges().setSelected(false);
            e.target.setSelected(true);
          }
        } else {
          this.getSelectedNodes().setSelected(false);
          this.getSelectedEdges().setSelected(false);
        }
      }
    });
  }

  private initStyles(_configuration: IOgmaConfig): void {
    this.LKStyles = new StylesViz(this, {
      node: _configuration?.options?.styles?.node || {},
      edge: _configuration?.options?.styles?.edge || {}
    });
    this.LKStyles.setNodesDefaultStyles();
    this.LKStyles.setEdgesDefaultStyles();
  }

  private initCaptions(_configuration: IOgmaConfig): void {
    const nodeMaxTextLength = _configuration?.options?.styles?.node?.text?.maxTextLength;
    const edgeMaxTextLength = _configuration?.options?.styles?.edge?.text?.maxTextLength;
    this.LKCaptions = new CaptionsViz(this, nodeMaxTextLength, edgeMaxTextLength);
  }

  /**
   * Returns Ogma Layout parameters according to visualization layout settings
   * */
  public getLayoutParams(
    algorithm: LayoutAlgorithm.FORCE,
    mode: ForceLayoutMode,
    rootNode: undefined
  ): ForceLayoutOptions;
  public getLayoutParams(
    algorithm: LayoutAlgorithm.RADIAL,
    mode: undefined,
    rootNode: string
  ): RadialLayoutOptions;
  public getLayoutParams(
    algorithm: LayoutAlgorithm.HIERARCHICAL,
    mode: HierarchicalLayoutMode,
    rootNode: string
  ): HierarchicalLayoutOptions;
  public getLayoutParams(
    algorithm: LayoutAlgorithm,
    mode?: ForceLayoutMode | HierarchicalLayoutMode,
    rootNode?: string
  ): ForceLayoutOptions | HierarchicalLayoutOptions | RadialLayoutOptions {
    switch (algorithm) {
      case LayoutAlgorithm.HIERARCHICAL:
        return {
          direction: mode as HierarchicalLayoutMode,
          roots: [rootNode!],
          duration: 0
        };
      case LayoutAlgorithm.RADIAL:
        return {
          centralNode: rootNode,
          radiusDelta: 1,
          nodeGap: 10,
          repulsion: this.getNodes().size > 80 ? 1 : 6,
          duration: 0
        };
      default:
        let dynamicSteps = 300 - ((300 - 40) / 5000) * this.getNodes().size;
        if (dynamicSteps < 40) {
          dynamicSteps = 40;
        }
        return {
          steps: mode === ForceLayoutMode.FAST ? dynamicSteps : 300,
          alignSiblings: this.getNodes().size > 3,
          duration: 0,
          charge: 20,
          gravity: 0.08,
          theta: this.getNodes().size > 100 ? 0.8 : 0.34
        };
    }
  }

  /**
   * Initialize graph.
   * add nodes and edges to the viz and init the selection.
   */
  public async init(visualization: {nodes: Array<VizNode>; edges: Array<VizEdge>}): Promise<void> {
    this.clearGraph();
    let selectedEntityType: EntityType | undefined = undefined;
    let selectedElements: Array<string> = [];
    // need to remove selected in every items before adding them to Ogma
    const fixedNodes = visualization.nodes.map((node) => {
      if (node.attributes.selected) {
        selectedEntityType = EntityType.NODE;
        selectedElements.push(node.id);
      }
      delete node.attributes.selected;
      return node;
    });
    const fixedEdges = visualization.edges.map((edge) => {
      if (edge.attributes !== undefined) {
        if (edge.attributes.selected) {
          if (selectedEntityType === undefined || selectedEntityType === EntityType.NODE) {
            selectedEntityType = EntityType.EDGE;
            selectedElements = [];
          }
          selectedElements.push(edge.id);
        }
        delete edge.attributes.selected;
      }
      return edge;
    });
    await this.setGraph({
      nodes: fixedNodes as Array<RawNode<LkNodeData>>,
      edges: fixedEdges as Array<RawEdge<LkEdgeData>>
    });
    if (selectedEntityType === EntityType.NODE) {
      this.getNodes(selectedElements).setSelected(true);
    } else if (selectedEntityType === EntityType.EDGE) {
      this.getEdges(selectedElements).setSelected(true);
    }
  }

  public async initVisualization(visualization: PopulatedVisualization) {
    this.init(visualization);
    const styles = StyleRules.sanitizeStylesIndex(visualization.design.styles);
    this.LKStyles.initNodeColors(styles.node);
    this.LKStyles.initNodesIcons(styles.node);
    this.LKStyles.initNodesSizes(styles.node);
    this.LKStyles.initNodesShapes(styles.node);
    this.LKStyles.initEdgesWidth(styles.edge);
    this.LKStyles.initEdgesShape(styles.edge);
    this.LKStyles.initEdgesColor(styles.edge);
    this.LKCaptions.initVizCaptions({
      node: visualization.nodeFields.captions || {},
      edge: visualization.edgeFields.captions || {}
    });
    this.LKTransformation.groupedEdges = visualization.edgeGrouping;
    this.LKTransformation.initTransformation();
    this.LKTransformation.initEdgeGroupingStyle();
  }

  /**
   * Adding nodes then adding edges to the graph
   */
  public async setGraph(
    graph: RawGraph<LkNodeData, LkEdgeData>
  ): Promise<{
    nodes: NodeList<LkNodeData>;
    edges: EdgeList<LkEdgeData>;
  }> {
    const addedNodes = await this.addNodes(graph.nodes);
    const addedEdges = await this.addEdges(graph.edges);
    return {
      nodes: addedNodes,
      edges: addedEdges
    };
  }

  /**
   * Adding edges to the graph after filtering disconnected ones
   */
  public async addEdges(edges: Array<RawEdge<LkEdgeData>>): Promise<EdgeList> {
    const filteredEdges = edges.filter((edge) => {
      return this.getNode(edge.source) !== undefined && this.getNode(edge.target) !== undefined;
    });
    return super.addEdges(filteredEdges);
  }

  /**
   * Return the list of non filtered nodes
   */
  public getNonFilteredNodes(items?: Array<any>): NodeList<LkNodeData, LkEdgeData> {
    return Tools.isDefined(items)
      ? this.getNodes(items).filter((i) => !i.hasClass('filtered'))
      : this.getNodes().filter((i) => !i.hasClass('filtered'));
  }

  /**
   * Return the list of filtered nodes
   */
  public getFilteredNodes(items?: Array<any>): NodeList<LkNodeData, LkEdgeData> {
    return Tools.isDefined(items)
      ? this.getNodes(items).filter((i) => i.hasClass('filtered'))
      : this.getNodes().filter((i) => i.hasClass('filtered'));
  }

  /**
   * Return the list of non filtered edges
   */
  public getNonFilteredEdges(items?: Array<any>): EdgeList<LkEdgeData, LkNodeData> {
    return Tools.isDefined(items)
      ? this.getEdges(items).filter((i) => !i.hasClass('filtered'))
      : this.getEdges().filter((i) => !i.hasClass('filtered'));
  }

  /**
   * Return the list of filtered edges
   */
  public getFilteredEdges(items?: Array<any>): EdgeList<LkEdgeData, LkNodeData> {
    return Tools.isDefined(items)
      ? this.getEdges(items).filter((i) => i.hasClass('filtered'))
      : this.getEdges().filter((i) => i.hasClass('filtered'));
  }

  /**
   * Do a full reset on ogma and streams of ogma
   */
  public shutDown() {
    this.destroy();
    if (this.store) {
      this.store.clear();
    }
  }
}
