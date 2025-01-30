/**
 * Copyright 2022 Google LLC
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

import React from 'react';
import { KubernetesResource } from '../../types/KubernetesResource';
import { getGroupVersionKind } from '../../utils/kubernetesResource';
import { PackageResource } from '../../utils/packageRevisionResources';
import { loadYaml } from '../../utils/yaml';
import { LegacyResourceEditorDialog } from './LegacyResourceEditorDialog';
import { ModernResourceEditorDialog } from './ModernResourceEditorDialog';

type OnSaveYamlFn = (yaml: string) => void;

export type ResourceEditorDialogProps = {
  open: boolean;
  onClose: () => void;
  yaml: string;
  onSaveYaml: OnSaveYamlFn;
  packageResources: PackageResource[];
};

const MODERN_EDITOR_RESOURCES = [
  'infra.nephio.org/v1alpha1/Token',
  'infra.nephio.org/v1alpha1/Network',
  'infra.nephio.org/v1alpha1/WorkloadCluster',
  'req.nephio.org/v1alpha1/Capacity',
];

export const ResourceEditorDialog: React.FC<ResourceEditorDialogProps> = props => {
  const resourceYaml = loadYaml(props.yaml) as KubernetesResource;
  const groupVersionKind = resourceYaml && getGroupVersionKind(resourceYaml);

  return MODERN_EDITOR_RESOURCES.includes(groupVersionKind) ? (
    <ModernResourceEditorDialog {...props} />
  ) : (
    <LegacyResourceEditorDialog {...props} />
  );
};
