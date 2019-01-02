
import request from "superagent";
import constants from './constant';

class Utility {
  static getFolderPath(file) {
    let fileName = file.name;
    let directoryPath = file.path.replace(fileName, '');
    return directoryPath;
  }

  static getListFolders(directoryPath) {
    let directoryList = directoryPath.split('/').filter(folder => folder.length > 0);
    directoryList.unshift(constants.rootFolder);
    return directoryList;
  }

  static getFoldersArray(filePath) {
    return this.getListFolders(this.getFolderPath(filePath));
  }

  static uploadFile(url, headers, file, onChanged, onDone, state) {
    request.post(url)
      .set(headers)
      .attach('files', file.content, file.name)
      .on('progress', function (e) {
        state.setState({
          loadingText: "Uploading file ... " + e.percent.toFixed(2) + " %"
        });
        file.status = constants.statusUploading;
        onChanged(file, null);
      })
      .then(res => {
        onDone(file, res);
      })
      .end();
  }
}

export default Utility;