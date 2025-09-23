import { Element, Text } from 'domhandler';
import { appendChild, getElementsByTagName } from 'domutils';
import render, { type DomSerializerOptions } from 'dom-serializer';
import { parseDocument } from 'htmlparser2';

const INDENT_SPACING: number = 2;
const renderOptions: DomSerializerOptions = {
  decodeEntities: false,
  xmlMode: false,
};

let dom: ReturnType<typeof parseDocument> | null = null;

/**
 * Computes how deep down the node passed in as argument is in the three.
 * First html tag (<html>) has depth = 1.
 * @param node Tag, which depth in the three to compute.
 * @returns Integer indicating how deep down the node is in the three.
 */
const getElementDepth = (node: Element) => {
  let depth = 0;
  let current = node.parent;
  while (current) {
    depth++;
    current = current.parent;
  }
  return depth;
};

// Default exported functions -------------------------------------------------

const injectScriptTagIntoBody = (scriptContent: string): void => {
  if (!dom) {
    throw new Error('No HTML loaded: Unable to inject JS into HTML DOM.');
  }

  const bodyTags = getElementsByTagName('body', dom);
  if (bodyTags.length !== 1) {
    throw new Error('Invalid HTML loaded: Document <body> tag count != 1.');
  }

  const bodyTag = bodyTags[0];
  const newTagDepth = getElementDepth(bodyTag); // first element (<html>) == 1
  const scriptTag = new Element('script', {}, [
    new Text(scriptContent)
  ]);

  appendChild(bodyTag, new Text('  '));
  appendChild(bodyTag, scriptTag);
  appendChild(bodyTag, new Text('\n'));
  appendChild(bodyTag, new Text(' '.repeat(INDENT_SPACING * (newTagDepth-1))));
};

const loadHtml = (html: string) => {
  dom = parseDocument(html);
};

const toString = () => {
  if (!dom) {
    throw new Error('No HTML loaded: Unable to render the DOM');
  }
  return render(dom, renderOptions);
};

const unloadHtml = () => {
  dom = null;
};

// Default exported functions -------------------------------------------------

export default {
  injectScriptTagIntoBody,
  loadHtml,
  toString,
  unloadHtml,
};
