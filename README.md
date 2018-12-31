# Summary
This demo allow user to drag and drop a folders then choose files to upload. The selected files will be zipped while keeping directory structure then upload onto server.

# Features
1. Choose multiple files / folders to upload
2. Drag & drop files / folders to upload
3. Ability to preview selected folders / files 
4. Ability to discard specific files / folders before uploading
5. Zip the final selection before uploading to preserve folders / files structure
6. Zipped file will take the following convention:
   1. Choose a single folder with name `<folderName>` then output file would be: `<folderName>.zip`
   2. Choose a single file with name `<fileName.abc>` then output file would be: `<fileName.abc>.zip`
   3. Choose multiple files / folders or mixed then output file would take the current timestamp as file name.
7.  Show the progress of the processes
8.  Ability to remove uploaded files

# How to use
```
<ZippingUploader {...{
  url: uploadingURL,
  headers: {
    Authorization: 'Bearer ' + user.authToken,
    user: user.id
  },
  fileList:
    files.map(file => {
        return {
          uid: file.id,
          name: file.name,
          url: file.url,
          ...file
        };
      }
    }),
  onChanged: this.handleOnChangeUploadFiles,
}} />
```