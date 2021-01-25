const config = require('flarum-webpack-config');

module.exports = (function () {
  const _exports = config();

  _exports.externals[0]['prosemirror-commands'] = 'prosemirror.commands';
  _exports.externals[0]['prosemirror-model'] = 'prosemirror.model';
  _exports.externals[0]['prosemirror-keymap'] = 'prosemirror.keymap';
  _exports.externals[0]['prosemirror-state'] = 'prosemirror.state';
  _exports.externals[0]['prosemirror-transform'] = 'prosemirror.transform';

  return _exports;
})();
