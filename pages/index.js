import { Editor, Frame, Element } from '@craftjs/core';
import { Typography, Paper, Grid, makeStyles } from '@material-ui/core';
import parse, {
  domToReact,
  htmlToDOM,
  Element as ParserElement,
} from 'html-react-parser';
import React, { useEffect, useState, useRef } from 'react';
// import ReactHtmlParser from 'react-html-parser';
import { v4 } from 'uuid';


import { SettingsPanel } from '../components/SettingsPanel';
import { Toolbox } from '../components/Toolbox';
import { Topbar } from '../components/Topbar';
import { Button } from '../components/user/Button';
import { Card, CardBottom, CardTop } from '../components/user/Card';
import { Container } from '../components/user/Container';
import { Text } from '../components/user/Text';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    background: 'rgb(252, 253, 253)',
  },
}));
export default function App() {
  const classes = useStyles();
  const [html, setHtml] = useState(
    `<div class="blue">
      <button>Hello</button>
      <div>
        <h1>Bro</h1>
        <h2>Jovie</h2>
      </div>
    </div>`
  );
  const [test, setTest] = useState({});
  // const [html, setHtml] = useState('');]

  const handleOnClick = () => {
    setHtml(`<p>hey</p>`);
    setTest(<>it changed</>);
  };
  console.log(html)

  const options = {
    replace: (domNode) => {
      console.log(domNode);
      if (
        domNode instanceof ParserElement &&
        ['h2'].includes(domNode.name)
        // domNode.attribs.class === 'remove'
      ) {
        console.log(JSON.stringify({
          "5OIsFZrqEA": {
            "type": {
              "resolvedName": "Text"
            },
            "isCanvas": false,
            "props": {
              "text": domNode.firstChild && domNode.firstChild.data,
              "fontSize": 50,
              "size": "small",
              "data-cy": "frame-container-text"
            },
            "displayName": "Text",
            "custom": {},
            "parent": domNode.parent && domNode.parent.id,
            "hidden": false,
            "nodes": [],
            "linkedNodes": {}
          },
        }));
        domNode['id'] = v4();
        return (
          // <h1>BRO</h1>
          <Text
            size="small"
            text={domNode.firstChild && domNode.firstChild.data}
            data-cy="frame-container-text"
          />
        );
      } else if (
        domNode instanceof ParserElement &&
        ['div'].includes(domNode.name)
      ) {
        domNode['id'] = v4();
        return (
          <Element
            canvas
            is={Container}
            padding={5}
            background="#eeeeee"
            data-cy="root-container"
          >
            {domToReact(domNode.children, options)}
          </Element>
        );
      } else if (
        domNode instanceof ParserElement &&
        ['button'].includes(domNode.name)
      ) {
        domNode['id'] = v4();
        return (
          <Button
            text={domNode.firstChild && domNode.firstChild.data}
            size="small"
            data-cy="frame-button"
          />
        );
      }
    },
  };
  // const [htmlToLoad, setHtmlToLoad]= useState(parse(html, options));

  return (
    <div style={{ margin: '0 auto', width: '800px' }}>
      <Typography style={{ margin: '20px 0' }} variant="h5" align="center">
        Basic Page Editor
      </Typography>
      <Editor
        resolver={{
          Card,
          Button,
          Text,
          Container,
          CardTop,
          CardBottom,
        }}
      >
        <Topbar setHtml={setHtml} />
        <button onClick={handleOnClick}>change html</button>
        <Grid container spacing={5} style={{ paddingTop: '10px' }}>
          <Grid item xs>
            <Frame>
              <Element
                canvas
                is={Container}
                padding={5}
                background="#eeeeee"
                data-cy="root-container"
              >
                {parse(html, options)}
                {/* {parse(html, options)} */}
                {/* <Card data-cy="frame-card" /> */}
                {/* <Button text="Click me" size="small" data-cy="frame-button" /> */}
                {/* <Text fontSize={20} text="Hi world!" data-cy="frame-text" /> */}
                {/* <Element
                  canvas
                  is={Container}
                  padding={6}
                  background="#999999"
                  data-cy="frame-container"
                >
                  <Text
                    size="small"
                    text="It's me again!"
                    data-cy="frame-container-text"
                  />
                </Element> */}
              </Element>
            </Frame>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.root}>
              <Toolbox />
              <SettingsPanel />
            </Paper>
          </Grid>
        </Grid>
      </Editor>
    </div>
  );
}
