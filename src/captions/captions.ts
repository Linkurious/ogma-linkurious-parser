'use strict';

import {
  GraphSchemaTypeWithAccess,
  ICaptionConfig,
  ItemFieldsCaptions,
  LkEdgeData,
  LkNodeData,
  LkProperty,
  PropertyType,
  PropertyTypeName,
  GraphSchemaPropertyWithAccess
} from '@linkurious/rest-client';

import {CAPTION_HEURISTIC, Tools} from '../tools/tools';

export class Captions {
  /**
   * Return label for each node
   */
  public static getText(
    itemData: LkNodeData | LkEdgeData,
    schema: ItemFieldsCaptions,
    graphSchema?: GraphSchemaTypeWithAccess[]
  ): string | null {
    const types = 'categories' in itemData ? itemData.categories : [itemData.type];
    if (Captions.captionExist(types, schema)) {
      return 'categories' in itemData
        ? Captions.generateNodeCaption(itemData, schema, graphSchema) || null
        : Captions.generateEdgeCaption(itemData, schema, graphSchema) || null;
    }
    if (itemData.properties !== undefined) {
      const heuristicCaptionElement = CAPTION_HEURISTIC.find((value) => {
        return itemData.properties[value] !== undefined;
      });
      if (
        heuristicCaptionElement !== undefined &&
        Tools.isDefined(itemData.properties[heuristicCaptionElement])
      ) {
        return `${Tools.getValueFromLkProperty(
          itemData.properties[heuristicCaptionElement]
        )}`.trim();
      }
    }
    return null;
  }

  /**
   * Return a readable string from an LkProperty
   */
  private static getLabel(
    propertyValue: LkProperty,
    propertyType?: PropertyType | undefined
  ): string | null {
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
    } else if (
      propertyType?.name === PropertyTypeName.NUMBER &&
      propertyType.options !== undefined
    ) {
      return Tools.formatCurrencyValue(propertyValue as number, propertyType.options);
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
    schema: {[key: string]: ICaptionConfig},
    graphSchema?: GraphSchemaTypeWithAccess[]
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
        const propertyType = graphSchema
          ? Captions.getPropertyType(graphSchema, propertyKey, categories[0])
          : undefined;
        caption.push(this.getLabel(itemData.properties[propertyKey], propertyType));
      }
    });
    return caption
      .filter((c) => c !== null)
      .join(' - ')
      .trim();
  }

  public static getPropertyType(
    graphSchema: GraphSchemaTypeWithAccess[],
    propertyKey: string,
    itemType: string
  ): PropertyType | undefined {
    const typeGraphSchema = graphSchema.find((schemaType) => schemaType.itemType === itemType);
    const property = typeGraphSchema?.properties.find(
      (property) => property.propertyKey === propertyKey
    );
    return ((property as unknown) as GraphSchemaPropertyWithAccess)?.propertyType;
  }

  /**
   * Generate text from edge data and captions schema
   */
  public static generateEdgeCaption(
    itemData: LkEdgeData,
    schema: {[key: string]: ICaptionConfig},
    graphSchema?: GraphSchemaTypeWithAccess[]
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
          const propertyType = graphSchema
            ? Captions.getPropertyType(graphSchema, propertyKey, type)
            : undefined;
          caption.push(Captions.getLabel(itemData.properties[propertyKey], propertyType));
        }
      });
      return caption.join(' - ').trim();
    }
    return '';
  }
}
