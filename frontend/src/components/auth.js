const auth = {
    loggedIn: false,
    role: '',
    login(role, token){
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        this.role = role
        this.loggedIn = true
    },
    logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        this.role = ''
        this.loggedIn = false
    }    
  }

  export default auth
  