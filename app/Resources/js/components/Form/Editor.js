// @flow
// Todo : ref Quill
import React from 'react';
import ReactDOM from 'react-dom';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Quill from 'quill';
import QuillToolbar from './QuillToolbar';

type Props = {
  intl: intlShape,
  valueLink?: Object,
  value?: any,
  onChange: Function,
  onBlur: Function,
  id?: string,
  className: string,
  disabled?: boolean,
};

class Editor extends React.Component<Props> {
  static defaultProps = {
    id: '',
    className: '',
    disabled: false,
  };

  componentDidMount() {
    const { intl, disabled, onBlur, onChange, value, valueLink } = this.props;
    if (!disabled) {
      // $FlowFixMe
      this._editor = new Quill(ReactDOM.findDOMNode(this.refs.editor), {
        modules: {
          toolbar: {
            container: ReactDOM.findDOMNode(this.refs.toolbar),
          },
          'image-tooltip': {
            template: `
              <input class="input" type="textbox">
              <div class="preview">
                <span>${intl.formatMessage({ id: 'global.preview' })}</span>
              </div>
              <a href="javascript:;" class="cancel">
                ${intl.formatMessage({ id: 'global.cancel' })}</a>
              <a href="javascript:;" class="insert">
                ${intl.formatMessage({ id: 'global.insert' })}
              </a>`,
          },
          'link-tooltip': {
            template: `
              <span class="title">
                ${intl.formatMessage({ id: 'editor.url' })}&nbsp;
              </span>
              <a href="#" class="url" target="_blank" href="about:blank"></a>
              <input class="input" type="text">
              <span>&nbsp;&#45;&nbsp;</span>
              <a href="javascript:;" class="change">
                ${intl.formatMessage({ id: 'global.change' })}
              </a>
              <a href="javascript:;" class="remove">
                ${intl.formatMessage({ id: 'global.remove' })}
              </a>
              <a href="javascript:;" class="done">
                ${intl.formatMessage({ id: 'global.done' })}
              </a>`,
          },
        },
        styles: false,
        theme: 'snow',
      });
      // $FlowFixMe
      this._editor.getModule('keyboard').removeHotkeys(9);

      if (valueLink) {
        // eslint-disable-next-line no-console
        console.warn('This is deprecated please use redux-form instead of valueLink.');
        const defaultValue = valueLink.value;
        if (defaultValue) {
          // $FlowFixMe
          this._editor.setHTML(defaultValue);
        }
        // $FlowFixMe
        this._editor.on('text-change', () => {
          // $FlowFixMe
          valueLink.requestChange(this._editor.getHTML());
        });
      } else {
        const defaultValue = value;
        if (defaultValue) {
          // $FlowFixMe
          this._editor.setHTML(defaultValue);
        }
        // $FlowFixMe
        this._editor.on('selection-change', range => {
          if (!range) {
            // $FlowFixMe
            onBlur(this._editor.getHTML());
          }
        });
        // $FlowFixMe
        this._editor.on('text-change', () => {
          // $FlowFixMe
          onChange(this._editor.getHTML());
        });
      }
    }
  }

  componentWillUnmount() {
    // $FlowFixMe
    if (this._editor) {
      // $FlowFixMe
      this._editor.destroy();
    }
  }

  render() {
    const { className, disabled, id } = this.props;
    const classes = {
      editor: !disabled,
      'form-control': disabled,
      [className]: true,
    };
    if (disabled) {
      return <textarea id={id} className={classNames(classes)} disabled />;
    }
    return (
      <div id={id} className={classNames(classes)}>
        {/* $FlowFixMe */}
        <QuillToolbar ref="toolbar" />
        <div ref="editor" style={{ position: 'static' }} />
      </div>
    );
  }
}

export default injectIntl(Editor);
