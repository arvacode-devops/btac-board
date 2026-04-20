function dynamicPin(){
  var prop = document.getElementById("profileSelect").value;
  var toDisp = document.getElementById("pinShow");
  if(prop === "dynamic"){
    toDisp.style.display ="block";
    toDisp.innerHTML = `<label class="label">Pin slection</label> <div class="control"> <div class="select is-fullwidth"> <select id="pinSelect"><option selected disabled hidden value="">Choose how many pins</option><option value="1">Single</option><option value="2">Bonded</option></select></div></div>`;
  } else if(prop !== "dynamic"){
    toDisp.innerHTML = ` `;
    toDisp.style.display ="hidden";

  };
};

function calc() {
    const showSpeed = document.getElementById("speedShow");
    var validFoot
    var foot = parseInt(document.getElementById("foots").value);
    var profile = document.getElementById("profileSelect").value;
    var cont = 0;

    showSpeed.innerHTML = ``;

    if(profile === "dynamic"){
      var pin = parseInt(document.getElementById("pinSelect").value);

      if(pin === 1){
        console.log(dynamicSpeed);
        dynamicSpeed.forEach(element => {
        if( foot >= element.foot[0]  && foot <= element.foot[1] && element.pin === 1){
        console.log(element.color);
        cont += 1;
          showSpeed.innerHTML +=`<div class="column is-three-quarters"><div class="notification ${element.color}"><h1 class="title is-5">${element.id}</h1><div class="columns is-mobile"><div class="column is-two-thirds"><p class=" ">Down: <p class="has-text-weight-bold is-size-4" style="cursor: copy" onclick="copy(${element.downSpeed});"> ${element.downSpeed}</p></p></div><div class="column"><p class="">Up: <p class="has-text-weight-bold is-size-4" style="cursor: copy" onclick="copy(${element.upSpeed});">${element.upSpeed}</p></p></div></div></div></div>`;
        }
        });
      }else if(pin === 2){
        dynamicSpeed.forEach(element => {
        if( foot >= element.foot[0]  && foot <= element.foot[1] && element.pin === 2){
        
          cont += 1;
          console.log(cont);
          showSpeed.innerHTML +=`<div class="column is-three-quarters" id="${"bond"+cont}"><div class="notification ${element.color}"><div class="columns is-mobile"> <div class="column"> <h1 class="title is-5">${element.id}</h1></div> <div class="column is-1"> <button class="button is-hovered is-black" onclick="divide(${cont})"> <span class="icon is-small"><i id="iconB${cont}" class="fa-solid fa-divide"></i></span></button></div> </div><div class="columns is-mobile"><div class="column" id="${"downCol"+cont}"><p class=" ">Down: <p class="has-text-weight-bold is-size-4" id="${"downValue"+cont}" style="cursor: copy" onclick="copy(${element.downSpeed});">${element.downSpeed}</p> <p class="has-text-weight-bold is-size-4" id="${"downNew"+cont}" style="display: hidden; cursor: copy;" onclick="copy(${element.downSpeed/2});"> </p>  </p></div><div class="column"><p class="">Up: <p class="has-text-weight-bold is-size-4" style="cursor: copy" onclick="copy(${element.upSpeed});" id="${"upValue"+cont}">${element.upSpeed}</p> <p class="has-text-weight-bold is-size-4" id="${"upNew"+cont}" style="display: hidden; cursor: copy;" onclick="copy(${element.upSpeed/2});"> </p></p></div></div></div></div>`;
          
        }
        });
      }
    } else if(profile === "fixed"){
      console.log("fixed speed");
    }
}

