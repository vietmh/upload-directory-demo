import React, { Component } from 'react';
import TreeView from 'deni-react-treeview';
import { Button } from 'antd';
import Utility from './Utility';
import FaTrashO from 'react-icons/lib/fa/trash-o';
import './FileSelector.css';

class FileSelector extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.parseTreeView(this.props.files);
  }

  componentWillReceiveProps(props) {
    const { files } = this.props;
    this.setState({ data: [] });
    if (props.files !== files) {
      this.parseTreeView(props.files);
    }
  }

  async parseTreeView(files) {
    let tree = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      let directoryList = Utility.getFoldersArray(file);
      let fileObj = {
        id: file.preview,
        text: file.name,
        isLeaf: true,
        data: file
      };
      this.build(tree, directoryList, fileObj);
    }
    await this.setState({ data: tree });
  }

  build(tree, directories, file) {
    if (Array.isArray(directories) && directories.length === 1) {
      let directoryObj = this.getDirectoryObj(tree, directories[0]);
      if (directoryObj === null) {
        tree.push({
          id: directories[0],
          text: directories[0],
          children: [file]
        });
      } else if (!('children' in directoryObj)) {
        directoryObj.children = [file];
      } else {
        directoryObj.children.push(file);
      }
    } else {
      let directory = directories.shift();
      let directoryObj = this.getDirectoryObj(tree, directory);
      if (directoryObj === null) {
        directoryObj = {
          id: directories.join() + ',' + directory,
          text: directory,
          children: []
        };
        tree.push(directoryObj);
      }
      this.build(directoryObj.children, directories, file);
    }
  }

  getDirectoryObj(tree, directory) {
    let directories = tree.filter(object => { return object.text === directory });
    return directories.length > 0 ? directories[0] : null;
  }

  onActionButtonClick = (item, actionButton) => {
    const buttonName = actionButton.type.name;
    let api = this.refs.treeview.api;
    switch (buttonName) {
      case 'FaTrashO':
        if (item) api.removeItem(item.id);
        break;
      default:
    }
  }

  submitFiles = () => {
    this.props.onSubmit(this.state.data);
  }

  render() {
    const actionButtons = [
      (<FaTrashO size="15" color="#ff704d" />)
    ];

    return(
      <div>
        <TreeView
            items={this.state.data}
            ref="treeview"
            selectRow={true}
            actionButtons={actionButtons}
            onActionButtonClick={this.onActionButtonClick}
          />
          <Button type="primary" className="button-done" onClick={this.submitFiles}>Submit</Button>
      </div>
    );
  }
}

export default FileSelector;