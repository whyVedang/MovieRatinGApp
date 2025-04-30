import React from 'react'

function MovieCard({movie}) {
  return (
    <>
      <div className="Card">
        <div className='Poster'>
          <img alt='Imagehere'></img>
          <div className="Overlay">
            ❤️
          </div>
        </div>
        <div className='Description'>
          Desciption
          <h2>{movie.title}</h2>
          <p>{movie.duration}</p>
          <p>{movie.actors}</p>
          <p>{movie.description}</p>
        </div>
      </div>
    </>
  )
}

export default MovieCard