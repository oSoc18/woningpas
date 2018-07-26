import axios from 'axios'

function request(path, data, success, error){
  axios({
    url: '/api/' + path,
    data: data,
    method: 'POST',
    responseType: 'json',
  }).then(response => {
    let data = response.data;
    if(success) {
      success(data);
    } else {
      alert(JSON.stringify(data));
    }
  }).catch(err => {
    let message = err.response.data.message;
    if(error) {
      error(message);
    } else {
      alert('ERROR: ' + message);
    }
  });
}

export default {
  request: request
}
