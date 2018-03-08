function startClick(){
    var timeleft = 3;
    document.getElementById('countdown').hidden = false;

    setInterval(function(){
        if(timeleft > 0) {
            document.getElementById('countdown').innerHTML = timeleft;
            timeleft--;
        }
        else{
            window.location.href = '/private';
        }
    },1000);
}