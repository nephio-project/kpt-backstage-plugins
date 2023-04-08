#!/bin/bash
# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -euo pipefail

CAD_CLUSTER_NAME=cad-cluster
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

echo "Verify script prerequisites"
if ! [ -x "$(command -v kind)" ]; then
  echo 'Error: kind is not installed. Follow https://kind.sigs.k8s.io to install kind.'
  exit 1
fi

if ! [ -x "$(command -v kubectl)" ]; then
  echo 'Error: kubectl is not installed. Follow https://kubernetes.io/docs/tasks/tools to install kubectl.'
  exit 1
fi

if ! [ -x "$(command -v jq)" ]; then
  echo 'Error: jq is not installed. Follow https://stedolan.github.io/jq to install jq.'
  exit 1
fi

echo "Create kind cluster"
kind create cluster --name $CAD_CLUSTER_NAME

echo "Install Porch"
$SCRIPT_DIR/install-porch.sh

echo "Install example package repositories"
$SCRIPT_DIR/install-package-repositories.sh

echo "kind cluster ready"
