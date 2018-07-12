const auth = {
    loggedIn: false,
    role: '',
    key: '',
    login(role, token){
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        this.key = token
        this.role = role
        this.loggedIn = true        
    },
    logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        this.key = ''
        this.role = ''
        this.loggedIn = false
    }    
  }

  export default auth
  