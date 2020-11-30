/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-22.
 */
'use strict';

import {Captions} from './captions/captions';
import {ItemAttributes, BASE_GREY} from './styles/itemAttributes';
import {EdgeAttributes} from './styles/edgeAttributes';
import {NodeAttributes} from './styles/nodeAttributes';
import {StyleRule} from './styles/styleRule';
import {StyleRules, StyleType, Legend} from './styles/styleRules';
import {
  Tools,
  NO_CATEGORIES,
  CAPTION_HEURISTIC,
  UNAVAILABLE_KEY,
  UNAVAILABLE_VALUE,
  UNACCEPTABLE_URL,
  UNGUARDED_PAGES,
  BUILTIN_GROUP_INDEX_MAP,
  DEFAULT_DEBOUNCE_TIME
} from './tools/tools';
import {StylesViz, StylesConfig, FILTER_OPACITY} from './ogma/features/styles';
import {CaptionsViz, CaptionState} from './ogma/features/captions';
import {
  getSelectionSize,
  getSelectionState,
  getSelectionEntity,
  getUniqSelection,
  getUniqSelectionTypes,
  getUniqSelectionEntity,
  getSelectionProperties,
  hasSelectionProperties
} from './ogma/features/selectors';
import {LKOgma, ANIMATION_DURATION} from './ogma';

export * from './ogma/models';
export {
  Captions,
  EdgeAttributes,
  NodeAttributes,
  StyleRule,
  StyleRules,
  Tools,
  LKOgma,
  ANIMATION_DURATION,
  StylesViz,
  StylesConfig,
  FILTER_OPACITY,
  CaptionsViz,
  CaptionState,
  getSelectionSize,
  getSelectionState,
  getSelectionEntity,
  getUniqSelection,
  getUniqSelectionTypes,
  getUniqSelectionEntity,
  getSelectionProperties,
  hasSelectionProperties,
  BASE_GREY,
  NO_CATEGORIES,
  CAPTION_HEURISTIC,
  UNAVAILABLE_KEY,
  UNAVAILABLE_VALUE,
  UNACCEPTABLE_URL,
  UNGUARDED_PAGES,
  BUILTIN_GROUP_INDEX_MAP,
  DEFAULT_DEBOUNCE_TIME,
  StyleType,
  ItemAttributes,
  Legend,
};
