
function login(comp, email, role, token){
  localStorage.setItem('email', email)
  localStorage.setItem('role', role)
  localStorage.setItem('token', token)
  comp.$router.push('/')
}

function logout(comp){
  localStorage.removeItem('email')
  localStorage.removeItem('role')
  localStorage.removeItem('token')
  comp.$router.push('/login')
}

function getRole() {
  return localStorage.getItem('role');
}

function getToken() {
  return localStorage.getItem('token');
}

function getEmail() {
  return localStorage.getItem('email');
}

export default {
  login: login,
  logout: logout,
  getRole: getRole,
  getToken: getToken,
  getEmail: getEmail
}
