import Vue from "vue"

Vue.prototype.$loadTextFile = (options) => {
  const val = options.text
  const download = document.createElement("a")
  download.href =
    "data:text/plain;content-disposition=attachment;filename=file," + val
  download.download = options.fileName
  download.style.display = "none"
  download.id = "download"
  document.body.appendChild(download)
  document.getElementById("download").click()
  document.body.removeChild(download)
}
