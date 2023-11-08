const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2RiMDc1NmFhYjVmNmJiM2U5YmFlNDM3NmIzNGVlMCIsInN1YiI6IjY1NDI5MTE5YTU4OTAyMDE1N2Q0MDZhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1R05w7B8DOpyfGmMoBjv1cEJmNwe4nGy8629sd2kPSM'
    }
  };
const errorHandler = (error)=> console.log(error);

  function apitmdb(id) {
    const section__api = document.querySelector("#section__api");
    section__api.style["display"]="block";
    //busca la película en base al id de imdb - metodo find by ID
    const apiURL = 'https://api.themoviedb.org/3/find/'+id+'?external_source=imdb_id&language=es-ES';
  fetch(apiURL, options)
    .then(response => response.json())
    .then(response => {
      resultado_pelicula = (({id, title, original_title,overview,poster_path,popularity,release_date,vote_average,vote_count }) => ({id, title, original_title,overview,poster_path,popularity,release_date,vote_average,vote_count }))(response.movie_results[0]);
      console.log(resultado_pelicula);
      console.log(response.status);
      buscarCreditosPeli(id);
      dibujarDatosApi(resultado_pelicula);
    } )
    .catch(err => console.error(err));
  }

  function buscarCreditosPeli(id) {
    const apiURL='https://api.themoviedb.org/3/movie/'+id+'/credits?language=es-ES';
    fetch(apiURL, options)
    .then(response => response.json())
    .then(response => {
      const cast = response.cast;
      cast.splice(10);

      console.log("en funcion dibujar creditos CAST ",cast);
      const crew =response.crew;
      crew.splice(2);
      console.log("en funcion dibujar créditos CREW ",crew);
      let i=0;
      const cast_resumido = [];
      cast.forEach((elemento) => {
      cast_resumido[i] = (({id, name, original_name, popularity,profile_path,character }) => ({id,name, original_name, popularity,profile_path,character }))(elemento);
      console.log('cast resumido ',cast_resumido[i]);
      i++;
    });
      let j=0;
      const crew_resumido = [];
      crew.forEach((elemento) => {
      crew_resumido[i] = (({id, name, original_name, popularity,profile_path,job }) => ({id,name, original_name, popularity,profile_path,job }))(elemento);
      console.log('crew resumido ',crew_resumido[i]);
      j++;
    });
    dibujarCast(cast_resumido);
    dibujarCrew(crew_resumido);
      buscarInfoActores(cast);
      buscarInfoDirectores(crew);
      
      
    } )
    .catch(err => errorHandler(err));
  }

  function buscarInfoActores(cast) {
    cast.forEach((persona) => 
    {
      const apiURL = 'https://api.themoviedb.org/3/person/'+persona.id+'?language=es-ES';
      fetch(apiURL, options)
  .then(response => response.json())
  .then(response => mostrarPerfil(response))
  .catch(err => errorHandler(err));
  });
  }
  function mostrarPerfil(id) {
    
  }

  function buscarInfoDirectores(crew) {
    crew.forEach((persona) => 
    {
      const apiURL = 'https://api.themoviedb.org/3/person/'+persona.id+'?language=es-ES';
      fetch(apiURL, options)
  .then(response => response.json())
  .then(response => mostrarPerfil(response))
  .catch(err => errorHandler(err));
  });
  }
  function mostrarPerfil(id) {
    
  }

  function dibujarDatosApi(resultado) {
    console.log("en funcion dibujarDatosApi");
    
    let datos_movie = "<div><h3>Datos de película</h3>";
    Object.entries(resultado).forEach(([key,value]) => {
      console.log("key: ",key,"value: ",value);
      datos_movie += "<p>"+ key + ": "+ value +"</p>";
    })
    datos_movie +="</div>";
    section__api.innerHTML=`
    
    ${datos_movie}
    
    <div id="actores"></div>
    <div id="directores"></div>`;
  }
  function dibujarCast(resultado) {
    console.log("en funcion dibujarCast");
    const section__actores = document.querySelector("#actores");
    let creditos="<h3>Listado de actores</h3>";
    resultado.forEach((elemento) => {
      creditos += "<h2>Actor: "+elemento.name+"</h2>"
      Object.entries(elemento).forEach(([key,value]) => {
        console.log("key: ",key,"value: ",value);
        creditos += "<p>"+ key + ": "+ value +"</p>";
      });
    });
      
    
    section__actores.innerHTML=`
    ${creditos}`;
  }
  function dibujarCrew(resultado) {
    console.log("en funcion dibujarCast");
    const section__directores = document.querySelector("#directores");
    let creditos="<h3>Listado de directores y escritores</h3>";
    resultado.forEach((elemento) => {
      creditos += "<h2>Director: "+elemento.name+"</h2>"
      Object.entries(elemento).forEach(([key,value]) => {
        console.log("key: ",key,"value: ",value);
        creditos += "<p>"+ key + ": "+ value +"</p>";
      });
    });
      
    
    section__directores.innerHTML=`
    ${creditos}`;
  }

  //RESULTADO apitmdb
  // {
  //   "movie_results": [
  //     {
  //       "adult": false,
  //       "backdrop_path": "/2hMt6zKQsvYvH3ZRe8T6RzAD2XB.jpg",
  //       "id": 87,
  //       "title": "Indiana Jones y el templo maldito",
  //       "original_language": "en",
  //       "original_title": "Indiana Jones and the Temple of Doom",
  //       "overview": "1935. Shanghai. El intrépido arqueólogo Indiana Jones, tras meterse en jaleos en un local nocturno, consigue escapar junto a una bella cantante y su joven acompañante. Tras un accidentado vuelo, los tres acaban en la India, donde intentarán ayudar a los habitantes de un pequeño poblado, cuyos niños han sido raptados.",
  //       "poster_path": "/tLEaz41vKyKY7AgCTGgijLGWzbk.jpg",
  //       "media_type": "movie",
  //       "genre_ids": [
  //         12,
  //         28
  //       ],
  //       "popularity": 49.536,
  //       "release_date": "1984-05-23",
  //       "video": false,
  //       "vote_average": 7.294,
  //       "vote_count": 8561
  //     }
  //   ],
  //   "person_results": [],
  //   "tv_results": [],
  //   "tv_episode_results": [],
  //   "tv_season_results": []
  // }

