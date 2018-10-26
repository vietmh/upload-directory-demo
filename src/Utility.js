
import request from "superagent";

class Utility {
  static getFolderPath(file) {
    let fileName = file.name;
    let directoryPath = file.path.replace(fileName, '');
    return directoryPath;
  }

  static getListFolders(directoryPath) {
    return directoryPath.split('/').filter(folder => folder.length > 0);
  }

  static getFoldersArray(filePath) {
    return this.getListFolders(this.getFolderPath(filePath));
  }

  static uploadFile(url, file) {
    request.post(url).attach('example.zip', file).then().end();
  }
}

export default Utility;