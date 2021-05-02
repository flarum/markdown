import Component from 'flarum/Component';

export default class MarkdownToolbar extends Component {
  view(vnode) {
    return <div id="MarkdownToolbar" style={{ display: 'inline-block' }}>
      {vnode.children}
    </div>;
  }
}
