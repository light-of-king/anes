const fs = require("fs");
const path = require("path");

const META_FILE_NAME = "meta.json";

const FileUtil = {
  pathExists: function (p) {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  },
  createDefaultANesFloder: function (userRoot, context) {
    fs.mkdirSync(path.join(userRoot, ".anes"));
    fs.mkdirSync(path.join(userRoot, ".anes", "local"));
    let defaultRomPath = FileUtil.getExtensionFileAbsolutePath(context, "resources/demo.nes");
    let basename = path.basename(defaultRomPath, ".nes");
    let defaultRomDistPath = path.join(userRoot, ".anes", "local", `${basename}.nes`);

    fs.cpSync(defaultRomPath, defaultRomDistPath);
    this.writeMetaInfo(userRoot, [
      {
        label: basename,
        path: defaultRomDistPath,
      },
    ]);
  },
  createDefaultRemoteFloder: function () {
    //fs.mkdirSync(path.join(userRoot, '.anes'));
    fs.mkdirSync(path.join(userRoot, ".anes", "remote"));
  },
  writeMetaInfo: function (userRoot, metaInfo) {
    fs.writeFileSync(path.join(userRoot, ".anes", META_FILE_NAME), JSON.stringify(metaInfo));
  },
  addRomToResposity: function (userRoot, srcPath, gameName) {
    //防止文件信息后缀不对
    let fileName = path.basename(srcPath, ".nes");
    let distPath = path.join(userRoot, ".anes", "local", `${fileName}.nes`);
    fs.cpSync(srcPath, distPath);
    let romConfigList = this.getRomConfigFileList(userRoot);
    romConfigList = romConfigList ? romConfigList : [];
    let exist = false;
    romConfigList.forEach((romConfig) => {
      if (romConfig.label == gameName) {
        exist = true;
      }
    });
    if (!exist){
      romConfigList.push({
        label: gameName ? gameName : path.basename(srcPath),
        path: distPath,
      });
    }
    this.writeMetaInfo(userRoot, romConfigList);
  },
  getLocalRomFileList: function(userRoot) {
    let files = fs.readdirSync(path.join(userRoot, ".anes", "local"))
    return files
  },
  getRomConfigFileList: function (userRoot) {
    let metaData = fs.readFileSync(path.join(userRoot, ".anes", META_FILE_NAME));
    metaData = metaData.toString();
    return JSON.parse(metaData);
  },
  getRemoteRomConfig: function (userRoot) {
    let remoteList = fs.readFileSync(path.join(userRoot, ".anes", "remote", "anes-repository-master", "list.json"));
    remoteList = remoteList.toString();
    return JSON.parse(remoteList);
  },
  getExtensionFileAbsolutePath: function (context, relativePath) {
    return path.join(context.extensionPath, relativePath);
  }
};

module.exports = FileUtil;
