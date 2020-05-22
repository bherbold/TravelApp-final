/* Function to GET Web API Data IMG*/
const getWiki = async (baseURL,lat, lng)=>{

    const res = await fetch(baseURL + 'lat=' + lat + '&lng=' + lng + '&username=b1234');
  
    try {
      const data = await res.json();
      console.log(data)
      const newData = { wiki: data }
      
      return newData;
  
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }

//function to update the UI with the current Weather report
const WikiUpdateUI = async() => {
    const request = await fetch('http://localhost:8081/wikiData');
    try{
        
        const allData = await request.json();
        console.log('UPDATING UI WIKI')
        console.log(allData.wiki);
        let fraction = document.createDocumentFragment('div');

        //document.getElementById('weather').innerHTML
        const newEl = document.createElement('div')
        newEl.innerHTML = `<div id="newWiki" >${allData.wiki}</div> `
        newEl.classList.add("WikiOUTER")
        fraction.appendChild(newEl);
        document.getElementById('wiki').innerHTML = "";
        document.getElementById('wiki').appendChild(fraction);
    }catch(error){
        console.log("error", error);
      }
}