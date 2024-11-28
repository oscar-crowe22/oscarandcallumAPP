let player_poss = [2]
let dealer_poss = [2]

async function play() {
    console.log("playing")
}


function whichKey(e) { 
    e = e || window.event; 
    let charCode = e.keyCode || e.which; 
    return String.fromCharCode(charCode); 
}

window.addEventListener('keypress', function (e) { 
    let key = whichKey(e)
    if(key == 'p') play()
    if(key == 'q') window.location.pathname = "../index.html";
}, false);
