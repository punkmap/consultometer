
import React, { Fragment } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import IconButton from '@material-ui/core/IconButton';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import CodeIcon from '@material-ui/icons/Code';
import Button from '@material-ui/core/Button';


export default class RichEditorExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => {
      this._toggleInlineStyle(style)
    };
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

    console.log('inlineStyle: ', inlineStyle);
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
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="meeting notes here..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

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
      console.log('this.props.style: ', this.props.style);
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
        {this.props.label}
      </span>
      // <div>
      //   {this.type.style}
      //   {/* <IconButton
          
      //     onClick={this.onToggle}
      //   >
      //     {this.props.type.icon}
      //   </IconButton> */}
      // </div>
    );
  }
}
class StyleIconButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      console.log('this.props.style: ', this.props.style);
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
          <IconButton>
            {this.props.type.icon}
          </IconButton>
        </span>
    );
  }
}

var BUTTON_OBJECTS = [
  {label: 'Bold', style: 'BOLD', icon: <FormatBoldIcon/>},
  {label: 'Italic', style: 'ITALIC', icon: <FormatItalicIcon/>},
  {label: 'Underline', style: 'UNDERLINE', icon: <FormatUnderlinedIcon/>},
  {label: 'Monospace', style: 'CODE', icon: <CodeIcon/>},

  {label: 'UL', style: 'unordered-list-item', icon: <FormatListBulletedIcon/>},
  {label: 'OL', style: 'ordered-list-item', icon: <FormatListNumberedIcon/>},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {BUTTON_OBJECTS.map(type =>
        <StyleIconButton
          key={type.label}
          type={type}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
        // <IconButton
        //     key={type.label}
        //     //active={currentStyle.has(type.style)}
        //     label={type.label}
        //     value={type.style}
        //     onClick={() => {props.onToggle(type.style)}}
        //   >
        //     {type.icon}
        //   </IconButton>
      )}
    </div>
    // <div className="RichEditor-controls">
    //   {BUTTON_OBJECTS.map(type =>
    //     <Fragment>
    //       <StyleButton
    //       key={type.label}
    //       active={currentStyle.has(type.style)}
    //       label={type.label}
    //       onToggle={props.onToggle}
    //       style={type.style}
    //     />
    //       {/* <IconButton
    //         key={type.label}
    //         active={currentStyle.has(type.style)}
    //         label={type.label}
    //         onClick={() => {props.onToggle(type.style)}}
    //       >
    //         {type.icon}
    //       </IconButton> */}
    //     </Fragment>
    //   )}
    // </div>
  );
};
