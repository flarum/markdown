/*!
 * Includes modified code from GitHub Markdown Toolbar Element
 * https://github.com/github/markdown-toolbar-element/
 *
 * Original Copyright GitHub, Inc.
 * Released under the MIT license
 * https://github.com/github/markdown-toolbar-element/blob/master/LICENSE
 */

import { extend } from 'flarum/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import BasicEditorDriver from 'flarum/common/utils/BasicEditorDriver';
import styleSelectedText from 'flarum/common/utils/styleSelectedText';
import ItemList from 'flarum/common/utils/ItemList';

import MarkdownToolbar from './components/MarkdownToolbar';
import MarkdownButton from './components/MarkdownButton';

const modifierKey = navigator.userAgent.match(/Macintosh/) ? '⌘' : 'ctrl';

const styles = {
  'header': { prefix: '### ' },
  'bold': { prefix: '**', suffix: '**', trimFirst: true },
  'italic': { prefix: '_', suffix: '_', trimFirst: true },
  'quote': { prefix: '> ', multiline: true, surroundWithNewlines: true },
  'code': { prefix: '`', suffix: '`', blockPrefix: '```', blockSuffix: '```' },
  'link': { prefix: '[', suffix: '](https://)', replaceNext: 'https://', scanFor: 'https?://' },
  'image': { prefix: '![', suffix: '](https://)', replaceNext: 'https://', scanFor: 'https?://' },
  'unordered_list': { prefix: '- ', multiline: true, surroundWithNewlines: true },
  'ordered_list': { prefix: '1. ', multiline: true, orderedList: true }
}

const applyStyle = (id) => {
  // This is a nasty hack that breaks encapsulation of the editor.
  // In future releases, we'll need to tweak the editor driver interface
  // to support triggering events like this.
  styleSelectedText(app.composer.editor.el, styles[id]);
}

function makeShortcut(id, key) {
  return function (e) {
    if (e.key === key && (e.metaKey && modifierKey === '⌘' || e.ctrlKey && modifierKey === 'ctrl')) {
      applyStyle(id);
    }
  }
}

app.initializers.add('flarum-markdown', function (app) {
  extend(BasicEditorDriver.prototype, 'keyHandlers', function (items) {
    items.add('bold', makeShortcut('bold', 'b'));
    items.add('italic', makeShortcut('italic', 'i'));
  });

  extend(TextEditor.prototype, 'toolbarItems', function (items) {
    const tooltip = (name, hotkey) => {
      return app.translator.trans(`flarum-markdown.forum.composer.${name}_tooltip`) + (hotkey ? ` <${modifierKey}-${hotkey}>` : '');
    };

    const makeApplyStyle = (id) => {
      return () => applyStyle(id);
    }

    items.add('markdown', (
      <MarkdownToolbar for={this.textareaId} setShortcutHandler={handler => shortcutHandler = handler}>
        {markdownToolbarItems().toArray()}
      </MarkdownToolbar>
    ), 100);
  });
});

export function markdownToolbarItems() {
  const items = new ItemList();

  // Add items
  items.add('header', <MarkdownButton title={tooltip('header')} icon="fas fa-heading" onclick={makeApplyStyle('header')} />,90);
    items.add('bold',     <MarkdownButton title={tooltip('bold', 'b')} icon="fas fa-bold" onclick={makeApplyStyle('bold')}  />,80);
      items.add('italics',   <MarkdownButton title={tooltip('italic', 'i')} icon="fas fa-italic" onclick={makeApplyStyle('italic')}  />,70);
      items.add('quote',   <MarkdownButton title={tooltip('quote')} icon="fas fa-quote-left" onclick={makeApplyStyle('quote')} />,60);
      items.add('code',   <MarkdownButton title={tooltip('code')} icon="fas fa-code" onclick={makeApplyStyle('code')} />,50);
    items.add('link',     <MarkdownButton title={tooltip('link')} icon="fas fa-link" onclick={makeApplyStyle('link')} />,40);
      items.add('image',   <MarkdownButton title={tooltip('image')} icon="fas fa-image" onclick={makeApplyStyle('image')} />,30);
      items.add('unordered_list',   <MarkdownButton title={tooltip('unordered_list')} icon="fas fa-list-ul" onclick={makeApplyStyle('unordered_list')} />,20);
      items.add('ordered_list',   <MarkdownButton title={tooltip('ordered_list')} icon="fas fa-list-ol" onclick={makeApplyStyle('ordered_list')} />, 10);
    

  return items;
}
