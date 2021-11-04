function startToCopy() {
  var sourceFolder = DriveApp.getFolderById('<source_folder_id>')
  var targetFolder = DriveApp.getFolderById('<target_folder_id>')
  var subFolders = sourceFolder.getFolders()
  copyFolder(sourceFolder, targetFolder)
}

function copyFolder(from, to) {
  var subFiles = from.getFiles()
  while (subFiles.hasNext()) {
    var file = subFiles.next();
    file.makeCopy(file.getName(), to)
  }

  var subFolders = from.getFolders()
  while (subFolders.hasNext()) {
    var folder = subFolders.next();
    var new_folder = to.createFolder(folder.getName())
    copyFolder(folder, new_folder)
  }
}