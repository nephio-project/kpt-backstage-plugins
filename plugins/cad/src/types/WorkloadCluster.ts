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
import { KubernetesKeyValueObject } from './KubernetesResource';

/*
 * TODO Similar type definitions are heavily duplicated across types directory.
 *      Introduce generic types which can be used instead.
 */
export type WorkloadCluster = {
  readonly apiVersion: string;
  readonly kind: string;
  readonly metadata: WorkloadClusterMetadata;
  readonly spec: WorkloadClusterSpec;
};

export type WorkloadClusterMetadata = {
  readonly name: string;
  readonly namespace?: string;
  readonly labels?: KubernetesKeyValueObject;
  readonly annotations?: KubernetesKeyValueObject;
};

export type WorkloadClusterSpec = {
  readonly clusterName: string;
  readonly cnis?: readonly string[];
  readonly masterInterface?: string;
};
