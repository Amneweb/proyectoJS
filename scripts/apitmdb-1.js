const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2RiMDc1NmFhYjVmNmJiM2U5YmFlNDM3NmIzNGVlMCIsInN1YiI6IjY1NDI5MTE5YTU4OTAyMDE1N2Q0MDZhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1R05w7B8DOpyfGmMoBjv1cEJmNwe4nGy8629sd2kPSM'
  }
};
const section__api = document.querySelector("#section__api");
const boton_cerrar = document.querySelector(".section__api--cerrar");
boton_cerrar.addEventListener("click", () => {
  showError.innerHTML = "";
  datosPelicula.innerHTML = "";
  section__api.style['display'] = "none";
});

const loader = document.querySelector(".loader");
const showError = document.querySelector("#showError");
const datosPelicula = document.querySelector("#datosPelicula");
const errorHandler = (error) => {
  showError.innerHTML = "<p>Lo sentimos, hubo un error en la carga de datos.</p><p>Mensaje de error del sistema: '" + error + "'</p>";
};
let resultado_pelicula = {};
async function apitmdb(id) {

  section__api.style["display"] = "block";


  const apiURL = 'https://api.themoviedb.org/3/find/' + id + '?external_source=imdb_id&language=es-ES';
  await fetchapitmdb(apiURL);



}
const fetchapitmdb = async (apiURL) => {
  loader.style['display'] = "block";
  await fetch(apiURL, options)
    .then(async (response) => await response.json())
    .then(async (response) => {
      resultado_pelicula = (({ id, title, original_title, overview, poster_path, popularity, release_date, vote_average, vote_count }) => ({ id, title, original_title, overview, poster_path, popularity, release_date, vote_average, vote_count }))(response.movie_results[0]);
      dibujarDatosApi(resultado_pelicula);
      await buscarCreditosPeli(resultado_pelicula.id);
    })
    .catch((error) => {
      errorHandler(error);
    })
    .finally(loader.style['display'] = "none");
}

async function buscarCreditosPeli(id) {
  loader.style['display'] = "block";
  const apiURL = 'https://api.themoviedb.org/3/movie/' + id + '/credits?language=es-ES';
  await fetch(apiURL, options)
    .then(async (response) => await response.json())
    .then(response => {
      const cast = response.cast;
      cast.splice(10);
      const crew = response.crew;
      const director = crew.find(({ job }) => job === "Director");
      let i = 0;
      const cast_resumido = [];
      cast.forEach((elemento) => {
        cast_resumido[i] = (({ id, name, original_name, popularity, profile_path, character }) => ({ id, name, original_name, popularity, profile_path, character }))(elemento);
        i++;
      });


      dibujarCast(cast_resumido, director);




    })
    .catch(error => errorHandler(error))
    .finally(loader.style['display'] = "none");
}

async function buscarInfoActores(id) {

  const apiURL = 'https://api.themoviedb.org/3/person/' + id + '?language=es-ES';
  await fetch(apiURL, options)
    .then(async (response) => await response.json())

    .then((response) => {
      const perfil = (({ id, name, biography, birthday, homepage, popularity, place_of_birth, profile_path }) => ({ id, name, biography, birthday, homepage, popularity, place_of_birth, profile_path }))(response);
      mostrarPerfil(perfil);
    })
    .catch((error) => errorHandler(error));

}
function mostrarPerfil(persona) {
  let datos_perfil = "<h3>Perfil del actor / director</h3>";
  Object.entries(persona).forEach(([key, value]) => {
    datos_perfil += "<p>" + key + ": " + value + "</p>";
  })
  const divDatosPerfil = document.querySelector("#perfil" + persona.id);
  divDatosPerfil.innerHTML = datos_perfil;
  divDatosPerfil.style['display'] = 'block';

}

function buscarInfoDirectores(crew) {
  crew.forEach((persona) => {
    const apiURL = 'https://api.themoviedb.org/3/person/' + persona.id + '?language=es-ES';
    fetch(apiURL, options)
      .then(response => response.json())
      .then(response => mostrarPerfil(response))
      .catch(err => errorHandler(err));
  });
}


function dibujarDatosApi(resultado) {
  let datos_movie = "<div><h3>Datos de película</h3>";
  Object.entries(resultado).forEach(([key, value]) => {
    datos_movie += "<p>" + key + ": " + value + "</p>";
  })
  datos_movie += "</div>";
  datos_movie += "<div id='actores'></div><div id='directores'></div>";
  datosPelicula.innerHTML = datos_movie;

}
function dibujarCast(resultado, director) {
  const section__actores = document.querySelector("#actores");
  let creditos = "<h2>Director</h2>";
  Object.entries(director).forEach(([key, value]) => {
    creditos += "<p>" + key + ": " + value + "</p>";
  });
  creditos += "<div><button class='boton-ver-mas' id='actor_" + director.id + "'>Ver datos del director</button></div><div class='perfilActor' id='perfil" + director.id + "'></div>";
  creditos += "<h2>Listado de actores</h2>";
  resultado.forEach((elemento) => {
    creditos += "<h3>Actor: " + elemento.name + "</h3>"
    Object.entries(elemento).forEach(([key, value]) => {
      creditos += "<p>" + key + ": " + value + "</p>";
    });
    creditos += "<div><button class='boton-ver-mas' id='actor_" + elemento.id + "'>Ver datos del actor</button></div><div class='perfilActor' id='perfil" + elemento.id + "'></div>";
  });


  section__actores.innerHTML = `
    ${creditos}`;
  botonesActores = document.querySelectorAll(".boton-ver-mas");
  botonesActores.forEach((elemento) => {
    const newID = elemento.id.split("_").pop();
    elemento.addEventListener("click", () => buscarInfoActores(newID));
  })
}