//busca los creditos en base al id de la peli en tmdb

  
  //busca info de los actores en base a los id conseguidos en el fetch anterior
  //RESULTADO
  //con el profile path busco la foto de la cara en esta ruta: https://www.themoviedb.org/t/p/w276_and_h350_face/5M7oN3sznp99hWYQ9sX0xheswWX.jpg
  // {
  //   "id": 87,
  //   "cast": [
  //     {
  //       "adult": false,
  //       "gender": 2,
  //       "id": 3,
  //       "known_for_department": "Acting",
  //       "name": "Harrison Ford",
  //       "original_name": "Harrison Ford",
  //       "popularity": 61.496,
  //       "profile_path": "/5M7oN3sznp99hWYQ9sX0xheswWX.jpg",
  //       "cast_id": 4,
  //       "character": "Indiana Jones",
  //       "credit_id": "52fe4215c3a36847f8002c09",
  //       "order": 0
  //     },


  //     {
  //       "adult": false,
  //       "gender": 2,
  //       "id": 20820,
  //       "known_for_department": "Acting",
  //       "name": "Sidney Ganis",
  //       "original_name": "Sidney Ganis",
  //       "popularity": 0.861,
  //       "profile_path": "/n58nnoTiq0V9fmILZxY3lvuAam5.jpg",
  //       "cast_id": 113,
  //       "character": "Missionary (uncredited)",
  //       "credit_id": "5f47287d8efe730036bc8fc8",
  //       "order": 67
  //     },

  //   ],
  //   "crew": [
  //     {
  //       "adult": false,
  //       "gender": 2,
  //       "id": 1,
  //       "known_for_department": "Directing",
  //       "name": "George Lucas",
  //       "original_name": "George Lucas",
  //       "popularity": 23.988,
  //       "profile_path": "/WCSZzWdtPmdRxH9LUCVi2JPCSJ.jpg",
  //       "credit_id": "52fe4215c3a36847f8002c45",
  //       "department": "Production",
  //       "job": "Executive Producer"
  //     },
  //
  //   ]
  // }

  //busca info de cada actor en base a los credits de la peli
  
  // {
  //   "adult": false,
  //   "also_known_as": [
  //     "Timothy Allen Dick",
  //     "Timothy Dick"
  //   ],
  //   "biography": "",
  //   "birthday": "1953-06-13",
  //   "deathday": null,
  //   "gender": 2,
  //   "homepage": "http://www.timallen.com/",
  //   "id": 12898,
  //   "imdb_id": "nm0000741",
  //   "known_for_department": "Acting",
  //   "name": "Tim Allen",
  //   "place_of_birth": "Denver, Colorado, USA",
  //   "popularity": 36.553,
  //   "profile_path": "/woWhZzFILVhYMAvsPL171HjMY0y.jpg"
  // }

  