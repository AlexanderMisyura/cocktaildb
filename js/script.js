const itemList = []
function fillItemList() {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {        
        createSidebar(data);
        toggleSidebar();
        scrollSidebar();
        sidebarTextToBlock();
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}
function createSidebar(cocktObj) {
    const navigationList = document.querySelector('.list_container>ul');
    cocktObj.drinks.forEach(function (drink) {
        let menuElement = document.createElement('li');
        menuElement.textContent = drink.strDrink;
        menuElement.dataset.cocktId = drink.idDrink;
        navigationList.append(menuElement);
    })
}
function toggleSidebar() {
    const asideButton = document.querySelector('.aside_button')
    const asideBar = document.querySelector('.list_container')
    const scrollButtons = document.querySelectorAll('.scroll')
    let hide = true
    asideButton.onclick = function () {
        hide = !hide
        if (hide) {
            asideBar.style.transform = 'translateX(-200px)'
            asideButton.style.transform = 'translateX(-200px)'
            scrollButtons.forEach(function (scrollButton) {
                scrollButton.style.transform = 'translateX(-200px)'
            })
        } else {
            asideBar.style.transform = 'translateX(0px)'
            asideButton.style.transform = 'translateX(0px)'
            scrollButtons.forEach(function (scrollButton) {
                scrollButton.style.transform = 'translateX(0)'
            })
        }
    }
}
function scrollSidebar() {
    const scrollButtons = document.querySelectorAll('.scroll')
    const container = document.querySelector('.list_container')
    scrollButtons.forEach(function (scrollButton) {
        scrollButton.addEventListener('click', function () {
            if (scrollButton.dataset.scroll === 'up') {
                container.scrollTop -= 400
                    // (window.innerHeight - 80 - 50 * 2) / 2
            } else if (scrollButton.dataset.scroll === 'down') {
                container.scrollTop += 400
            }
        })
    })
}
function sidebarTextToBlock() {
    const list = document.querySelector('.list_container>ul')    
    list.addEventListener('click', (e) => {
        if (e.target !== list) {
            cocktailID = e.target.dataset.cocktId;
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailID}`)
            .then(res => res.json())
            .then(data => {
                renderCocktails(data);
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
        }        
    })    
}
function searchToBlock() {
  document.querySelector('#getCocktails').addEventListener('click', function() {
        const drink = document.querySelector('input').value;
        if (drink) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
            .then(res => res.json())
            .then(data => {
                if (data.drinks) {
                    data.drinks = data.drinks.filter((drink) => drink.strAlcoholic === "Non alcoholic");
                } else {
                    console.log('no cocktail for your query')
                }
                
                renderCocktails(data);
                    
            })
            .catch(err => {
                console.log(`error ${err}`)
            })
        }      
    })
}

function renderCocktails(cocktObj) {
    console.log(cocktObj);
    if (cocktObj.drinks.length > 0) {
        const items = document.querySelector('.carousel-inner');
        const indicators = document.querySelector('.carousel-indicators');
        const arrows = document.querySelectorAll('.arrow');

        items.innerHTML = '';
        indicators.innerHTML = '';
        indicators.style.display = 'none';
        arrows.forEach((arrow) => arrow.style.display = 'none');
        
        for (let drink of cocktObj.drinks) {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');

            const image = document.createElement('img');
            image.classList.add('d-block', 'w-100');
            image.src = drink.strDrinkThumb;
            carouselItem.appendChild(image);
            items.appendChild(carouselItem);

            const indicator = document.createElement('button');
            indicator.dataset.bsTarget = "#myCarousel";
            indicator.dataset.bsSlideTo = `${cocktObj.drinks.indexOf(drink)}`;
            indicator.setAttribute('aria-label', `Slide ${cocktObj.drinks.indexOf(drink) + 1}`);
            indicator.setAttribute('type', 'button');
            indicators.appendChild(indicator);

            const caption = document.createElement('div');
            caption.classList.add('carousel-caption', 'd-none', 'd-md-block');
            carouselItem.appendChild(caption);
            const cocktName = document.createElement('h5');
            cocktName.textContent = drink.strDrink;
            caption.appendChild(cocktName);

            const ingredients = document.createElement('ul');
            caption.appendChild(ingredients);

            for (let i = 1; drink[`strIngredient${i}`] || drink[`strMeasure${i}`]; i++) {
                const ingredient = document.createElement('li');
                ingredient.textContent = `${drink[`strIngredient${i}`]}: ${drink[`strMeasure${i}`]}`;
                ingredients.appendChild(ingredient);
            }

            const instruction = document.createElement('p');
            instruction.textContent = drink.strInstructions;
            caption.appendChild(instruction);


            // function fillIngrediens() {
            //     const ingreditentList = drink.filter((propName) => propName)
            //     let i = 1;
            //     let ingredientProp = `strIngreient${i}`;
                
            //     while (drink[ingredientProp] !== null) {
                    
            //         i += 1;
            //     }
            // }


            if (drink === cocktObj.drinks[0]) {
                carouselItem.classList.add('active');
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', "true");
            }
        }
        if (cocktObj.drinks.length > 1) {
            indicators.style.display = 'flex';
            arrows.forEach((arrow) => arrow.style.display = 'flex');            
        }
        // document.querySelector('.name').textContent = cocktObj.drinks[0].strDrink;
        // document.querySelector('.image').src = cocktObj.drinks[0].strDrinkThumb;
        // document.querySelector('.instructions').textContent = cocktObj.drinks[0].strInstructions;  

    } else {
        console.log('no Non-alcoholic cocktail for your query');
    }
}


fillItemList();
searchToBlock();
