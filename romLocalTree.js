const vscode = require("vscode");
const FileUtil = require("./fileUtil");
const os = require("os");
const path = require("path");

class RomLocalTree {
  constructor(context) {
    this.context = context;
    this.userRoot = os.homedir();
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    if (!FileUtil.pathExists(path.join(this.userRoot, ".anes"))) {
      //if not exists create default ahost floder
      try {
        FileUtil.createDefaultANesFloder(this.userRoot, this.context);
      } catch (e) {
        vscode.window.showInformationMessage("Ahost need Administrator permission!");
      }
    }
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    let romConfigFileList = FileUtil.getRomConfigFileList(this.userRoot);
    let localRomFileList = FileUtil.getLocalRomFileList(this.userRoot)
    let remoteRomConfig = FileUtil.getRemoteRomConfig(this.userRoot);
    console.log(`romConfigFileList ${JSON.stringify(romConfigFileList)}`);
    let hostConfigs = [];
    if (romConfigFileList && romConfigFileList.length > 0) {
      romConfigFileList.forEach((romConfig) => {
        let label = romConfig.label
        let remoteRom = remoteRomConfig.find(v=>v.name==label||v.nesName==label)
        if (remoteRom) {
          let index = localRomFileList.findIndex((v,i,o)=>v==remoteRom.nesName)
          if (index>-1) {
            localRomFileList.splice(index,1)
          }
          label = remoteRom.name
        }
        hostConfigs.push(
          new DataItem(label, null, {
            command: "anes.openGameBox",
            title: "",
            arguments: [Object.assign(romConfig,{label})],
          })
        );
      });
    }
    if (localRomFileList && localRomFileList.length > 0) {
      localRomFileList.forEach((fileName,index)=>{
        let remoteRom = remoteRomConfig.find(v=>v.name==fileName||v.fileName==fileName||v.nesName==fileName)
        if (remoteRom) {
          // localRomFileList.splice(index,1)
          hostConfigs.push(
            new DataItem(remoteRom.name, null, {
              command: "anes.openGameBox",
              title: "",
              arguments: [{label:remoteRom.name,path:path.join(this.userRoot,'.anes','local',fileName)}],
            })
          );
        }else{
          hostConfigs.push(
            new DataItem(fileName, null, {
              command: "anes.openGameBox",
              title: "",
              arguments: [{label:fileName,path:path.join(this.userRoot,'.anes','local',fileName)}],
            })
          )
        }
      })
    }
    return hostConfigs;
  }
  deleteRom(item) {
    let romConfigList = FileUtil.getRomConfigFileList(this.userRoot);
    if (romConfigList && romConfigList.length > 0) {
      let newList = [];
      romConfigList.forEach((romConfig, index) => {
        if (romConfig.label != item.label && !newList.find(v=>v.label==romConfig.label)) {
          newList.push(romConfig)
        }
      });
      FileUtil.writeMetaInfo(this.userRoot, newList);
      this._onDidChangeTreeData.fire();
    }
  }
  rename(item) {
    vscode.window.showInputBox({ placeHolder: "Enter the new game name", value: item.label }).then((value) => {
      if (value) {
        let romConfigList = FileUtil.getRomConfigFileList(this.userRoot);
        let exist = false;
        romConfigList.forEach((romConfig) => {
          if (romConfig.label == value) {
            exist = true;
          }
        });
        if (exist) {
          vscode.window.showInformationMessage("This name is aready exist!");
        } else {
          romConfigList.forEach((romConfig) => {
            if (romConfig.label == item.label) {
              romConfig.label = value;
            }
          });
          FileUtil.writeMetaInfo(this.userRoot, romConfigList);
          this._onDidChangeTreeData.fire();
        }
      } else {
        vscode.window.showInformationMessage("Please enter your game name!");
      }
    });
  }
}

class DataItem extends vscode.TreeItem {
  constructor(label, children, command) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.iconPath = path.join(__filename, "..", "resources", "rom.svg");
    this.children = children;
    this.command = command;
  }
}

module.exports = RomLocalTree;
