/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */

'use strict';
import {
  CaptionConfig,
  ItemFieldsCaptions,
  LkEdgeData,
  LkNodeData,
  LkProperty
} from '@linkurious/rest-client';

import {CAPTION_HEURISTIC, Tools} from '..';

export class Captions {
  /**
   * Return label for each node
   */
  public static getText(
    itemData: LkNodeData | LkEdgeData,
    schema: ItemFieldsCaptions
  ): string | null {
    const types = 'categories' in itemData ? itemData.categories : [itemData.type];
    if (Captions.captionExist(types, schema)) {
      return 'categories' in itemData
        ? Captions.generateNodeCaption(itemData, schema) || null
        : Captions.generateEdgeCaption(itemData, schema) || null;
    }
    if (itemData.properties !== undefined) {
      const heuristicCaption = Object.keys(itemData.properties).find((k) =>
        CAPTION_HEURISTIC.includes(k)
      );
      if (
        heuristicCaption !== undefined &&
        Tools.isDefined(itemData.properties[heuristicCaption])
      ) {
        return `${Tools.getValueFromLkProperty(itemData.properties[heuristicCaption])}`.trim();
      }
    }
    return null;
  }

  /**
   * Return a readable string from an LkProperty
   */
  private static getLabel(propertyValue: LkProperty): string | null {
    if (typeof propertyValue === 'object' && 'type' in propertyValue) {
      if (!('original' in propertyValue) && !('value' in propertyValue)) {
        return null;
      }
      if ('original' in propertyValue) {
        return `${propertyValue.original}`;
      }
      if ('value' in propertyValue) {
        return Tools.formatDate(
          new Date(
            new Date(propertyValue.value).getTime() +
              Tools.timezoneToMilliseconds(propertyValue.timezone)
          ).toISOString()
        );
      }
    }
    return `${propertyValue}`.trim();
  }

  /**
   * Return true if caption configuration exists in schema
   */
  public static captionExist(itemTypes: Array<string>, schema: ItemFieldsCaptions): boolean {
    return itemTypes.some((type) => Tools.isDefined(schema[type]));
  }

  /**
   * Generate text from node data and captions schema
   */
  public static generateNodeCaption(
    itemData: LkNodeData,
    schema: {[key: string]: CaptionConfig}
  ): string {
    const categories = itemData.categories;
    const caption: Array<string | null> = [];
    let captionProps: Array<string | null> = [];
    categories.forEach((category) => {
      if (schema[category] && schema[category].active) {
        if (schema[category].displayName) {
          caption.push(category);
        }
        captionProps = [...captionProps, ...schema[category].properties];
      }
    });
    Tools.uniqBy(captionProps).forEach((propertyKey) => {
      if (itemData.properties[propertyKey] !== undefined) {
        caption.push(this.getLabel(itemData.properties[propertyKey]));
      }
    });
    return caption
      .filter((c) => c !== null)
      .join(' - ')
      .trim();
  }

  /**
   * Generate text from edge data and captions schema
   */
  public static generateEdgeCaption(
    itemData: LkEdgeData,
    schema: {[key: string]: CaptionConfig}
  ): string {
    const type = itemData.type;
    const caption: Array<string | null> = [];
    let captionProps: Array<string | null> = [];
    if (schema[type] && schema[type].active) {
      if (schema[type].displayName) {
        caption.push(type);
      }
      captionProps = [...captionProps, ...schema[type].properties];
      Tools.uniqBy(captionProps).forEach((propertyKey) => {
        if (Tools.isDefined(itemData.properties[propertyKey])) {
          caption.push(Captions.getLabel(itemData.properties[propertyKey]));
        }
      });
      return caption.join(' - ').trim();
    }
    return '';
  }
}
