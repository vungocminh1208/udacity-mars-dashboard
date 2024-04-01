let store = {
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: [],
    selectedRover: 'Curiosity',
    roverInfo: {}
}

// add our markup to the page
const root = document.getElementById('root')
const onChangeRover = (roverName) => {
    updateStore(store, {selectedRover: roverName})
}

const formatDayOfDate = (day) => {
    switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
    }
}

const changeToFormalDate = (date) => {
    const parts = date.split('-');
    const monthNames =  [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
    let year = parts[0];
    let month = parts[1];
    let day = parts[2];

    return `the ${formatDayOfDate(day)} of ${monthNames[Number(month) - 1]}, ${year}`
}

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { apod, rovers, photos, selectedRover, roverInfo } = state

    return `
        <header>
            ${DisplayRoverNav(rovers, selectedRover)}
        </header>
        <main id="rover-main">
            <section id="rover-info" class="m-5 text-white">
                ${DisplayRoverInfo(selectedRover, roverInfo)}
            </section>
            <section id="recent-photo" class="text-white">
                ${DisplayLatestPhotos(selectedRover, photos)}
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

//display rover nav bar
const DisplayRoverNav = (rovers, selectedRover) => {
        return (`
        ${rovers.map(e => (`
            <div id="${e}" class="m-1 p-1 cursor-pointer rover ${selectedRover === e ? 'selected' : ''}" onClick="onChangeRover(id)">${e}</div>`))}
        `)
}

//display general info about rover
const DisplayRoverInfo = (roverName, roverInfo) => {
    const isInfoTheSameRover = roverInfo?.name === roverName
    if (!isInfoTheSameRover) {
        getRoverInfo(roverName.toLowerCase())
    }

    return(`
    <div class="rover-general">
        <p>${roverInfo.name}</p>
        <img src="./assets/images/${roverInfo.name}.jpg" alt="">
        <div>
            <p>launch date: ${changeToFormalDate(roverInfo.launch_date)}</p>
            <p>landing date: ${changeToFormalDate(roverInfo.landing_date)}</p>
            <p>status: ${roverInfo.status}</p>
        </div>
    </div>
    `)
}

//display item of photos
const DisplayLatestPhotos = (roverName, photos) => {
    const firstElement = photos[0]
    const isPhotosOfSameRover = firstElement?.rover.name === roverName
    if (!isPhotosOfSameRover) {
        getLatestPhotos(roverName.toLowerCase())
    }
    return (`
    ${photos.map((photo) => (`
        <div class="photo-info p-1 m-1">
            <img src="${photo.img_src}" alt="">
            <p>From: ${photo.camera.full_name}</p>
            <p>Earth date: ${changeToFormalDate(photo.earth_date)}</p>
        </div>
        `))}
    `)
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}

//get rover info
const getRoverInfo = (roverName) => {
    fetch(`http://localhost:3000/rover-info/${roverName}`)
        .then(res => res.json())
        .then(data => updateStore(store, {roverInfo: data.rover}))
}

//get latest photos of each rover
const getLatestPhotos = (roverName) => {
    fetch(`http://localhost:3000/latest-photos/${roverName}`)
        .then(res => res.json())
        .then(data => updateStore(store, {photos: data.latest_photos}))
}

//--------------------------------support----------------------
