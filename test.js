// let color = [0x525252, 0xB40000, 0xA00000, 0xB1003D, 0x740069, 0x00005B, 0x00005F, 0x001840, 0x002F10, 0x084A08, 0x006700, 0x124200, 0x6D2800, 0x000000, 0x000000, 0x000000, 0xC4D5E7, 0xFF4000, 0xDC0E22, 0xFF476B, 0xD7009F, 0x680AD7, 0x0019BC, 0x0054B1, 0x006A5B, 0x008C03, 0x00AB00, 0x2C8800, 0xA47200, 0x000000, 0x000000, 0x000000, 0xF8F8F8, 0xFFAB3C, 0xFF7981, 0xFF5BC5, 0xFF48F2, 0xDF49FF, 0x476DFF, 0x00B4F7, 0x00E0FF, 0x00E375, 0x03F42B, 0x78B82E, 0xE5E218, 0x787878, 0x000000, 0x000000, 0xFFFFFF, 0xFFF2BE, 0xF8B8B8, 0xF8B8D8, 0xFFB6FF, 0xFFC3FF, 0xC7D1FF, 0x9ADAFF, 0x88EDF8, 0x83FFDD, 0xB8F8B8, 0xF5F8AC, 0xFFFFB0, 0xF8D8F8, 0x000000, 0x000000];

// for(var i = 0 ; i < color.length ; i ++){
//     console.log(getRed(color[i]),getGreen(color[i]),getBlue(color[i]));
// }
// function getRed (rgb) {
//     return (rgb >> 16) & 0xff;
// }

// function getGreen (rgb) {
//     return (rgb >> 8) & 0xff;
// }

// function getBlue (rgb) {
//    return rgb & 0xff;
// }
const os = require("os");
const fs = require("fs");
const path = require("path");
const { download } = require("./download");

let downloadedPercent = 0
download("https://hub.fastgit.xyz/lucaschn/fcgame/raw/master/Mighty%20Final%20Fight.nes",path.join(os.homedir(),".test","Mighty%20Final%20Fight.nes"),(err,percent)=>{
  if (downloadedPercent == percent) return
  downloadedPercent = percent
  console.log(err,percent)
})
// download("http://lg-hkg.fdcservers.net/10GBtest.zip",path.join(os.homedir(),".test","10GBtest.zip"),(err,percent)=>{
//   if (!err) {
//     console.log(percent)
//   }
// })