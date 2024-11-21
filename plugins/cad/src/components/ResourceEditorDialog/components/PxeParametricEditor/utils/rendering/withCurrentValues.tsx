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

import { get, isEqual } from 'lodash';
import React, { useContext } from 'react';
import { PxeValue } from '../../types/PxeParametricEditor.types';
import { PxeParametricEditorNodeProps } from '../../PxeParametricEditorNode';
import { PxeResourceContext } from '../../PxeResourceContext';
import { PxeWidgetEntry } from '../../types/PxeConfiguration.types';

export const withCurrentValues = (
  Component: React.FC<PxeParametricEditorNodeProps & { readonly currentValues: PxeValue[] }>,
) => {
  const MemoizedComponent = React.memo(Component, isEqual);
  return (props: PxeParametricEditorNodeProps) => {
    const { valueDescriptors } = props.configurationEntry as PxeWidgetEntry;
    const resource = useContext(PxeResourceContext);

    const currentValues = valueDescriptors.map(({ path }) => get(resource, path));
    return <MemoizedComponent {...props} currentValues={currentValues} />;
  };
};
