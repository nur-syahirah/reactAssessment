import React from 'react'
import './Track.css';

function Track({track, addTrack, removeTrack, remove}) {


  //TODO - we need to re-facter the code here
  //TODO - to make the componenet REUSABLE
  function handleAddTrack(event) {
    addTrack(track);
  }

  function handleRemoveTrack(event) {
    removeTrack(track);
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>
          {/* <!-- track name will go here --> */}
          {track.name}
        </h3>
        <p>
          {/* <!-- track artist will go here--> */} {/* <!-- track album will go here --> */}
          {track.artist} | {track.album}
        </p>
      </div>

      {/* <button class="Track-action"><!-- + or - will go here --></button> */}
      { remove 
      ? 
        (<button className="Track-action" onClick={handleRemoveTrack}>-</button>)
        :
        (<button className="Track-action" onClick={handleAddTrack}>+</button>)
      }

    </div>
  )
}

export default Track