let currentIndex = 0;
let wordCnt = 0;

function setCurrentIndex(index) {
  document.querySelector('#current').innerText = index;
}

function setTotalWordSize(amt) {
  document.querySelector('#total').innerText = amt;
}

function doKeyPress(e) {
  if(e.key == 'Enter' || e.key == 'ArrowDown') {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'nextBtn'}, (response) => {

        if(response.status == 0) {
          currentIndex = parseInt(response.currentIndex);

          if(wordCnt > 0)
            currentIndex++; 
          setCurrentIndex(currentIndex);
        }
      });
    });
  }
  else if(e.key == 'ArrowUp') {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'prevBtn'}, (response) => {

        if(response.status == 0) {
          currentIndex = parseInt(response.currentIndex);

          if(wordCnt > 0)
            currentIndex++; 
          setCurrentIndex(currentIndex);
        }
      });
    });
  }
}

function init() {
  let serachInput = document.querySelector('.searchBarInput');
  let prevBtn = document.querySelector('#prevBtn');
  let nextBtn = document.querySelector('#nextBtn');
  let closeBtn = document.querySelector('#closeBtn');

  currentIndex = 0;
  wordCnt = 0;

  serachInput.addEventListener('change', ()=> {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'search', val: serachInput.value}, (response) => {

        if(response.status == 0) {
          currentIndex = parseInt(response.currentIndex);
          wordCnt = parseInt(response.wordCnt);

          if(wordCnt > 0)
            currentIndex++;
        }
        else {
          serachInput.value = "";
          currentIndex = 0;
          wordCnt = 0;
        }

        setCurrentIndex(currentIndex);
        setTotalWordSize(wordCnt);
      });
    });
  })

  prevBtn.addEventListener('click', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'prevBtn'}, (response) => {

        if(response.status == 0) {
          currentIndex = parseInt(response.currentIndex);

          if(wordCnt > 0)
            currentIndex++; 
          setCurrentIndex(currentIndex);
        }
      });
    });
  });

  nextBtn.addEventListener('click', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'nextBtn'}, (response) => {

        if(response.status == 0) {
          currentIndex = parseInt(response.currentIndex);

          if(wordCnt > 0)
            currentIndex++; 
          setCurrentIndex(currentIndex);
        }
      });
    });
  });

  window.addEventListener('keydown', doKeyPress, false);

  closeBtn.addEventListener('click', () => {

  });

}

window.onload = () => {
  init();
}