function divide(prop){

  var iconValue = document.getElementById("iconB"+prop).className;
  var downClass = document.getElementById("downValue"+prop);
  var upClass = document.getElementById("upValue"+prop);
  var downSpeed = parseInt(document.getElementById("downValue"+prop).textContent);
  var upSpeed = parseInt(document.getElementById("upValue"+prop).textContent);
  var downInner = document.getElementById("downNew"+prop);
  var upInner = document.getElementById("upNew"+prop);



    var downResult = downSpeed / 2;
    var upResult = upSpeed / 2;

    downClass.className = "is-hidden";
    upClass.className = "is-hidden";

    downInner.style.display = "block";
    upInner.style.display = "block";
    downInner.innerHTML = downResult;
    upInner.innerHTML = upResult;
    
  Toastify({
    text: "Divided succesfully!" ,
    duration: 2000,
    newWindow: true,
    close: false,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(90deg, rgba(70,181,4,1) 35%, rgba(0,189,132,1) 100%)",
    },
    onClick: function(){} // Callback after click
  }).showToast();
  

}

function copy (prop){
    navigator.clipboard.writeText(prop)
    Toastify({
    text:" Copied!" ,
    duration: 2000,
    newWindow: true,
    close: false,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "black",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}

function tabManage(prop){

  var tab1 = document.getElementById('tab1');
  var tab2 = document.getElementById('tab2');
  var tab3 = document.getElementById('tab3');
  var tab4 = document.getElementById('tab4');

  var section1 = document.getElementById('quickRes');
  var section2 = document.getElementById('FTBBSection');
  var section3 = document.getElementById('cmd1Sec');
  var section4 = document.getElementById('mac');
  var section5 = document.getElementById('FTBBSection2');


 if (prop === "qr"){
  tab1.className = 'is-active';
  tab2.className = '';
  tab3.className = '';
  tab4.className = '';
  section1.style.display = 'block';
  section2.style.display = 'none';
  section3.style.display = 'none';
  section4.style.display = 'none';
  section5.style.display = 'none';
 }else if(prop === 'ftbbtab'){
  tab1.className = '';
  tab2.className = 'is-active';
  tab3.className = '';
  tab4.className = '';
  section1.style.display = 'none';
  section2.style.display = 'block';
  section3.style.display = 'none';
  section4.style.display = 'none';
  section5.style.display = 'block';
 } else if(prop === 'cmd1'){
  tab1.className = '';
  tab2.className = '';
  tab3.className = 'is-active';
  tab4.className = '';
  section1.style.display = 'none';
  section2.style.display = 'none';
  section3.style.display = 'block';
  section4.style.display = 'none';
  section5.style.display = 'none';

 } else if(prop === 'mac'){
  tab1.className = '';
  tab2.className = '';
  tab3.className = '';
  tab4.className = 'is-active';
  section1.style.display = 'none';
  section2.style.display = 'none';
  section3.style.display = 'none';
  section4.style.display = 'block';
  section5.style.display = 'none';

 }
}

function addNewNote(){
    var newTitle = document.getElementById("newMessageTitle").value;
    var newColor = document.getElementById("newMessageColor").value;
    var newContent = document.getElementById("newMessageContent").value;
    let lastElement = messages[messages.length - 1].id;
    var lastElementNew = lastElement+1;

    let messageNew = {
        id: lastElementNew,
        color: newColor,
        titel: newTitle,
        content: newContent
    };
    messages.push(messageNew);
}

function messageFiler(prop) {
    var messShow = document.getElementById("messageShow");

    messShow.innerHTML = ``;
      messages.forEach(element => {
       if(element.tagName===prop){
        messShow.innerHTML += ` <div class="column is-three-quarters">
        <article class="message is-small">
            <div class="message-header">
              <p>${element.title}</p>
              <span class="tag is-rounded is-small ${element.tagColor}">${element.tagName}</span>
            </div>
            <div class="message-body" onclick="copy('${element.content}')" style="cursor: copy">
                ${element.content}
            </div>
          </article>
        </div>`;
       }else if(prop=== `all` && element.tagName !== "greeting" && element.tagName !== "procedure" && element.tagName !== "closing" && element.tagName !== "LOGGER" && element.tagName !== "information"){
        messShow.innerHTML += ` <div class="column is-three-quarters">
        <article class="message is-small">
            <div class="message-header">
              <p>${element.title}</p>
              <span class="tag is-rounded is-small ${element.tagColor}">${element.tagName}</span>
            </div>
            <div class="message-body" onclick="copy('${element.content}')" style="cursor: copy">
                ${element.content}
            </div>
          </article>
        </div>`;
       }

      });
    

 };

 function cmd1(prop) {
  var messShow = document.getElementById("cmd"+prop+"Show");
  messShow.innerHTML = ``;
  var shelf = document.getElementById("shelfInputCmd"+prop).value;
  var slot = document.getElementById("slotInputCmd"+prop).value;
  var port = document.getElementById("portInputCmd"+prop).value;
  var color = '';

  if(prop === 1){
    color = 'background-color: #19C69F; color: white;';
  }else if(prop === 2){
    color = 'background-color: #FED746; color: black;';
  }

  commandLine.forEach(element => {
    
    var comando = element.command;
    var comando2 = comando.replace("shelf", shelf);
    var comando3 = comando2.replace("slot", slot);
    var comando4 = comando3.replace("port", port);

    console.log();

    messShow.innerHTML += `<div class="box" style="${color}" onclick="copy('${comando4}')" style="cursor: copy;">
    <p class="">${comando4}</p>
  </div>`
  });
  
  
};

function macAddress(){
  var messShow = document.getElementById("macShow");
  var mac = document.getElementById("macValue").value;
  let arr3 = Array.from(mac);
    arr3[1]+=':';
    arr3[3]+=':';
    arr3[5]+=':';
    arr3[7]+=':';
    arr3[9]+=':';
    let string3 = arr3.join("");
    messShow.innerHTML = ``;

    messShow.innerHTML += `<br/><div class="box" style="cursor: pointer" onclick="copy('show service id 21 subscriber-hosts mac ${string3} detail'), macAddress2('ipoe','${string3}');"> <span class="tag is-info">IPoE</span> show service id 21 subscriber-hosts mac ${string3} detail</div>
    <div class="box" style="cursor: pointer" onclick="copy('show service id 21 pppoe session mac ${string3} detail'),  macAddress2('pppoe','${string3}');"> <span class="tag is-warning">PPPoE</span>show service id 21 subscriber-hosts mac ${string3} detail</div> 
    
    <div class="field">
  <label class="label has-text-white">IP</label>
  <div class="control">
    <input id="ipAdd" class="input" type="text" placeholder="00.000.00">
  </div>
</div>

<div class="field">
  <label class="label has-text-white">LAG</label>
  <div class="control">
    <input id="lagAdd" class="input" type="email" placeholder="lag-000:000:000">
  </div>
</div>
</br>

    `

  
}
function macAddress2(prop,mac){
  var messShow = document.getElementById("macShow2");
  var ip = document.getElementById("ipAdd").value;
  var lag = document.getElementById("lagAdd").value;
  messShow.innerHTML = ``;

  if(prop === "ipoe"){
    messShow.innerHTML += `<div class="box" style="cursor: pointer" onclick="copy('clear service id 21 dhcp6 lease-state mac ${mac}')"> <span class="tag is-info">IPoE</span> clear service id 21 dhcp6 lease-state mac ${mac}</div>
    <div class="box" style="cursor: pointer" onclick="copy('clear service id 21 dhcp lease-state ip-address ${ip}')"> <span class="tag is-info">IPoE</span> clear service id 21 dhcp lease-state ip-address ${ip}</div>`
  } else if(prop === "pppoe"){
    console.log("ENTRA");
    messShow.innerHTML += `<div class="box" style="cursor: pointer" onclick="copy('clear service id "BNG" ppp session sap ${lag}')"> <span class="tag is-warning">PPPoE</span> clear service id "BNG" ppp session sap ${lag}</div>`
  }
}

/**

  
 **/