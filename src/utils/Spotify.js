let accessToken = "";

// const Spotify stores function objects
const Spotify = {
    
    async getAccessToken(){   // getAccessToken Function Object creates the accessToken if not found

       const clientId = "b8f8f975a565402782727a951873bf8b"; 
       const clientSecret = "b7219ce3467640a6b9bf3c9b2c23dd0a";  

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            }),
        });
    
        const data = await response.json();
        console.log(data.access_token)
        return data.access_token; // Returns the access token

    },
    async search(term){ // search Function Object takes in a term to search for

        if(term === null || term === undefined || term === "" )
            return;

        const accessToken = await Spotify.getAccessToken();
        
        return await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then((response)=> response.json())
        .then((jsonResponse)=>{
            if(!jsonResponse)
                console.log("Response error");  // Response returned from spotify is erroneous

            return jsonResponse.tracks.items.map((t) => ({
                id: t.id,
                name: t.name,
                artist: t.artists[0].name,
                album: t.album.name,
                uri: t.uri
            }));
        })
    },
    savePlayList(name, tracksUris){     // savePlayList takes in the name and the Uri of the track to save

        if(!name || !tracksUris)
            return;

        const token = Spotify.getAccessToken();                                                             // Spotify.getAccessToken() remembers me, based on my ClientID
        const header = {Authorization: `Bearer ${token}`};
        let userId = "";

        // Implicit grant (below) no longer applies for new Spotify apps (since 9th Apr 25)
        // As future reference to incorporate Authorization Code Grants instead
        // refer to article: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization
        return fetch(`https://api.spotify.com/v1/me`, {headers: header})                                     // fetch my profile
                .then((response) => response.json())
                .then((jsonResponse)=>{
                    userId = jsonResponse.id;                                                               // process the response of my own ID
                    let playlistId = "";
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {                  // fetch playlist of my profile and store the name of my new playlist
                        headers: header, 
                        method: "post", 
                        body: JSON.stringify({name: name})})
                            .then((response)=> response.json())
                            .then((jsonResponse)=>{
                                playlistId = jsonResponse.id;
                                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { // fetch new playlist of my profile and store the songs
                                    headers: header,
                                    method: "POST",
                                    body: JSON.stringify({uris: tracksUris})
                                })
                            })
                });
    }
};
        
export {Spotify};