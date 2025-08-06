document.getElementById("sign").addEventListener("submit",function(e){
    e.preventDefault();

    let emailId = document.getElementById("UserName").value.trim();
    let pass  = document.querySelector("#Password").value.trim();
    let errormsg = document.getElementById("Errormsg");
    errormsg.textContent="";
    if(String(pass).length <=  8 ){
        errormsg.textContent = "you cannot enter the 8 digit password";
        errormsg.style.color="yellow";
        return;
    }
    if(emailId && pass) {
      window.location.href = "./index.html";
      alert("login Successfully");
      this.reset();
    }
    else{
      alert("Please fill all fields.");
    }
});
