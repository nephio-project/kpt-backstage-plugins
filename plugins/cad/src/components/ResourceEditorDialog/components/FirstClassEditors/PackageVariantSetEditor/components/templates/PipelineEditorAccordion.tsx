/**
 * Copyright 2023 The Nephio Authors.
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

import { useApi } from '@backstage/core-plugin-api';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Function } from '../../../../../../../types/Function';
import { configAsDataApiRef } from '../../../../../../../apis';
import { KptfileFunction, KptfilePipeline } from '../../../../../../../types/Kptfile';
import { isMutatorFunction, isValidatorFunction } from '../../../../../../../utils/function';
import { PackageResource } from '../../../../../../../utils/packageRevisionResources';
import { EditorAccordion } from '../../../Controls';
import { AccordionState } from '../../../Controls/EditorAccordion';
import { KptFunctionEditorAccordion } from '../../../KptfileEditor/components/KptFunctionEditorAccordion';
import { useEditorStyles } from '../../../styles';
import { Deletable, getActiveElements, isActiveElement, undefinedIfEmpty, updateList } from '../../../util/deletable';

type KptfileEditorProps = {
  onUpdatedYaml: OnUpdatedYamlFn;
  pipeLinestate: AccordionState;
  keyValueObject: KptfilePipeline;
  packageResources: PackageResource[];
};

type State = {
  mutators: Deletable<KptfileFunction>[];
  validators: Deletable<KptfileFunction>[];
};

type OnUpdatedYamlFn = (yaml: State) => void;

export const PipelineEditorAccordion = ({
  onUpdatedYaml,
  pipeLinestate,
  keyValueObject,
  packageResources,
}: KptfileEditorProps) => {
  const api = useApi(configAsDataApiRef);
  const createResourceState = (): State => ({
    mutators: keyValueObject.mutators ?? [],
    validators: keyValueObject.validators ?? [],
  });

  const [state, setState] = useState<State>(createResourceState());
  const [allKptFunctions, setAllKptFunctions] = useState<Function[]>([]);

  const allKptMutatorFunctions = useMemo(() => allKptFunctions.filter(isMutatorFunction), [allKptFunctions]);
  const allKptValidatorFunctions = useMemo(() => allKptFunctions.filter(isValidatorFunction), [allKptFunctions]);

  const [expanded, setExpanded] = useState<string>();
  const classes = useEditorStyles();
  useAsync(async (): Promise<void> => {
    const allFunctions = await api.listCatalogFunctions();
    setAllKptFunctions(allFunctions);
  }, []);

  useEffect(() => {
    keyValueObject.mutators = undefinedIfEmpty(getActiveElements(state.mutators));
    keyValueObject.validators = undefinedIfEmpty(getActiveElements(state.validators));
  }, [state, keyValueObject]);
  const dataUpdate = (): void => {
    onUpdatedYaml(state);
  };
  return (
    <Fragment>
      <EditorAccordion
        id="mutators"
        state={pipeLinestate}
        title="Mutators"
        description={`${state.mutators.length} Mutators`}
      >
        <Fragment>
          {state.mutators.map(
            (mutator, index) =>
              isActiveElement(mutator) && (
                <KptFunctionEditorAccordion
                  id={`mutator-${index}`}
                  key={`mutator-${index}`}
                  title={`Mutator-${index}`}
                  state={[expanded, setExpanded]}
                  value={mutator}
                  allKptFunctions={allKptMutatorFunctions}
                  packageResources={packageResources}
                  onUpdate={updatedMutator => {
                    setState(s => ({
                      ...s,
                      mutators: updateList(s.mutators.slice(), updatedMutator, index),
                    }));
                    dataUpdate();
                  }}
                />
              ),
          )}

          <div className={classes.buttonRow}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setState(s => ({
                  ...s,
                  mutators: [...s.mutators, { image: '' }],
                }));
                setExpanded(`mutator-${state.mutators.length}`);
              }}
            >
              Add Mutator
            </Button>
          </div>
        </Fragment>
      </EditorAccordion>

      <EditorAccordion
        id="validators"
        state={pipeLinestate}
        title="Validators"
        description={`${state.validators.length} Validators`}
      >
        <Fragment>
          {state.validators.map(
            (validator, index) =>
              isActiveElement(validator) && (
                <KptFunctionEditorAccordion
                  id={`validator-${index}`}
                  key={`validator-${index}`}
                  title={`Validator-${index}`}
                  state={[expanded, setExpanded]}
                  value={validator}
                  allKptFunctions={allKptValidatorFunctions}
                  packageResources={packageResources}
                  onUpdate={updatedValidator => {
                    setState(s => ({
                      ...s,
                      validators: updateList(s.validators.slice(), updatedValidator, index),
                    }));
                    dataUpdate();
                  }}
                />
              ),
          )}

          <div className={classes.buttonRow}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setState(s => ({
                  ...s,
                  validators: [...s.validators, { image: '' }],
                }));
                setExpanded(`validator-${state.validators.length}`);
              }}
            >
              Add Validator
            </Button>
          </div>
        </Fragment>
      </EditorAccordion>
    </Fragment>
  );
};
