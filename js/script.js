const itemList = []
function fillItemList() {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        // console.log(data)
        for (let drink of data.drinks) {
            itemList.push(drink.strDrink)
        }
        createSidebar(itemList)
        toggleSidebar()
        scrollSidebar()
        sidebarTextToBlock()
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}
function createSidebar(items) {
    const navigationList = document.querySelector('.list_container>ul')
    items.forEach(function (item) {
        let menuElement = document.createElement('li')
        menuElement.textContent = item
        navigationList.append(menuElement)
    })
}
function toggleSidebar() {
    const asideButton = document.querySelector('.aside_button')
    const asideBar = document.querySelector('.list_container')
    const scrollButton = document.querySelectorAll('.scroll')
    let hide = true
    asideButton.onclick = function () {
        hide = !hide
        if (hide) {
            asideBar.style.transform = 'translateX(-200px)'
            asideButton.style.transform = 'translateX(-200px)'
            scrollButton.forEach(function (scroll) {
                scroll.style.transform = 'translateX(-200px)'
            })
        } else {
            asideBar.style.transform = 'translateX(0px)'
            asideButton.style.transform = 'translateX(0px)'
            scrollButton.forEach(function (scroll) {
                scroll.style.transform = 'translateX(0)'
            })
        }
    }
}
function scrollSidebar() {
    const scrollButtons = document.querySelectorAll('.scroll')
    const container = document.querySelector('.list_container')
    scrollButtons.forEach(function (scrollButton) {
        scrollButton.addEventListener('click', function () {
            if (scrollButton.getAttribute('data-function') === 'up') {
                container.scrollTop -= 400
                    // (window.innerHeight - 80 - 50 * 2) / 2
            } else if (scrollButton.getAttribute('data-function') === 'down') {
                container.scrollTop += 400
            }
        })
    })
}
function sidebarTextToBlock() {
    const list = document.querySelector('.list_container>ul')    
    list.addEventListener('click', function (e) {
        if (e.target !== list) {
            cocktail = e.target.textContent;
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail.toLowerCase()}`)
            .then(res => res.json())
            .then(data => {
                document.querySelector('.name').textContent = data.drinks[0].strDrink
                document.querySelector('.image').src = data.drinks[0].strDrinkThumb
                document.querySelector('.instructions').textContent = data.drinks[0].strInstructions
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
        }        
    })    
}
function searchToBlock() {  
  console.log('drink')
  document.querySelector('button').addEventListener('click', function() {
        const drink = document.querySelector('input').value;
        if (drink) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
            .then(res => res.json())
            .then(data => {
                if (data.drinks[0].strAlcoholic === "Non alcoholic") {
                    document.querySelector('.name').textContent = data.drinks[0].strDrink;
                    document.querySelector('.image').src = data.drinks[0].strDrinkThumb;
                    document.querySelector('.instructions').textContent = data.drinks[0].strInstructions;  
      
                } else if (data.drinks[0].strAlcoholic === "Alcoholic") {  
                    document.querySelector('.name').textContent = 'Alcohol is BAD, mmkay?';
                    document.querySelector('.image').src = '';
                    document.querySelector('.instructions').textContent = '';
                }
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
        }      
    })
}

fillItemList()
searchToBlock()
