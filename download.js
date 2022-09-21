/*
 * @Author: King
 * @Page: 
 * @Create Date: 2022-09-16 10:47:59
 * @Last Modified By: King
 * @Last Modified Time: 2022-09-21 13:25:24
 * @File Path: /download.js
 */
var request = require("request");
var fs = require("fs");

function download(url, filePath, callback, progressbar=null){
  // fs.unlinkSync(filePath)
  let stream = fs.createWriteStream(filePath);
  var received_bytes = 0;
  var total_bytes = 0;
  var downloadedPercent = 0
  console.log(url)
  request(url.replace("hub.fastgit.xyz","github.com"))
    .on("error", function(err) {
        console.log("on error:",err);
        fs.unlinkSync(filePath)
        callback(err)
    })
    .on("response", function(data) {
        total_bytes = data.headers["content-length"];
        console.log("on response: ",total_bytes)
    })
    .on("data", function(chunk) {
        received_bytes += chunk.length;
        let percent = parseInt(received_bytes*100/total_bytes)
        console.log("on data :",received_bytes,total_bytes,percent)
        if (downloadedPercent == percent) return
        let increment = percent - downloadedPercent
        downloadedPercent = percent
        if(progressbar) {
          progressbar.report({ increment })
        }else{
          // callback(null,percent);
        }
    })
    .on("complete",function(req) {
      console.log("on complete:",downloadedPercent)
      callback()
    })
    .pipe(stream);
}


// download("https://github.com/gamedilong/anes-repository/archive/master.zip","master.zip");

module.exports = {
    download
}

