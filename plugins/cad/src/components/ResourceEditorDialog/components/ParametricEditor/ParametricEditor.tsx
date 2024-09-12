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

import { pick, set } from 'lodash';
import React, { useState } from 'react';
import { useSetStateAndCall } from '../../../../hooks/useSetStateAndCall';
import { useEditorStyles } from '../FirstClassEditors/styles';
import {
  ParametricEditorConfiguration,
  ParametricEditorExpansionState,
  PxeResourceChangeRequestHandler,
} from './ParametricEditor.types';
import { parseYaml } from './yamlConversion/parseYaml';
import { ParametricEditorNode } from './ParametricEditorNode';
import { dumpYaml } from '../../../../utils/yaml';

export type ParametricEditorProps = {
  readonly configuration: ParametricEditorConfiguration;
  readonly yamlText: string;
  readonly onResourceChange: (yaml: string) => void;
};

export const ParametricEditor: React.FC<ParametricEditorProps> = ({
  configuration: { topLevelProperties, entries },
  yamlText,
  onResourceChange,
}) => {
  const { yamlObject: initialYamlObject } = parseYaml(yamlText);
  const initialResourceState = pick(initialYamlObject, topLevelProperties);

  const [resourceState, setResourceState] = useState(initialResourceState);
  const [expansionState, setExpansionState] =
    useState<ParametricEditorExpansionState>(undefined);

  const setStateAndCall = useSetStateAndCall(
    [resourceState, setResourceState],
    newState => {
      // FIXME Do not use dumpYaml.
      onResourceChange(dumpYaml({ ...initialYamlObject, ...newState }));
    },
  );

  // TODO useCallback?
  // TODO Rethink this solution. Works, but is it safe?
  const onResourceChangeRequest: PxeResourceChangeRequestHandler = (
    path,
    newValue,
  ): void => setStateAndCall(currentState => set(currentState, path, newValue));

  const classes = useEditorStyles();
  return (
    <div className={classes.root}>
      {entries.map((entry, index) => (
        <ParametricEditorNode
          key={index}
          configurationEntry={entry}
          resourceChunk={resourceState}
          expansionStateTuple={[expansionState, setExpansionState]}
          onResourceChangeRequest={onResourceChangeRequest}
        />
      ))}
    </div>
  );
};
