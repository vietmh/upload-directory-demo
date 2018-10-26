import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import saveAs from 'file-saver';
import { Modal } from 'antd';

import FileSelector from './FileSelector';
import Utility from './Utility';

import 'antd/dist/antd.css';
import './ZippingUploader.css';

const Zip = require('jszip');
const { fromEvent } = require('file-selector');


class ZippingUploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      visible: false
    }
    this.zip = new Zip();
  }

  componentDidMount() {

  }

  onDrop = (files) => {
    this.setState({
      files: files,
      visible: true,
    });
  }

  submitFiles = (data) => {
    // let leaves = [];
    // this.zip = new Zip();
    // this.getLeaves(leaves, data);
    // this.zipFile(leaves);
    // console.log(this.refs.modal);
    this.setState({ visible: false });
  }

  zipFile(files) {
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
        saveAs(content, "example.zip");
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