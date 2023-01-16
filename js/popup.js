function serachJaum() {
  let serachInput = document.querySelector('#searchInput');

  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'search', val: searchInputValue}, (response) => {
      //setTotalCount(response.cnt);
      //setCurrentIndex(min(response.current_index + 1, response.cnt));
    });
  });
}

function init() {
  let serachInput = document.querySelector('#searchInput');

  serachInput.addEventListener('change', ()=> {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'search', val: serachInput.value}, (response) => {
        // console.log(response.status);
        //setTotalCount(response.cnt);
        //setCurrentIndex(min(response.current_index + 1, response.cnt));
      });
    });
  })
}

window.onload = () => {
  init();
}