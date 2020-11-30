import {
  EntityType,
  IOgmaConfig,
  LkEdgeData,
  LkNodeData,
  VizEdge,
  VizNode
} from '@linkurious/rest-client';

import {Tools} from '..';

import {StylesViz} from './features/styles';
import {CaptionsViz} from './features/captions';
import {EdgeList, NodeList} from './models';
import {Ogma} from './ogma';

export const ANIMATION_DURATION = 750;

export class LKOgma extends Ogma<LkNodeData, LkEdgeData> {
  public LKStyles!: StylesViz;
  public LKCaptions!: CaptionsViz;

  constructor(_configuration: IOgmaConfig) {
    // set Ogma global configuration
    super(_configuration);
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

    // TODO: need to override  in LKE
    this.initSelection();

    // init ogma styles object
    this.initStyles(_configuration);

    // init visualization captions
    this.initCaptions(_configuration);

  }

  /**
   * Initialize selection behavior
   */
  public initSelection(): void {
    this.events.onClick((e) => {
      if (e.button === 'left') {
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
        }
      }
    });
  }

  private initStyles(_configuration: IOgmaConfig): void {
    this.LKStyles = new StylesViz(this);
    const nodeStyles = _configuration?.options?.styles?.node;
    this.LKStyles.setNodesDefaultStyles(nodeStyles);
    const edgeStyles = _configuration?.options?.styles?.edge;
    this.LKStyles.setEdgesDefaultStyles(edgeStyles);
  }

  private initCaptions(_configuration: IOgmaConfig): void {
    const nodeMaxTextLength = _configuration?.options?.styles?.node?.text?.maxTextLength;
    const edgeMaxTextLength = _configuration?.options?.styles?.edge?.text?.maxTextLength;
    this.LKCaptions = new CaptionsViz(this, nodeMaxTextLength, edgeMaxTextLength);
  }

  /**
   * Initialize graph.
   * add nodes and edges to the viz and init the selection.
   */
  public async init(visualization: { nodes: Array<VizNode>; edges: Array<VizEdge> }): Promise<void> {
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
          selectedEntityType = EntityType.EDGE;
          selectedElements = [];
          selectedElements.push(edge.id);
        }
        delete edge.attributes.selected;
      }
      return edge;
    });
    await this.setGraph({
      nodes: fixedNodes,
      edges: fixedEdges
    });
    if (selectedEntityType === EntityType.NODE) {
      this.getNodes(selectedElements).setSelected(true);
    } else if (selectedEntityType === EntityType.EDGE) {
      this.getEdges(selectedElements).setSelected(true);
    }
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

}
