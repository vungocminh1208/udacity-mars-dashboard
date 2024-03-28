let store = {
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: []
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { apod, rovers, photos } = state

    return `
        <header></header>
        <main>
            <section>
                ${ImageOfTheDay(apod)}
            </section>
            <section>
                ${DisplayRover(rovers[0], photos)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
// const Greeting = (name) => {
//     if (name) {
//         return `
//             <h1>Welcome, ${name}!</h1>
//         `
//     }

//     return `
//         <h1>Hello!</h1>
//     `
// }

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()

    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
        `)
    }
}

const DisplayRover = (roverName, photos) => {
    if (photos.length === 0) {
        getRovers(roverName)
    } 
    return (`
    ${photos.map((photo, i) => (`<div>
            <p>Picture number ${i+1}</p>
            <p>id: ${photo.id}</p>
            <img src="${photo.img_src}" alt="image here"/>
        </div>`))
    }`)
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}

const getRovers = (roverName) => {
    fetch(`http://localhost:3000/rovers/${roverName}`)
        .then(res => res.json())
        .then(data => updateStore(store, {photos: [...data.photos]}))
}