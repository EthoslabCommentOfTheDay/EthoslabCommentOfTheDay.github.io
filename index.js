var book = document.getElementById("pages")
var index = [] //search index

//fusejs options
const options = {
  isCaseSensitive: false,
  findAllMatches: true,
  includeMatches: true,
  includeScore: true,
  useExtendedSearch: false,
  minMatchCharLength: 5,
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  keys: [
    "url",
    "seriesNumber",
    "title",
    "cotd.question",
    "cotd.answer",
  ]
};


//set up book
Object.keys(lplist).forEach((key)=>{
  index.push(lplist[key])
  if(lplist[key].cotd !== undefined){
    pgQ = document.createElement("DIV")
    pgQ.classList.add("page")
    pgA = document.createElement("DIV")
    pgA.classList.add("page")
    txtQ = document.createElement("P")
    txtA = document.createElement("P")
    txtQ.innerHTML = `Episode ${lplist[key].seriesNumber}: ${lplist[key].title} <br><br>`
    lplist[key].cotd.forEach((entry, j)=>{
      txtQ.innerHTML = txtQ.innerHTML.concat(`Question ${j+1}: <br> ${entry.question} <br> -${entry.qname} <br><br>`)
      txtA.innerHTML = txtA.innerHTML.concat(`Answer ${j+1}: <br> ${entry.answer} <br><br>`)
    })
    pgQ.appendChild(txtQ)
    pgA.appendChild(txtA)
    book.appendChild(pgQ)
    book.appendChild(pgA)
  }
})
pgEnd = document.createElement("DIV")
pgEnd.classList.add("backCover")
pgEnd.classList.add("page")
book.appendChild(pgEnd)

//create search
const fuse = new Fuse(index, options)


var pages = document.getElementsByClassName('page');
for(var i = 0; i < pages.length; i++){
    var page = pages[i];
    if (i % 2 === 0)
      {
        page.style.zIndex = (pages.length - i);
      }
  }
  


document.addEventListener('DOMContentLoaded', function(){
    for(var i = 0; i < pages.length; i++)
      {
        pages[i].pageNum = i + 1;
        pages[i].onclick=function(e)
          {
            if(e.target.nodeName == "DIV" || e.target.nodeName == "P"){
              if (this.pageNum % 2 === 0)
                {
                  this.classList.remove('flipped');
                  this.previousElementSibling.classList.remove('flipped');
                }
              else
                {
                  this.classList.add('flipped');
                  this.nextElementSibling.classList.add('flipped');
                }
              if(this.pageNum == 1 || this.pageNum == 4){
                tmp = document.getElementsByClassName("searchBox")[0]
                tmp.value != "" ? tmp.value = "" : {}
		document.querySelectorAll('.searchResult').forEach(e => e.remove());
                tmp.focus()
              }
            }else if(e.target.nodeName == "INPUT"){
            }else if(e.target.nodeName = "BUTTON"){
              if(parseInt(e.target.id)>222){
		      alert("That episode hasn't been transcribed yet, sorry :(")
	      }else{
		for(i=0; i<(parseInt(e.target.id)-204)*2+4; i++){
			pages[i].classList.add("flipped")
		}
	      }
            }
          }
      }
      if(window.location.search!=""){
	      let ept = 0;
	      switch(window.location.search.substr(1).split("=")[0]){
			case "page":
				ept = parseInt(window.location.search.substr(1).split("=")[1])
				break;
			case "episode":
				ept = (parseInt(window.location.search.substr(1).split("=")[1])-204)*2+4
				break;
	      }
	      
	      for(i=0; i< Math.ceil(ept/2)*2; i++){
			pages[i].classList.add("flipped")
		}
      }
      
	
	document.getElementsByClassName("searchBox")[0].addEventListener('keydown', (e)=>{
		resList = fuse.search(document.getElementsByClassName("searchBox")[0].value)
		let i = 0;
		let end =  0;
		if (resList.length >0){
			resList.length > 10 ? end = 10 : end = resList.length;
			document.querySelectorAll('.searchResult').forEach(e => e.remove());
		}
		
		for(i=0; i<end; i++){
			resX = document.createElement("BUTTON")
			resX.classList.add("searchResult")
			resX.type = "button"
			resX.id = resList[i].item.seriesNumber
			resX.innerHTML = `Episode ${resList[i].item.seriesNumber}: ${resList[i].item.title}`
			pages[2].appendChild(resX)
		}
	})
	document.getElementById("jBegin").addEventListener('click', (e)=>{
		Object.keys(pages).forEach(key=>{
			pages[key].classList.remove("flipped")
		})
	})
	document.getElementById("jEnd").addEventListener('click', (e)=>{
		Object.keys(pages).forEach(key=>{
			pages[key].classList.add("flipped")
		})
	})
	document.getElementById("cpLink").addEventListener('click', (e)=>{
		let found = false
		Object.keys(pages).forEach(key=>{
			if(found == false && !pages[key].classList.contains("flipped")){
				found = key
			}
		})
		var dummy = document.createElement('input'),
		    text = found==false? `https://ethoslabcommentoftheday.github.io?page=50`:`https://ethoslabcommentoftheday.github.io?page=${found}`;

		document.body.appendChild(dummy);
		dummy.value = text;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
		document.getElementById("cpLink").innerText = "Copied!"
		setTimeout(()=>{
			document.getElementById("cpLink").innerText = "Copy Link to Current Page"
		},2000)
	})
	
	
      
})

