function copy(prop) {
  navigator.clipboard.writeText(prop);
  Toastify({
    text: " Copied!",
    duration: 2000,
    newWindow: true,
    close: false,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "black"
    },
    onClick: function () {} // Callback after click
  }).showToast();
}
function addNewNote() {
  var newTitle = document.getElementById("newMessageTitle").value;
  var newColor = document.getElementById("newMessageColor").value;
  var newContent = document.getElementById("newMessageContent").value;
  let lastElement = messages[messages.length - 1].id;
  var lastElementNew = lastElement + 1;

  let messageNew = {
    id: lastElementNew,
    color: newColor,
    titel: newTitle,
    content: newContent
  };
  messages.push(messageNew);
}

(function () {
  var messShow = document.getElementById("messageShow");

      cincok.forEach((element) => {
          messShow.innerHTML += ` <div class="column is-three-quarters">
          <article class="message is-small">
              <div class="message-header">
                <p>${element.title}</p>
                <span class="tag is-rounded is-small ${element.tagColor}">${element.tagName}</span>
              </div>
              <div class="message-body" onclick="copy('${element.content}')" style="cursor: pointer">
                  ${element.content}
              </div>
            </article>
          </div>`;
      });
})();

/**


**/
