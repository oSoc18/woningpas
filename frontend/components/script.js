export default {
    name: 'test',
    data: function(){
        return{
            counter: 0,
            currentPage: "mainPage",
            input: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        loginPageButton: function(event){
            this.currentPage="loginPage"
        },
        mainPage: function(event){
            this.currentPage="mainPage"
        },
        login: function(event){
            if (this.input.username==="RaisedDjed" && this.input.password==="password"){
                this.currentPage="mainPage"
            }
            else{
                alert("Wrong password/username combination")
            }
        }
    }
}