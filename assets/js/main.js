$(function () {
  setTimeout(function () {
  $('.loader_bg').fadeToggle();
}, 1500);
});
window.onerror=function(msg,url,line){
  console.log("Message:" + msg);
  console.log("Url:" + url);
  console.log("On line:" + line);
}
//ajax za meni
$(document).ready(function(){
  $.ajax({
    url:"assets/data/meni.json",
    method:"get",
    dataType:"json",
    success:function(nizPodataka){
      ispisMenija(nizPodataka);
    },
    error:function(xhr){
      console.log(xhr);
    }
  })
})
//ajxa za ostali json
function ajaxCall(url,result){
  $(document).ready(function(){
    $.ajax({
      url:url,
      method:"get",
      dataType:"json",
      success:result,
      error:function(xhr){
        console.log(xhr);
      }
    })
  })
}
//ispsi menija
  function ispisMenija(nizMeni){
   // let navigacija=document.querySelector("#nav");
    let html='';
    for (let obj of nizMeni) {
      html+=`<li class="nav-item">
             <a class="nav-link" aria-current="page" href="${obj.href}">${obj.tekst}</a>
             </li>`;
    }
    $("#nav").html(html);
    prikaziBrojCrtanih();
}
//povratak na vrh stranice
$(window).scroll(function() {
  if ($(this).scrollTop()) {
      $('#toTop').fadeIn();
  } else {
      $('#toTop').fadeOut();
  }
});
$("#toTop").click(function() {
  $("html, body").animate({scrollTop: 0}, 1000);
});
//ispitivanje da li je index starnica
if(window.location.href=="https://childhood1.netlify.app" || window.location.href=="https://childhood1.netlify.app/index.html"){
ajaxCall("assets/data/crtaci.json",function(result){
  ispisTopListe(result);
})
function ispisTopListe(nizListe){
  let lista=document.querySelector("#lista");
  let sadzaj='';
  for (let s of nizListe){
    if(s==nizListe[8]){
      break;
    }
    sadzaj+=`<div class="card mb-3 boja" style="width: 17rem;">
    <img class="card-img-top" src="assets/img/${s['src']}" alt="${s['naziv']}">
    <div class="card-body">
      <h5 class="card-title">${s['naziv']}</h5>
    </div>
  </div>`
  }
  lista.innerHTML=sadzaj;
}
}
//ispitivanje da li je cartoon stanica
if(window.location.href.includes("https://childhood1.netlify.app/cartoon.html")){
  ajaxCall("assets/data/crtaci.json",function(result){
    ispisCrtaca(result);
    dodavanjeUlocalStorage("crtaci",result);
  })
  ajaxCall("assets/data/zanr.json",function(result){
    ispisSelecta(result);
    ispisZanraZaFiltriranje(result);
  })
  ajaxCall("assets/data/tip.json",function(result){
    ispisTipa(result);})
  $(document).on("change", "#sortiranje", promena);
  $(document).on("change", "#type", promena);
  $(document).on("change", "#zanr", promena);
  $(document).on("click",".dodaj",dodajUlistu);
  let ddugme=document.querySelector("#posalji");
  ddugme.addEventListener("click",provera);
}
if(window.location.href.includes("https://childhood1.netlify.app/list.html")){
  prikaziListu();
}
function provera(){
  let ime=document.querySelector("#name");
  let zanrovi=document.querySelector("#genre");
  let tv=document.querySelector("#inlineRadio1");
  let film=document.querySelector("#inlineRadio2");
  let greske=0;
   let nameRegEx=/^[A-Z][a-z]{3,}/;
   if(!nameRegEx.test(ime.value)){
      ime.nextElementSibling.classList.remove("d-none");
      ime.nextElementSibling.innerHTML = "The name must start with an uppercase letter and have at least 3 lowercase letters.";
      ime.nextElementSibling.classList.add("text-danger");
      ime.classList.add("border-danger")
      greske++;
   }
   else{
    ime.nextElementSibling.classList.add("d-none");
    ime.nextElementSibling.innerHTML = "";
    ime.nextElementSibling.classList.remove("text-danger");
    ime.classList.remove("border-danger")
   }
   if(zanrovi.value==0){
      zanrovi.nextElementSibling.classList.remove("d-none");
      zanrovi.nextElementSibling.innerHTML = "You must select genre.";
      zanrovi.nextElementSibling.classList.add("text-danger");
      zanrovi.classList.add("border-danger")
      greske++
   }
   else{
      zanrovi.nextElementSibling.classList.add("d-none");
      zanrovi.nextElementSibling.innerHTML = "";
      zanrovi.nextElementSibling.classList.remove("text-danger");
      zanrovi.classList.remove("border-danger")
   }
   if(tv.checked!=true && film.checked!=true){
    tv.nextElementSibling.classList.add("text-danger");
    film.nextElementSibling.classList.add("text-danger");
    greske++;
   }
   else{
    tv.nextElementSibling.classList.remove("text-danger");
    film.nextElementSibling.classList.remove("text-danger");
   }
   if(greske>0){
    var form2 = document.querySelector("#formaReqvest");
    function handleForm(event){event.preventDefault();}
    form2.addEventListener('submit', handleForm);
  }
  if(greske==0){
    let rez=document.querySelector("#rezultat");
    rez.innerHTML="Your request has been successfully sent."; }
}
function dodavanjeUlocalStorage(naziv,vrednost){
  localStorage.setItem(naziv,JSON.stringify(vrednost));
}
function dohvatiIzLS(naziv){
  return JSON.parse(localStorage.getItem(naziv));
}
function promena(){
  let crtaci=dohvatiIzLS("crtaci");
  crtaci=sortiranje(crtaci);
  crtaci=filtriranje(crtaci,"tip");
  crtaci=filtriranje(crtaci,"zanr");
  ispisCrtaca(crtaci);
}
function sortiranje(nizProizvoda){
  let sortiraniProizvodi = [];
  let izbor = $("#sortiranje").val();

  if(izbor == "0"){
      sortiraniProizvodi = nizProizvoda;
  }
  else{
      sortiraniProizvodi = nizProizvoda.sort(function(a, b){
          if(izbor == "3"){
              return a.godinaIzlaska - b.godinaIzlaska;
          }
          if(izbor == "4"){
            return b.godinaIzlaska - a.godinaIzlaska;
        }
          if(izbor == "1"){
              if(a.naziv - b.naziv){
                  return 1;
              }
              else if(a.naziv < b.naziv){
                  return -1;
              }
              else{
                  return 0;
              }
          }
          if(izbor == "2"){
              if(a.naziv < b.naziv){
                  return 1;
              }
              else if(a.naziv > b.naziv){
                  return -1;
              }
              else{
                  return 0;
              }
          }   
      })
  }
  return sortiraniProizvodi;
}
function ispisCrtaca(nizCrtaca){
   
  let crtaci=document.querySelector("#crtaci");
  var a =  nizCrtaca.map((niz)=>{
    return `
    <div class="card mt-4 mx-4 boja" style="width: 19rem;">
    <img class="card-img-top" src="assets/img/${niz['src']}" alt="${niz['naziv']}">
    <div class="card-body">
      <h5 class="card-title">${niz['naziv']}</h5>
      <p class="m-0">Year: ${niz['godinaIzlaska']}</p>
      <p class="m-0">${niz.tip=="TV"?"Number of episodes:"+niz['brojEpizoda']:"Duration"+niz['trajanje']}</p>
      <p class="m-0">Type: ${niz['tip']}</p>
      <p class="m-0">Genre: ${niz['zanr']}</p>
      <button class="btn dodaj" data-id="${niz['id']}">Add to List</button>
    </div>
  </div>
    `
}).join("");
  crtaci.innerHTML=a;
}
function ispisSelecta(nizZanr){
  let genre=document.querySelector("#genre");
  let opcije="<option value='0'>Select genre...</option>";
  for (let i of nizZanr) {
    opcije+="<option value='"+i['id']+"'>"+i['naziv']+"</option>";
  }
  genre.innerHTML=opcije;
}
function ispisZanraZaFiltriranje(nizZaFiltriranje){
  let zanrList=document.querySelector("#zanr");
  let html="<ul>Genre:";
  for (const z of nizZaFiltriranje) {
    html+=`<li><input type="checkbox" class="zanr" name="zanrovi" value="${z.naziv}"/> ${z.naziv}</li>`
  }
  html+="</ul>"
  zanrList.innerHTML=html;
}
function ispisTipa(nizZaFiltriranje){
  let tipList=document.querySelector("#type");
  let html="<ul>";
  for (const t of nizZaFiltriranje) {
    html+=`<li><input type="checkbox" name="type" class="tip" value="${t.naziv}"/> ${t.naziv}</li>`
  }
  html+="</ul>"
  tipList.innerHTML=html;
}
function filtriranje(nizZaFiltriranje,tip){
  let filtriraniNiz=[];
  if(tip=="tip"){
  $('.tip:checked').each(function(el){
    filtriraniNiz.push($(this).val());
  });
  if(filtriraniNiz.length!=0){
    return nizZaFiltriranje.filter(x=>filtriraniNiz.includes(x.tip));
  }
  return nizZaFiltriranje;
}
  if(tip=="zanr"){
    $('.zanr:checked').each(function(el){
      filtriraniNiz.push($(this).val());
    });
    if(filtriraniNiz.length!=0){
      return nizZaFiltriranje.filter(x=>x.zanr.some(y=>filtriraniNiz.includes(y)));
    }
    return nizZaFiltriranje;
  }
}
function dodajUlistu(){
  let crtani=$(this).data("id");
  let crtaniIzListe=dohvatiIzLS("crtaniList");
  if(crtaniIzListe){
    //kada ima nesto u listi
    console.log("usli if");
    if(crtaniJeVecUListi()){
      prikaziBrojCrtanih();
    }
    else{
      dodajNoviCrtani();
      prikaziBrojCrtanih();
    }
  }
  else{
    console.log("usli else");
    dodajPrviCrtani();
    prikaziBrojCrtanih();
  }
  function dodajPrviCrtani(){
    let crtac=[];
    crtac[0]={id:crtani};
    dodavanjeUlocalStorage("crtaniList",crtac);
  }
  function crtaniJeVecUListi(){
    return crtaniIzListe.filter(c=>c.id==crtani).length;
  }
  function dodajNoviCrtani(){
    let crtaniIzLS=dohvatiIzLS("crtaniList");
    crtaniIzLS.push({
      id:crtani
    });
    dodavanjeUlocalStorage("crtaniList",crtaniIzLS);
  }
}
function prikaziBrojCrtanih(){
  let crtaniIzListe=dohvatiIzLS("crtaniList").length;
  let listaText="0";
    if(crtaniIzListe>=1){
      listaText=`${crtaniIzListe}`;
    }
  $("#brojCrtana").html(listaText);
}
function prikaziListu(){
  let sviCrtani=dohvatiIzLS("crtaci");
  let crtaciIzListe=dohvatiIzLS("crtaniList");
  let crtaniZaPrikaz=sviCrtani.filter(c=>{
    for (let l of crtaciIzListe) {
      if(c.id==l.id){
        return true;
      }
    }
    return false;
  })
  prikaziCrtaneIzListe(crtaniZaPrikaz);
}
function prikaziCrtaneIzListe(nizCrtaci){
  let crtaci=document.querySelector("#crtaci");
  var a =  nizCrtaci.map((niz)=>{
    return `
    <div class="card mt-4 mx-4 mb-4 boja" style="width: 19rem;">
    <img class="card-img-top" src="assets/img/${niz['src']}" alt="${niz['naziv']}">
    <div class="card-body">
      <h5 class="card-title">${niz['naziv']}</h5>
      <p class="m-0">Year: ${niz['godinaIzlaska']}</p>
      <p class="m-0">${niz.tip=="TV"?"Number of episodes:"+niz['brojEpizoda']:"Duration"+niz['trajanje']}</p>
      <p class="m-0">Type: ${niz['tip']}</p>
      <p class="m-0">Genre: ${niz['zanr']}</p>
      <button class="btn obrisi" onclick='obrisiIzListe(${niz['id']})'">Remove from List</button>
    </div>
  </div>
    `
}).join("");
  crtaci.innerHTML=a;
}
function obrisiIzListe(id){
  let c=dohvatiIzLS("crtaniList");
  let fil=c.filter(p=>p.id!=id);
  dodavanjeUlocalStorage("crtaniList",fil);
  prikaziBrojCrtanih();
  prikaziListu();
}