import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Upload, Modal, message, Icon} from "antd";
import {BASE_IMG_PATH, UPLOAD_IMG_NAME} from "../../config/constants";
import {reqImgDel} from "../../api";

export default class PictureWall extends Component{

  static propTypes = {
    imgs: PropTypes.array
  }

  constructor(props) {
    super(props)
    let fileList = []
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_PATH + img
      }))
    }
    this.state = { fileList, previewVisible: false, previewImage: ''}
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = async ({file, fileList}) => {
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('upload success')
        const {name, url} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = BASE_IMG_PATH + url
      } else {
        message.error('upload failed')
      }
    } else if (file.status === 'removed') {
      const result = await reqImgDel(file.name)
      if (result.status === 0) {
        message.success('del success')
      } else {
        message.error('del failed')
      }
    }
    this.setState({ fileList })
  }

  getImgs = () => this.state.fileList.map(file => file.name)

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div>上传图片</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept='image/*'
          name={UPLOAD_IMG_NAME}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
