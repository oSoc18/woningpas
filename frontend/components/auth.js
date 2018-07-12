const auth = {
    computed: {
        loggedIn: function () {
            if (localStorage.getItem(token) && localStorage.getItem(role)) {
                return true
            }
            return false
        }
    },
    setStatus(boolean){
        this.loggedIn = boolean
    },
    login(role, token){
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        this.setStatus(true)
    },
    logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        this.setStatus(false)
    }    
  }

  export default auth
  