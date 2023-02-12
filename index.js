const menu = document.querySelector('.hamburger');
const hamDiv = document.querySelectorAll('.ham');
const navBar = document.getElementById('navBar')

menu.addEventListener('click', ()=>{
    navBar.style.display = navBar.style.display === 'none' ? 'block' : 'none';
    hamDiv[0].classList.toggle('topBurger');
    hamDiv[1].style.display = hamDiv[1].style.display === 'block' ? 'none' : 'block';
    hamDiv[2].classList.toggle('bottomBurger');
})

const linkEntered = document.getElementById('LinkInput');
const divtoAppend = document.querySelector('.second');
const shorten = document.getElementById('shortenBtn');
const errorMessage = document.getElementById('errorMSG');
let urlHistory = [];

window.addEventListener('load', ()=>{
    if(localStorage.getItem('history') === null){
        return;
    }else {
        let myUrls = JSON.parse(localStorage.getItem('history'));
        urlHistory = myUrls;
        myUrls.forEach(url => divtoAppend.insertAdjacentHTML('beforeend', `
        <div class="generated">
            <p>${url.original}</p>
            <a href="${url.short}" target="_blank">${url.short}</a>
            <p class="copybtn">Copy</p>
        </div>
    `))
    copButtons()
    }
})

async function shortURL(){
    let inputResult = await linkEntered.value;
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${inputResult}`);
    const pResult = await response.json();
    if(pResult.ok){
        urlHistory.push({
            original: `${pResult.result.original_link}`,
            short: `${pResult.result.short_link}`
        });
        localStorage.setItem('history', JSON.stringify(urlHistory));
        let test = localStorage.getItem('history')
        divtoAppend.insertAdjacentHTML('beforeend', `
        <div class="generated">
            <p>${pResult.result.original_link}</p>
            <a href="${pResult.result.short_link}" target="_blank">${pResult.result.short_link}</a>
            <p class="copybtn">Copy</p>
        </div>
    `)
    copButtons()
    linkEntered.value = '';
    }else {
        errorMessage.textContent = 'This is not a valid URL';
        errorMessage.style.display = 'block';
        linkEntered.style.border = '2px solid hsl(0, 87%, 67%)';
        setTimeout(()=>{
            errorMessage.style.display = 'none';
            linkEntered.style.border = 'none'
        }, 2000)
    }
}

shorten.addEventListener('click', ()=>{
    if(linkEntered.value === ''){
        errorMessage.textContent = 'Please add a link';
        errorMessage.style.display = 'block';
        linkEntered.style.border = '2px solid hsl(0, 87%, 67%)';
        setTimeout(()=>{
            errorMessage.style.display = 'none';
            linkEntered.style.border = 'none'
        }, 2000)
    }else {
        shortURL()
    }
});

let copyBtns = document.querySelectorAll('.copybtn');

async function copier(){
    try {
        let wantToCopy = this.previousElementSibling;
        navigator.clipboard.writeText(wantToCopy.textContent)
        this.textContent = 'Copied!';
        this.style.background = 'hsl(257, 27%, 26%)';
    }catch(err){
        console.err('Failed to copy');
    }
}

function copButtons(){
    copyBtns = document.querySelectorAll('.copybtn');
    for(btn of copyBtns){
        btn.addEventListener('click', copier)
    }
}