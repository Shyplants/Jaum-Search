let jaum = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
let bodyText, jaumText, jaumWords;
let currentIndex;

function isHangul(letter) {
  return letter.charCodeAt() >= 0xAC00 && letter.charCodeAt() <= 0xD7AF;
}

function isHangulWord(word) {
  // console.log(word + ' ' + word.length);
  for(let i=0; i<word.length; ++i) {
    if(isHangul(word[i]))
      return true;
  }

  return false;
}

function isJaum(letter) {
  return (letter.charCodeAt() >= 0x1100 && letter.charCodeAt() <= 0x11FF) ||
          (letter.charCodeAt() >= 0x3130 && letter.charCodeAt() <= 0x318F);
}

function isJaumWord(word) {
  for(let i=0; i<word.length; ++i) {
    if(!isJaum(word[i]))
      return false;
  }

  return true;
}

function getJaum(letter) {
  let index = Math.floor(((letter.charCodeAt()-0xAC00) / 28) / 21);

  return jaum[index];
}

function matchingJaumWord(jaums) {
  jaumWords = new Set();

  for(let i=0; i<jaumText.length; ++i) {
    if(jaumText[i].length < jaums.length) continue;

    let isValid = true;
    for(let j=0; j<jaums.length; ++j) {
      if(!isHangul(jaumText[i][j]) || getJaum(jaumText[i][j]) != jaums[j]) {
        isValid = false;
        break;
      }
    }

    if(isValid) {
      jaumWords.add(jaumText[i].slice(0, jaums.length));
    }
  }
}

function init() {
  currentIndex = 0;
  bodyText = document.body.innerText.split(/\s+/g);

  jaumText = bodyText.filter(isHangulWord);

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.action === "search") {
      if(!isJaumWord(msg.val)){
        // sendResponse({status : 401}); // 올바르지 않은 입력 
        console.log("올바르지 않은 입력");
      }
      else {
        matchingJaumWord(msg.val);
        console.log(jaumWords);
      }
    }
  });

  // console.log(jaumText);
}


window.onload = () => {
  init();
}

