import axios from 'axios'

function stringToArray(string) {
  let l = string.length;
  let array = new Uint8Array(l);
  for (var i = 0; i < l; i++){
      array[i] = string.charCodeAt(i);
  }
  return array;
}

function download(name, content) {
  let arr = stringToArray(content);
  let file = new Blob([arr], {type: 'application/octet-stream'});
  let link = document.createElement('a');
  link.href = window.URL.createObjectURL(file);
  link.setAttribute('download', name);
  // append required by Firefox
  document.body.appendChild(link);
  link.click()
}

export default {
  download: download
}
