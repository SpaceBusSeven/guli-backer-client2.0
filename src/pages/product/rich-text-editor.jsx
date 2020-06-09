import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Editor} from 'react-draft-wysiwyg'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component{

  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props)
    const {detail} = this.props
    let editorState
    if (detail) {
      const blocksFromHtml = htmlToDraft(detail)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      editorState = EditorState.createWithContent(contentState)
    } else {
      editorState = EditorState.createEmpty()
    }
    this.state = { editorState }
  }
  onEditorStateChange = (editorState) => this.setState({ editorState })
  getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))


  render() {
    const editorState = this.state.editorState

    return (
      <Editor
        editorState={editorState}
        editorStyle={{height: 250, border: '1px solid #000', padding: '0 30px'}}
        onEditorStateChange={this.onEditorStateChange}
      ></Editor>
    );
  }
}
