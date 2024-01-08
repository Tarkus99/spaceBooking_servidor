let weekPagination = 0;
const spacesContainer = document.querySelector('.spacesContainer');
const infoContainer = document.querySelector('.weekInfo')


spacesContainer.addEventListener('click', async (e) => {
    if (e.target.hasAttribute('space')) {
        infoContainer.innerHTML = '';
        await getIntervals();
        const string = 'http://localhost:4000/serviceReserva/services/info.service';
        const url = new URL(string)
        url.searchParams.set('page', weekPagination);
        url.searchParams.set('space', e.target.dataset.id);
        const response = await fetch(url)
        const info = await response.json();
        showInfo(info)
    }
})

async function getIntervals() {
    try {
        const response = await fetch('http://localhost:4000/serviceReserva/services/intervals.service');
        const intervals = await response.json();
        showIntervals(intervals)
    } catch (error) {
        console.log(error);
    }
}


function showIntervals(vector) {
    const intervalContainer = document.querySelector('.weekIntervals');
    intervalContainer.innerHTML = '';
    for (const i of vector) {
        const element = document.createElement('div')
        element.classList.add('p-2', 'rounded', 'bg-blue-100', 'text-center')
        element.innerText = i.horaInicio + " - " + i.horaFin;
        intervalContainer.appendChild(element);
    }
}

function showInfo(vector) {
    for (let i = 0; i < vector.length; i++) {
        for (let ii = 0; ii < vector[i].length; ii++) {
            const info = vector[i][ii]
            let content = info.id ? 'ocupado' : 'libre';
            const element = document.createElement('div')
            element.classList.add('p-2', 'text-center', `row-start-${ii+1}`, `row-span-${info.span || 1}`, `col-start-${i+1}`, content)
            element.innerText = content
            infoContainer.appendChild(element)
            ii += info.span - 1 || 0;
        }
    }
}