const socket = io();


var cola = [];
var rendering = false;

const render = (data) => {
    var el = document.getElementById("inner");
    rendering = true;
    var html = `
    <div id="reaction" class="fadeInClass">
    <img src="${data.src}"/>
    <p>${data.msg}</p>
    </div>
    `;
    el.innerHTML = html;
    el.firstChild.addEventListener('animationend', () => el.innerHTML.classList.remove('fadeInClass'));

    setTimeout(() => {
        var el = document.getElementById("reaction");
        el.classList.add('fadeOutClass');
        el.addEventListener('animationend', () => {
            el.remove();
            if (cola.length > 0) {
                render(cola.pop());
            } else {
                rendering = false;
            }
        });
        if (cola.length > 0) {
            render(cola.pop());
        } else {
            rendering = false;
        }
    }, 5000)
} 

socket.on('reaction', (data) => {
    if (rendering) {
        cola.push(data);
    } else {
        render(data);
    }
})

