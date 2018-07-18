import axios from 'axios'

const api = {
  request: function(path, data, success){
    axios({
      url: 'http://localhost:8080/' + path,
      data: data,
      method: 'POST',
      responseType: 'json',
    }).then(success).catch(error => {
      console.log(error);
    });
  }
}

export default api
