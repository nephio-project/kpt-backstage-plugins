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

import { KubernetesKeyValueObject } from './KubernetesResource';
import { PodTemplateSpec } from './Pod';
import { LabelSelector } from './Selectors';

export type Deployment = {
  apiVersion: string;
  kind: string;
  metadata: DeploymentMetadata;
  spec: DeploymentSpec;
};

export type DeploymentMetadata = {
  name: string;
  namespace?: string;
  labels?: KubernetesKeyValueObject;
  annotations?: KubernetesKeyValueObject;
};

export type DeploymentSpec = {
  replicas?: number;
  selector: LabelSelector;
  template: PodTemplateSpec;
  strategy?: DeploymentStrategy;
  minReadySeconds?: number;
  progressDeadlineSeconds?: number;
  revisionHistoryLimit?: number;
};

export type DeploymentStrategy = {
  type?: string;
  rollingUpdate?: RollingUpdateDeployment;
};

export type RollingUpdateDeployment = {
  maxUnavailable?: number | string;
  maxSurge?: number | string;
};
