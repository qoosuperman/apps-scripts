function tempFileCreate(file) {
  return tmpFolder().createFile(file)
}

function tempFolderCleanUp() {
  let files = tmpFolder().getFiles()
  var file
  while (files.hasNext()) {
    file = files.next()
    file.setTrashed(true)
  }
}

function tmpFolder() {
  return findOrCreateFolder('tmp')
}

function findOrCreateFolder(folderName) {
  let folder_iterator = DriveApp.getFoldersByName(folderName)
  var folder
  if (folder_iterator.hasNext()) {
    folder = folder_iterator.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }
  return folder
}