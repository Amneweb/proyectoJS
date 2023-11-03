const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2RiMDc1NmFhYjVmNmJiM2U5YmFlNDM3NmIzNGVlMCIsInN1YiI6IjY1NDI5MTE5YTU4OTAyMDE1N2Q0MDZhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1R05w7B8DOpyfGmMoBjv1cEJmNwe4nGy8629sd2kPSM'
    }
  };
const errorHandler = (error)=> console.log(error);

  function apitmdb(id) {
    //busca la película en base al id de imdb - metodo find by ID
    const apiURL = 'https://api.themoviedb.org/3/find/'+id+'?external_source=imdb_id&language=es-ES';
  fetch(apiURL, options)
    .then(response => response.json())
    .then(response => buscarCreditosPeli(response.movie_results[0].id))
    .catch(err => console.error(err));
  }
  //RESULTADO
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
function buscarCreditosPeli(id) {
  const apiURL='https://api.themoviedb.org/3/movie/'+id+'/credits?language=es-ES';
  fetch(apiURL, options)
  .then(response => response.json())
  .then(response => {
    console.log(response.cast);
    buscarInfoActores(response.cast); 
  } )
  .catch(err => errorHandler(err));
}
  
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
  function buscarInfoActores(cast) {
    cast.forEach((actor) => 
    {
      const apiURL = 'https://api.themoviedb.org/3/person/'+actor.id+'?language=es-ES';
      fetch(apiURL, options)
  .then(response => response.json())
  .then(response => mostrarPerfil(response))
  .catch(err => errorHandler(err));
  });
  }
  function mostrarPerfil(id) {
    console.log(id)
  }
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

  