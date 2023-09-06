import { useEditor } from '@craftjs/core';
import {
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Button as MaterialButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@material-ui/core';
import copy from 'copy-to-clipboard';
import lz from 'lzutf8';
import React, { useState } from 'react';

export const Topbar = (props) => {
  const { test, setHtml } = props;
  const { actions, query, enabled, canUndo, canRedo } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
      canUndo: state.options.enabled && query.history.canUndo(),
      canRedo: state.options.enabled && query.history.canRedo(),
    })
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();

  const [stateToLoad, setStateToLoad] = useState(null);

  return (
    <Box px={1} py={1} mt={3} mb={1} bgcolor="#cbe8e7">
      <Grid container alignItems="center">
        <Grid item xs>
          <FormControlLabel
            className="enable-disable-toggle"
            control={
              <Switch
                checked={enabled}
                onChange={(_, value) =>
                  actions.setOptions((options) => (options.enabled = value))
                }
              />
            }
            label="Enable"
          />
          <MaterialButton
            className="copy-state-btn"
            size="small"
            variant="outlined"
            color="secondary"
            disabled={!canUndo}
            onClick={() => actions.history.undo()}
            style={{ marginRight: '10px' }}
          >
            Undo
          </MaterialButton>
          <MaterialButton
            className="copy-state-btn"
            size="small"
            variant="outlined"
            color="secondary"
            disabled={!canRedo}
            onClick={() => actions.history.redo()}
            style={{ marginRight: '10px' }}
          >
            Redo
          </MaterialButton>
        </Grid>
        <Grid item>
          <MaterialButton
            className="copy-state-btn"
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => {
              const json = query.serialize();
              console.log(query);
              console.log(query.serialize());
              copy(lz.encodeBase64(lz.compress(json)));
              setSnackbarMessage('State copied to clipboard');
            }}
            style={{ marginRight: '10px' }}
          >
            Copy current state
          </MaterialButton>
          <MaterialButton
            className="load-state-btn"
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDialogOpen(true)}
          >
            Load
          </MaterialButton>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle id="alert-dialog-title">Load state</DialogTitle>
            <DialogContent>
              <TextField
                multiline
                fullWidth
                placeholder='Paste the contents that was copied from the "Copy Current State" button'
                size="small"
                value={stateToLoad || ''}
                onChange={(e) => setStateToLoad(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <MaterialButton
                onClick={() => setDialogOpen(false)}
                color="primary"
              >
                Cancel
              </MaterialButton>
              <MaterialButton
                onClick={() => {
                  setDialogOpen(false);
                  // console.log(lz.decodeBase64({"5OIsFZrqEA":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Jovie","fontSize":50,"size":"small","data-cy":"frame-container-text"},"displayName":"Text","custom":{},"parent":"a6c2177e-e07f-4e30-aa9d-352ede8dbcd6","hidden":false,"nodes":[],"linkedNodes":{}}}))
                  // const json = lz.encodeBase64(lz.compress({"5OIsFZrqEA":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Jovie","fontSize":50,"size":"small","data-cy":"frame-container-text"},"displayName":"Text","custom":{},"parent":"a6c2177e-e07f-4e30-aa9d-352ede8dbcd6","hidden":false,"nodes":[],"linkedNodes":{}}}
                  // )
                  // );
                  // const toLoad = lz.encodeBase64(lz.compress(`{"5OIsFZrqEA":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Jovie","fontSize":50,"size":"small","data-cy":"frame-container-text"},"displayName":"Text","custom":{},"parent":"a6c2177e-e07f-4e30-aa9d-352ede8dbcd6","hidden":false,"nodes":[],"linkedNodes":{}}}`))
                  // console.log(toLoad);

                  actions.deserialize({
                    ROOT: {
                      type: {
                        resolvedName: 'Container',
                      },
                      isCanvas: true,
                      props: {
                        background: '#eeeeee',
                        padding: 5,
                        'data-cy': 'root-container',
                      },
                      displayName: 'Container',
                      custom: {},
                      hidden: false,
                      nodes: ['A'],
                      linkedNodes: {},
                    },

                  'A': {
                    type: { resolvedName: 'Text' },
                    isCanvas: false,
                    props: {
                      text: 'Hoshasdf',
                      fontSize: 50,
                      size: 'small',
                      'data-cy': 'frame-container-text',
                    },
                    displayName: 'Text',
                    custom: {},
                    parent: 'ROOT',
                    hidden: false,
                    nodes: [],
                    linkedNodes: {},
                  },
                  });
                  // setHtml(`${stateToLoad}`);
                  // console.log(stateToLoad);



                  // actions.deserialize({
                  //   ROOT: {
                  //     type: {
                  //       resolvedName: 'Container',
                  //     },
                  //     isCanvas: true,
                  //     props: {
                  //       background: '#eeeeee',
                  //       padding: 5,
                  //       'data-cy': 'root-container',
                  //     },
                  //     displayName: 'Container',
                  //     custom: {},
                  //     hidden: false,
                  //     nodes: ['5OIsFZrqEA'],
                  //     linkedNodes: {},
                  //   },
                  //   // DDXfOPlC9v: {
                  //   //   type: {
                  //   //     resolvedName: 'Container',
                  //   //   },
                  //   //   isCanvas: true,
                  //   //   props: {
                  //   //     background: '#eeeeee',
                  //   //     padding: 5,
                  //   //     'data-cy': 'root-container',
                  //   //   },
                  //   //   displayName: 'Container',
                  //   //   custom: {},
                  //   //   parent: 'ROOT',
                  //   //   hidden: false,
                  //   //   nodes: ['sCZ_5xpaYD', '95_x9Nygbm'],
                  //   //   linkedNodes: {},
                  //   // },
                  //   // sCZ_5xpaYD: {
                  //   //   type: {
                  //   //     resolvedName: 'Button',
                  //   //   },
                  //   //   isCanvas: false,
                  //   //   props: {
                  //   //     size: 'small',
                  //   //     variant: 'contained',
                  //   //     color: 'primary',
                  //   //     text: 'Hello',
                  //   //     'data-cy': 'frame-button',
                  //   //   },
                  //   //   displayName: 'Button',
                  //   //   custom: {},
                  //   //   parent: 'DDXfOPlC9v',
                  //   //   hidden: false,
                  //   //   nodes: [],
                  //   //   linkedNodes: {},
                  //   // },
                  //   // '95_x9Nygbm': {
                  //   //   type: {
                  //   //     resolvedName: 'Container',
                  //   //   },
                  //   //   isCanvas: true,
                  //   //   props: {
                  //   //     background: '#eeeeee',
                  //   //     padding: 5,
                  //   //     'data-cy': 'root-container',
                  //   //   },
                  //   //   displayName: 'Container',
                  //   //   custom: {},
                  //   //   parent: 'DDXfOPlC9v',
                  //   //   hidden: false,
                  //   //   nodes: ['B6DJOmfuwU', '5OIsFZrqEA'],
                  //   //   linkedNodes: {},
                  //   // },
                  //   // B6DJOmfuwU: {
                  //   //   type: {
                  //   //     resolvedName: 'Text',
                  //   //   },
                  //   //   isCanvas: false,
                  //   //   props: {
                  //   //     text: 'Bro',
                  //   //     fontSize: 20,
                  //   //     size: 'small',
                  //   //     'data-cy': 'frame-container-text',
                  //   //   },
                  //   //   displayName: 'Text',
                  //   //   custom: {},
                  //   //   parent: '95_x9Nygbm',
                  //   //   hidden: false,
                  //   //   nodes: [],
                  //   //   linkedNodes: {},
                  //   // },
                  //   '5OIsFZrqEA': {
                  //     type: {
                  //       resolvedName: 'Text',
                  //     },
                  //     isCanvas: false,
                  //     props: {
                  //       text: 'Jovie',
                  //       fontSize: 50,
                  //       size: 'small',
                  //       'data-cy': 'frame-container-text',
                  //     },
                  //     displayName: 'Text',
                  //     custom: {},
                  //     parent: 'ROOT',
                  //     hidden: false,
                  //     nodes: [],
                  //     linkedNodes: {},
                  //   },
                  // });
                  setSnackbarMessage('State loaded');
                }}
                color="primary"
                autoFocus
              >
                Load
              </MaterialButton>
            </DialogActions>
          </Dialog>
          <Snackbar
            autoHideDuration={1000}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={!!snackbarMessage}
            onClose={() => setSnackbarMessage(null)}
            message={<span>{snackbarMessage}</span>}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
