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
import parse, { domToReact, Element as ParserElement } from 'html-react-parser';
import lz from 'lzutf8';
import React, { useState } from 'react';
import { v4 } from 'uuid';

export const Topbar = () => {
  const { actions, query, enabled, canUndo, canRedo } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
      canUndo: state.options.enabled && query.history.canUndo(),
      canRedo: state.options.enabled && query.history.canRedo(),
    })
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogHtmlOpen, setDialogHtmlOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();

  const [stateToLoad, setStateToLoad] = useState(null);

  const options = {
    replace: (domNode) => {
      if (
        domNode instanceof ParserElement &&
        ['h2', 'h1'].includes(domNode.name)
      ) {
        domNode['id'] = v4();
        return (
          <div
            data_id={domNode['id']}
            data={JSON.stringify({
              [`${domNode.id}`]: {
                type: {
                  resolvedName: 'Text',
                },
                isCanvas: false,
                props: {
                  text: domNode.firstChild && domNode.firstChild.data,
                  fontSize: 50,
                  size: 'small',
                  'data-cy': 'frame-container-text',
                },
                displayName: 'Text',
                custom: {},
                parent: domNode.parent && domNode.parent.id,
                hidden: false,
                nodes: [],
                linkedNodes: {},
              },
            })}
          />
        );
      } else if (
        domNode instanceof ParserElement &&
        ['div'].includes(domNode.name)
      ) {
        if (domNode.attribs.id === 'root') {
          domNode['id'] = 'ROOT';
        } else {
          domNode['id'] = v4();
        }
        return (
          <div
            data_id={domNode['id']}
            data={JSON.stringify({
              [`${domNode.id}`]: {
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
                parent: domNode.parent && domNode.parent.id,
                hidden: false,
                nodes: [],
                linkedNodes: {},
              },
            })}
          >
            {domToReact(domNode.children, options)}
          </div>
        );
      } else if (
        domNode instanceof ParserElement &&
        ['button'].includes(domNode.name)
      ) {
        domNode['id'] = v4();
        return (
          <div
            data_id={domNode['id']}
            data={JSON.stringify({
              [`${domNode.id}`]: {
                type: {
                  resolvedName: 'Button',
                },
                isCanvas: false,
                props: {
                  text: domNode.firstChild && domNode.firstChild.data,
                  size: 'small',
                  variant: 'contained',
                  color: 'primary',
                  'data-cy': 'frame-button',
                },
                displayName: 'Button',
                custom: {},
                parent: domNode.parent && domNode.parent.id,
                hidden: false,
                nodes: [],
                linkedNodes: {},
              },
            })}
          />
        );
      }
    },
  };

  const elementsToJson = (element, output = {}) => {
    if (React.isValidElement(element)) {
      React.Children.forEach(element.props.children, (child) =>
        elementsToJson(child, output)
      );
      const nodesData = React.Children.map(
        element.props.children,
        (child) => child.props && child.props.data_id
      );

      let jsonData = JSON.parse(element.props.data ? element.props.data : '{}');
      const firstObjectFromJson1 = jsonData[Object.keys(jsonData)[0]];

      output[element.props.data_id] = {
        ...firstObjectFromJson1,
        nodes: nodesData,
      };
    }

    return output;
  };

  // const parsedElements = parse(html, options);
  // const jsonElements = elementsToJson(parsedElements);

  // console.log(jsonElements);

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
            style={{ marginRight: '10px' }}
          >
            Load
          </MaterialButton>
          <MaterialButton
            className="load-state-btn"
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => setDialogHtmlOpen(true)}
          >
            Load Html
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
                  const json = lz.decompress(lz.decodeBase64(stateToLoad));
                  actions.deserialize(json);
                  setSnackbarMessage('State loaded');
                }}
                color="primary"
                autoFocus
              >
                Load
              </MaterialButton>
            </DialogActions>
          </Dialog>
          <Dialog
            open={dialogHtmlOpen}
            onClose={() => setDialogHtmlOpen(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle id="alert-dialog-title">Load HTML</DialogTitle>
            <DialogContent>
              <TextField
                multiline
                fullWidth
                placeholder="Insert HTML to load"
                size="small"
                value={stateToLoad || ''}
                onChange={(e) => setStateToLoad(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <MaterialButton
                onClick={() => setDialogHtmlOpen(false)}
                color="primary"
              >
                Cancel
              </MaterialButton>
              <MaterialButton
                onClick={() => {
                  setDialogHtmlOpen(false);
                  const json = elementsToJson(parse(stateToLoad, options));
                  actions.deserialize(json);
                  setSnackbarMessage('State loaded');
                }}
                color="primary"
                autoFocus
              >
                Load Html
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
