import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Modal, message } from 'antd';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader'

import FileSelector from './FileSelector';
import Utility from './Utility';

import 'antd/dist/antd.css';
import './ZippingUploader.css';
import constants from './constant';

const Zip = require('jszip');
const { fromEvent } = require('file-selector');
const FontAwesome = require('react-fontawesome');
const confirm = Modal.confirm;

class ZippingUploader extends Component {

  /** TODO : 
   * Automatically set file name
   *  files / folders with a root directory
   *  no root -> file name = `date`.zip
   * Do not bound with data response from server to decouple this library */

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      headers: {
        'Content-Type': 'application/zip'
      },
      files: [],
      uploaded: [],
      isVisibleFileSelection: false,
      loadingText: '',
      isVisibleLoading: false
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

  componentWillReceiveProps(nextProps) {
    if (this.props.fileList !== nextProps.fileList) {
      this.setState({
        uploaded: nextProps.fileList
      });
    }
  }

  onDrop = (files) => {
    this.setState({
      files: files,
      isVisibleFileSelection: true,
    });
  }

  submitFiles = (data) => {
    let leaves = [];
    this.zip = new Zip();
    this.setState({ isVisibleLoading: true, loadingText: 'Reading folder ...' });
    this.getLeaves(leaves, data);
    const fileName = data[0].text === constants.rootFolder ? (new Date()).getTime() + '.zip' : data[0].text + '.zip';
    this.zipThenUploadFile(leaves, fileName);
    this.setState({ isVisibleFileSelection: false });
  }

  zipThenUploadFile(files, fileName) {
    const url = this.state.url;
    const headers = this.state.headers;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      let directories = Utility.getFoldersArray(file);
      let zip = this.zip;
      for (let directoryIndex = 0; directoryIndex < directories.length; directoryIndex++) {
        const folder = directories[directoryIndex];
        if (folder === constants.rootFolder)
          continue;
        zip = zip.folder(folder);
      }
      zip.file(file.name, file);
    }
    let onUploadDone = this.onUploadDone;
    this.zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 1
      },
      streamFiles: true
    }, (metadata) => {
      this.setState({ loadingText: "Zipping file ... " + metadata.percent.toFixed(2) + " %" });
      if (metadata.currentFile !== null) {
        const file = {
          name: metadata.currentFile,
          status: constants.statusUploading
        }
        this.onChanged(file, null);
      }
    }).then((content) => {
      let file = {
        name: fileName,
        content: content
      }
      this.setState({ loadingText: "Uploading file ... 0 %" });
      Utility.uploadFile(url, headers, file, this.onChanged, onUploadDone, this);
    });
  }

  onUploadDone = (file, response) => {
    if (response === undefined || response.body === undefined)
      message.error('Uploaded error.');

    let uploaded = this.state.uploaded;
    file.response = response.body;
    file.status = constants.statusDone;
    uploaded.push(file);
    this.setState({
      isVisibleLoading: false
    });
    this.onChanged(file, uploaded);
  }

  onChanged = (file, uploaded) => {
    if (this.props.onChanged !== undefined) {
      let info = {
        file: file,
        fileList: uploaded
      }
      this.props.onChanged(info);
    }
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

  onCancel = () => {
    this.setState({
      isVisibleFileSelection: false
    });
  }

  onRemoveUploadedFile = (e, fileToRemove) => {
    e.preventDefault();
    if (fileToRemove === undefined || fileToRemove.name === undefined)
      return;

    confirm({
      title: 'Are you sure to remove this uploaded file?',
      content: '',
      onOk: () => {
        let uploaded = this.state.uploaded.filter(file => file.uid !== fileToRemove.uid);
        this.setState({
          uploaded: uploaded
        });

        if (this.props.onChanged !== undefined) {
          fileToRemove.status = constants.statusRemoved;
          let info = {
            file: fileToRemove,
            fileList: uploaded
          }

          this.props.onChanged(info);
        }
      },
      onCancel() {
      },
    });
  }

  render() {
    return (
      <section className="dropzone">
        <OverlayLoader
          color={'#23AE84'} // default is white
          loader="BeatLoader" // check below for more loaders
          text={this.state.loadingText}
          active={this.state.isVisibleLoading}
          backgroundColor={'black'} // default is black
          opacity=".6" // default is .9
        >
          <div className="dropzone-box">
            <Dropzone
              getDataTransferItems={evt => fromEvent(evt)}
              onDrop={this.onDrop}
            >
              <p>Drop a folder with files here.</p>
            </Dropzone>

            <Modal
              visible={this.state.isVisibleFileSelection}
              ref="modal"
              title="File directory"
              footer={null}
              width={450}
              onCancel={this.onCancel}
            >
              <FileSelector files={this.state.files} onSubmit={this.submitFiles} />
            </Modal>
          </div>
          <div className="dropzone-files">
            {this.state.uploaded.length > 0 && this.state.uploaded.map((file, index) => {
              return (<div key={index} className="uploaded-file">
                <a key={"del_" + index} className="file-remove"
                  onClick={(e) => this.onRemoveUploadedFile(e, file)}>
                  <FontAwesome
                    className='super-crazy-colors'
                    name='remove'
                  />
                </a>
                <a key={index} href={file.url}>{file.name}</a>
              </div>)
            })}
          </div>
        </OverlayLoader>
      </section>
    );
  }
}

export default ZippingUploader;