let peliculas = [];



document.addEventListener("DOMContentLoaded", () => {

    fetch('https://japceibal.github.io/japflix_api/movies-data.json') // repaso función fetch y pauta 1
    .then(response => response.json())
    .then(data => {
        peliculas = data;
        console.log('Películas cargadas:', peliculas); 
    })
    .catch(error => console.error('Error al cargar las películas:', error));


})

// Función para generar estrellas según el valor de vote_average
 function generarEstrellas(vote) {
    const estrellasMax = 5;
    const estrellas = Math.round(vote / 2); // vote_average es sobre 10, se divide entre 2 para estrellas sobre 5.
  let estrellasHTML = '';
  for (let i = 0; i < estrellasMax; i++) {
    if (i < estrellas) {
        estrellasHTML += '<i class="bi bi-star-fill text-warning"></i>'; // Estrella llena
    } else {
        estrellasHTML += '<i class="bi bi-star text-warning"></i>'; // Estrella vacía
    }
}
return estrellasHTML;
}

// Función para manejar la búsqueda
function buscarPeliculas() {
    const searchValue = document.getElementById('inputBuscar').value.toLowerCase();
    const resultados = peliculas.filter(pelicula =>
        pelicula.title.toLowerCase().includes(searchValue) ||
        (Array.isArray(pelicula.genres) && pelicula.genres.some(genre => typeof genre === 'string' && genre.toLowerCase().includes(searchValue))) ||
        (pelicula.tagline && pelicula.tagline.toLowerCase().includes(searchValue)) ||
        (pelicula.overview && pelicula.overview.toLowerCase().includes(searchValue))
    );

    mostrarResultados(resultados);
}

// Función para mostrar los resultados
function mostrarResultados(resultados) {
    const lista = document.getElementById('lista');
    lista.innerHTML = ''; // Limpiar resultados previos

    if (resultados.length === 0) {
        lista.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    resultados.forEach(pelicula => {
        const peliculaHTML = `
            <li class="list-group-item list-group-item-action">
                <h5>${pelicula.title}</h5>
                <p>${pelicula.tagline || 'Sin tagline'}</p>
                <p>${generarEstrellas(pelicula.vote_average)}</p>
                <button class="btn btn-info" onclick="mostrarDetalles(${pelicula.id})">Ver detalles</button>
            </li>
        `;
        lista.innerHTML += peliculaHTML;
    });
}

// Función para mostrar detalles adicionales de una película
function mostrarDetalles(id) {
    const pelicula = peliculas.find(p => p.id === id);
    let generos = pelicula.genres.map(genre => genre.name).join(', ');

    const detalleHTML = `
        <div class="container bg-light p-4 mb-4" id="detalle">
            <h2>${pelicula.title}</h2>
            <p><strong>Resumen:</strong> ${pelicula.overview}</p>
            <p><strong>Géneros:</strong> ${generos}</p>

            <button class="btn btn-secondary mt-3" type="button" data-bs-toggle="collapse" data-bs-target="#detallesAdicionales" aria-expanded="false" aria-controls="detallesAdicionales">
                Más detalles
            </button>
            <div class="collapse" id="detallesAdicionales">
                <div class="card card-body mt-3">
                    <p><strong>Año de lanzamiento:</strong> ${new Date(pelicula.release_date).getFullYear()}</p>
                    <p><strong>Duración:</strong> ${pelicula.runtime} minutos</p>
                    <p><strong>Presupuesto:</strong> $${pelicula.budget.toLocaleString()}</p>
                    <p><strong>Ganancias:</strong> $${pelicula.revenue.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;

    const detalleContainer = document.querySelector('main');
    const previoDetalle = document.getElementById('detalle');
    
    // Si ya hay un detalle mostrado, lo reemplazamos
    if (previoDetalle) {
        previoDetalle.remove();
    }

    // Insertar el nuevo detalle en la parte superior del main
    detalleContainer.insertAdjacentHTML('afterbegin', detalleHTML);
}

// Agregar el evento al botón "Buscar"
document.getElementById('btnBuscar').addEventListener('click', () => {
    const searchValue = document.getElementById('inputBuscar').value.trim();
    console.log('Valor ingresado en búsqueda:', searchValue); // Verifica el valor del input

    if (searchValue !== '') {
        buscarPeliculas(); // Llama a la función de búsqueda si el input no está vacío
    } else {
        alert('Por favor, ingrese un valor para buscar.');
    }
});