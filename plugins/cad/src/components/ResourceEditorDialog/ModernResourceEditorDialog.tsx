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

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import { get } from 'lodash';
import React, { useState } from 'react';
import { ResourceEditorDialogProps } from './ResourceEditorDialog';
import { parseYaml } from './components/PxeParametricEditor/utils/yamlConversion';
import { YamlViewer } from '../Controls';
import { getGroupVersionKind } from '../../utils/kubernetesResource';
import { KubernetesResource } from '../../types/KubernetesResource';
import { PxeConfiguredEditorProps } from './components/PxeParametricEditor/createEditorFromConfiguration';
import { NephioTokenParametricEditor } from './components/ParametricFirstClassEditors/NephioTokenParametricEditor';
import { NephioNetworkParametricEditor } from './components/ParametricFirstClassEditors/NephioNetworkParametricEditor';
import { NephioWorkloadClusterParametricEditor } from './components/ParametricFirstClassEditors/NephioWorkloadClusterParametricEditor';
import { NephioCapacityParametricEditor } from './components/ParametricFirstClassEditors/NephioCapacityParametricEditor';

type EditorViewMode = 'gui' | 'yaml';

const EDITOR_COMPONENT_BY_GVK: Record<string, React.FC<PxeConfiguredEditorProps>> = {
  'infra.nephio.org/v1alpha1/Token': NephioTokenParametricEditor,
  'infra.nephio.org/v1alpha1/Network': NephioNetworkParametricEditor,
  'infra.nephio.org/v1alpha1/WorkloadCluster': NephioWorkloadClusterParametricEditor,
  'req.nephio.org/v1alpha1/Capacity': NephioCapacityParametricEditor,
};

export const ModernResourceEditorDialog = ({
  yaml: initialYaml,
  open,
  onSaveYaml: handleSaveYaml,
  onClose: handleClose,
}: ResourceEditorDialogProps) => {
  // TODO The pattern of late component initialization is not great but in line with how editor dialogs currently work.
  // It's ok but could be refactored in future.
  const [previouslyOpen, setPreviouslyOpen] = useState(false);
  const [gvk, setGVK] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [yaml, setYaml] = useState<string>('');
  const [viewMode, setViewMode] = useState<EditorViewMode>('gui');

  if (open && !previouslyOpen) {
    const resource = parseYaml(initialYaml).yamlObject;
    setGVK(getGroupVersionKind(resource as KubernetesResource));
    setTitle(dialogTitleFromResource(resource));

    setYaml(initialYaml);
    setViewMode('gui');
  }
  if (open !== previouslyOpen) {
    setPreviouslyOpen(open);
  }

  const ConfiguredEditor = EDITOR_COMPONENT_BY_GVK[gvk];
  const classes = useStyles();

  const handleYamlChange = (newYaml: string) => setYaml(newYaml);
  const handleViewModeToggle = () => setViewMode(viewMode === 'gui' ? 'yaml' : 'gui');
  const handleCloseAndSave = () => {
    handleSaveYaml(yaml);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {ConfiguredEditor && (
          <div className={classes.editorContainer}>
            {viewMode === 'gui' ? (
              <ConfiguredEditor yamlText={yaml} onResourceChange={handleYamlChange} />
            ) : (
              <YamlViewer value={yaml} allowEdit onUpdatedValue={handleYamlChange} />
            )}
          </div>
        )}
        <Button variant="text" color="primary" onClick={handleViewModeToggle}>
          Show {viewMode === 'gui' ? 'YAML View' : 'GUI View'}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleCloseAndSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const dialogTitleFromResource = (resource: object) => {
  const resourceKind = get(resource, 'kind', '');
  const resourceName = get(resource, 'metadata.name', '');
  return `${resourceKind} ${resourceName}`.trim() || 'Edit resource';
};

const useStyles = makeStyles({
  editorContainer: {
    width: '1200px',
    height: 'calc(100vh - 480px)',
    marginBottom: '16px',
    paddingRight: '50px',
    overflowY: 'auto',
  },
});
