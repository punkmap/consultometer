
import React, { Component } from 'react';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import './TextEditor.css'
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import CodeIcon from '@material-ui/icons/Code';
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux';
import { saveNote } from '../../../actions';
import IconBtn from '../IconBtn'
class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.props.meeting.value.meetingNotes ? EditorState.createWithContent(convertFromRaw(this.props.meeting.value.meetingNotes)) : EditorState.createEmpty(),
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
      this.setState({editorState});
      if(this.state.lastTimeout) clearTimeout(this.state.lastTimeout)
      const saveTimeout = setTimeout(() => {
        const contentBlock = convertToRaw(editorState.getCurrentContent())
        const meeting = {...props.meeting};
        this.props.saveNote({meeting, contentBlock});
        clearTimeout(saveTimeout);
      }, 1000);
      this.setState({lastTimeout:saveTimeout});
      if (editorState.getCurrentContent().getLastBlock().getLength() === 0) {
          
      }
    };

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="meeting notes..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}
export default connect(null, { saveNote })(TextEditor);
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        <IconBtn 
          icon={this.props.type.icon}
          active={this.props.active}
        />
      </span>
    );
  }
}
const BLOCK_TYPES = [
  {label: 'UL', style: 'unordered-list-item', icon: <FormatListBulletedIcon fontSize="small"/>},
  {label: 'OL', style: 'ordered-list-item', icon: <FormatListNumberedIcon fontSize="small"/>},
  {label: 'Code Block', style: 'code-block', icon: <CodeIcon fontSize="small"/>},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          type={type}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD', icon: <FormatBoldIcon fontSize="small"/>},
    {label: 'Italic', style: 'ITALIC', icon: <FormatItalicIcon fontSize="small"/>},
    {label: 'Underline', style: 'UNDERLINE', icon: <FormatUnderlinedIcon fontSize="small"/>},
    //
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          type={type}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
