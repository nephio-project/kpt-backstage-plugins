/**
 * Copyright 2024 The Nephio Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isEqual } from 'lodash';
import React, { useContext, useMemo } from 'react';
import { PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { PxeResourceContext } from '../../PxeResourceContext';
import { PxeSectionEntry, PxeWidgetEntry } from '../../types/PxeConfiguration.types';
import { findAllInConfigurationEntries } from '../findInConfigurationEntries';
import { isWidgetNode } from '../nodePredicates';
import { generateDescriptionForEntries } from '../generateLabelsForWidgets';

export const withSectionDescription = (
  Component: React.FC<PxeParametricEditorNodeProps & { readonly sectionDescription: string }>,
) => {
  const MemoizedComponent = React.memo(Component, isEqual);
  return (props: PxeParametricEditorNodeProps) => {
    const { entries } = props.configurationEntry as PxeSectionEntry;
    const resource = useContext(PxeResourceContext);

    const entriesForDescription = useMemo(
      () => findAllInConfigurationEntries(entries, entry => isWidgetNode(entry), { searchInSections: false }),
      [entries],
    ) as PxeWidgetEntry[];
    const sectionDescription = generateDescriptionForEntries(entriesForDescription, resource);

    return <MemoizedComponent {...props} sectionDescription={sectionDescription} />;
  };
};
