
import request from "superagent";

class Utility {
  static getFolderPath(file) {
    let fileName = file.name;
    let directoryPath = file.path.replace(fileName, '');
    return directoryPath;
  }

  static getListFolders(directoryPath) {
    let directoryList = directoryPath.split('/').filter(folder => folder.length > 0);
    directoryList.unshift("root");
    return directoryList;
  }

  static getFoldersArray(filePath) {
    return this.getListFolders(this.getFolderPath(filePath));
  }

  static uploadFile(url, headers, file) {
    request.post(url)
      .set(headers)
      .attach('files', file.content, file.name)
      .then(res => {
        console.log(res);
      })
      .end();
  }
}

export default Utility;