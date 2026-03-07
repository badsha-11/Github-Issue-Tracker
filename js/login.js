const SignInBtn = document.querySelector('#SignInBtn')
.addEventListener('click',() => {
    const userId = document.getElementById('input-user')
    const userInfo = userId.value 
    
    const userPass =document.getElementById('userPass')
    const passInfo = userPass.value 
    
    if(userInfo == 'admin' && passInfo == 'admin123'){
        window.location.assign("./desbord.html")
    }else{
        alert('login failed')
    }
})