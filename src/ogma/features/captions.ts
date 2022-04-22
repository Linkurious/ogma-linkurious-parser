'use strict';

import * as Ogma from '@linkurious/ogma';
import {Node, Edge} from '@linkurious/ogma';
import {ItemFieldsCaptions} from '@linkurious/rest-client';

import {Captions, LKOgma} from '../..';
import {Tools} from '../../tools/tools';

export interface CaptionState {
  node: ItemFieldsCaptions;
  edge: ItemFieldsCaptions;
}

export class CaptionsViz {
  public nodesCaptionsRule!: Ogma.StyleRule;
  public edgesCaptionsRule!: Ogma.StyleRule;
  private _ogma: LKOgma;
  private _schema: CaptionState = {node: {}, edge: {}};
  private _exportCaptionClass!: Ogma.StyleClass;

  constructor(
    ogma: LKOgma,
    private _nodeMaxTextLength: number | undefined,
    private _edgeMaxTextLength: number | undefined
  ) {
    this._ogma = ogma;
  }

  /**
   * Refresh the schema
   */
  public refreshSchema(schema: CaptionState): void {
    this._schema = schema;
  }

  /**
   * Refresh visualization captions rules
   */
  public async initVizCaptions(schema: CaptionState): Promise<void> {
    if (this._ogma.LKCaptions.nodesCaptionsRule) {
      this._ogma.LKCaptions.refreshSchema(schema);
      await this._ogma.LKCaptions.updateNodeCaptions();
    } else {
      this._ogma.LKCaptions.updateNodeCaptions(schema.node);
    }
    if (this._ogma.LKCaptions.edgesCaptionsRule) {
      this._ogma.LKCaptions.refreshSchema(schema);
      await this._ogma.LKCaptions.updateEdgeCaptions();
    } else {
      this._ogma.LKCaptions.updateEdgeCaptions(schema.edge);
    }
  }

  /**
   * Create or update nodeCaptionRule
   */
  public updateNodeCaptions(schema?: ItemFieldsCaptions): Promise<void> | void {
    if (schema) {
      this._schema.node = schema;
    }
    if (!Tools.isDefined(this.nodesCaptionsRule)) {
      this.nodesCaptionsRule = this._ogma.styles.addRule({
        nodeAttributes: {
          text: {
            content: (node: Ogma.Node | undefined) => {
              if (node === undefined) {
                return ``;
              }
              const value = Captions.getText(node.getData(), this._schema.node);
              return Tools.isDefined(this._nodeMaxTextLength)
                ? Tools.truncate(value, 'middle', this._nodeMaxTextLength)
                : value;
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      return this.nodesCaptionsRule.refresh();
    }
  }

  /**
   * Create or update edgeCaptionRule
   */
  public updateEdgeCaptions(schema?: ItemFieldsCaptions): Promise<void> | void {
    if (schema) {
      this._schema.edge = schema;
    }
    if (!Tools.isDefined(this.edgesCaptionsRule)) {
      this.edgesCaptionsRule = this._ogma.styles.addRule({
        edgeAttributes: {
          text: {
            content: (edge: Ogma.Edge | undefined) => {
              if (edge === undefined || edge.getData() === undefined) {
                return ``;
              }
              const value = Captions.getText(edge.getData(), this._schema.edge);
              return Tools.isDefined(this._edgeMaxTextLength)
                ? Tools.truncate(value, 'middle', this._edgeMaxTextLength)
                : value;
            }
          }
        },
        edgeSelector: (edge) => !edge.isVirtual() && edge.isVisible(),
        // ogma will trigger the rendering if data change or the shape change (to trigger the rendering when edges are grouped)
        edgeDependencies: {self: {data: true, attributes: ['shape.style']}}
      });
    } else {
      return this.edgesCaptionsRule.refresh();
    }
  }

  /**
   * Set the class for exported nodes and edges
   */
  public setExportCaptionClass(textWrappingLength?: boolean): void {
    if (!this._exportCaptionClass) {
      this._exportCaptionClass = this._ogma.styles.createClass({
        name: 'exportedCaption',
        nodeAttributes: {
          text: {
            content: (node: Node | undefined) => {
              if (node === undefined) {
                return ``;
              }
              return Captions.getText(node.getData(), this._schema.node);
            }
          }
        },
        nodeDependencies: {self: {data: true}},
        edgeAttributes: {
          text: {
            content: (edge: Edge | undefined) => {
              if (edge === undefined) {
                return ``;
              }
              return Captions.getText(edge.getData(), this._schema.edge);
            }
          }
        },
        edgeDependencies: {self: {data: true}}
      });
    }
  }
}
