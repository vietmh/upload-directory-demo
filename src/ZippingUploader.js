import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Modal } from 'antd';

import FileSelector from './FileSelector';
import Utility from './Utility';

import 'antd/dist/antd.css';
import './ZippingUploader.css';

const Zip = require('jszip');
const { fromEvent } = require('file-selector');


class ZippingUploader extends Component {

  /** TODO : 
   * Automatically set file name
   *  files / folders with a root directory
   *  no root -> file name = `date`.zip */

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      headers: {
        'Content-Type': 'application/zip'
      },
      files: [],
      visible: false
    }
  }

  componentDidMount() {
    if (this.props.url !== undefined) {
      this.setState({
        url: this.props.url
      });
    }

    if (this.props.headers !== undefined) {
      this.setState({
        headers: this.props.headers
      });
    }
  }

  onDrop = (files) => {
    this.setState({
      files: files,
      visible: true,
    });
  }

  submitFiles = (data) => {
    let leaves = [];
    this.zip = new Zip();
    this.getLeaves(leaves, data);
    this.zipThenUploadFile(leaves);
    this.setState({ visible: false });
  }

  zipThenUploadFile(files) {
    const url = this.state.url;
    const headers = this.state.headers;
    const fileName = (new Date()).getTime() + '.zip';

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      let directories = Utility.getFoldersArray(file);
      let zip = this.zip;
      for (let directoryIndex = 0; directoryIndex < directories.length; directoryIndex++) {
        const folder = directories[directoryIndex];
        zip = zip.folder(folder);
      }
      zip.file(file.name, file);
    }
    this.zip.generateAsync({ type: "blob" })
      .then(function (content) {
        Utility.uploadFile(url, headers, content);
      });
  }

  getLeaves(leaves, tree) {
    tree.forEach(branch => {
      if (branch.isLeaf) {
        leaves.push(branch.data);
      } else {
        this.getLeaves(leaves, branch.children);
      }
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <div className="dropzone">
        <Dropzone
          getDataTransferItems={evt => fromEvent(evt)}
          onDrop={this.onDrop}
        >
          <p>Drop a folder with files here.</p>
        </Dropzone>

        <Modal
          visible={this.state.visible}
          ref="modal"
          title="File directory"
          footer={null}
          width={450}
          onCancel={this.handleCancel}
        >
          <FileSelector files={this.state.files} fileSubmissionHandler={this.submitFiles} />
        </Modal>
      </div>
    );
  }
}

export default ZippingUploader;