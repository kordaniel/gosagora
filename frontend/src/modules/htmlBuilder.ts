import { Element, Text } from 'domhandler';
import { appendChild, getElementsByTagName } from 'domutils';
import render, { type DomSerializerOptions } from 'dom-serializer';
import { parseDocument } from 'htmlparser2';

const INDENT_SPACING: number = 2;
const renderOptions: DomSerializerOptions = {
  decodeEntities: false,
  selfClosingTags: true,
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

/**
 * Singleton tag = tag that occurs only once in the HTML document, head, title, body etc.
 */
const injectTagIntoSingletonTag = (
  targetTagName: string,
  tagNameToInject: string,
  injectedTagTextContent: string | null,
  attribs: Element['attribs'] = {}
): void => {
  if (!dom) {
    throw new Error('No HTML loaded: Unable to inject JS into HTML DOM.');
  }

  const targetTags = getElementsByTagName(targetTagName, dom);
  if (targetTags.length !== 1) {
    throw new Error(`Invalid HTML loaded: Document <${targetTagName}> tag count != 1.`);
  }

  const targetTag = targetTags[0];
  const newTagDepth = getElementDepth(targetTag); // first element (<html>) == 1
  const childTagToInject = new Element(tagNameToInject, attribs, injectedTagTextContent
    ? [new Text(injectedTagTextContent)]
    : []
  );

  appendChild(targetTag, new Text('  '));
  appendChild(targetTag, childTagToInject);
  appendChild(targetTag, new Text('\n'));
  appendChild(targetTag, new Text(' '.repeat(INDENT_SPACING * (newTagDepth-1))));
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
  injectTagIntoSingletonTag,
  loadHtml,
  toString,
  unloadHtml,
};
