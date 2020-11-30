'use strict';

import * as Ogma from 'ogma';
import {ItemFieldsCaptions} from '@linkurious/rest-client';

import {Captions, LKOgma, Tools} from '../..';

export interface CaptionState {
  node: ItemFieldsCaptions;
  edge: ItemFieldsCaptions;
}

export class CaptionsViz {
  public nodesCaptionsRule!: Ogma.StyleRule;
  public edgesCaptionsRule!: Ogma.StyleRule;
  private _ogma: LKOgma;
  private _schema: CaptionState = {node: {}, edge: {}};

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
              if (edge === undefined) {
                return ``;
              }
              const value = Captions.getText(edge.getData(), this._schema.edge);
              return Tools.isDefined(this._edgeMaxTextLength)
                ? Tools.truncate(value, 'middle', this._edgeMaxTextLength)
                : value;
            }
          }
        },
        edgeDependencies: {self: {data: true}}
      });
    } else {
      return this.edgesCaptionsRule.refresh();
    }
  }

}
