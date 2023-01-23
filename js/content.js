let jaum = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
let bodyText, jaumText, jaumWords;
let extractNodeSet, matchedNode, matchedWordCnt;
let currentIndex;

function isHangul(letter) {
  return letter.charCodeAt() >= 0xAC00 && letter.charCodeAt() <= 0xD7AF;
}

function isHangulWord(word) {
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

function clear() {
  let element = document.querySelectorAll("#highlight");
  for(let i=0; i<element.length; ++i) {
    let htmlText = element[i].outerHTML;
    htmlText = htmlText.replace(/(<([^>]+)>)/ig,"");
    element[i].outerHTML = htmlText;

    element[i] = document.getElementById('highlight');
  }
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

function extractNode(element, pattern) {
  for(let node of element.childNodes) {
    switch(node.nodeType) {
      case Node.DOCUMENT_NODE:
        extractNode(node, pattern);
        break;
      
      case Node.ELEMENT_NODE:
        extractNode(node, pattern);
        break;

      case Node.TEXT_NODE:
        for(let word of pattern) {
          let textIndex = String(node.textContent).indexOf(word);
          if(textIndex != -1) {
            extractNodeSet.add(node.parentNode);
          }
        }
        extractNode(node, pattern);
        break;
      
      default:
        break;
    }
  }
}

function highlightJaumWord() {
  if(jaumWords.length == 0) 
    return;

  let pattern = Array.from(jaumWords)
  const spanHead = `<span id="highlight">`;
  const spanTail = `</span>`;

  extractNodeSet = new Set();
  extractNode(document.body, pattern);

  extractNodeSet.forEach(function(node) {
    if(node.offsetParent === null)
      extractNodeSet.delete(node);
  })

  for(let node of extractNodeSet) {
    for(let word of pattern) {
      let textIndex = String(node.textContent).indexOf(word);
      let htmlIndex = -1;
      
      while(textIndex != -1) {
        htmlIndex = String(node.innerHTML).indexOf(word, htmlIndex+1);

        let originHTML = node.innerHTML;
        let resultHtml = originHTML.slice(0, htmlIndex) + spanHead + word + spanTail + originHTML.slice(htmlIndex + word.length);
        node.innerHTML = resultHtml;
        
        htmlIndex += spanHead.length + spanTail.length;
        textIndex = String(node.textContent).indexOf(word, textIndex + spanHead.length + spanTail.length + 1);

        
      }
    }
  }

  matchedNode = document.querySelectorAll("#highlight");
  matchedWordCnt = matchedNode.length;
  currentIndex = 0;
}

function focusWord() {
  if(matchedWordCnt == 0) return;

  for(let i=0; i<matchedWordCnt; ++i) {
    matchedNode[i].style.backgroundColor = (i == currentIndex ? "#FF7E00" : "#FFFF00");
  }
  matchedNode[currentIndex].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
}

function dataInit() {
  currentIndex = 0;
  matchedWordCnt = 0;
}


function init() {
  dataInit();
  bodyText = document.body.innerText.split(/\s+/g);

  jaumText = bodyText.filter(isHangulWord);

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.action === "search") {
      clear();
      
      if(!isJaumWord(msg.val)){
        dataInit();

        sendResponse({status : -1});
      }
      else {
        if(msg.val == "") {
          dataInit();

          sendResponse({wordCnt : matchedWordCnt, currentIndex : 0, status : 0});
        }
        else {
          matchingJaumWord(msg.val);
          highlightJaumWord();
          focusWord();

          sendResponse({wordCnt : matchedWordCnt, currentIndex : 0, status : 0});
        }
      }
    }

    else if(msg.action === 'prevBtn') {
      if(currentIndex == 0) {
        sendResponse({status : -1});
      }
      else {
        currentIndex--;
        focusWord();
        
        sendResponse({currentIndex : currentIndex, status : 0});
      }
    }

    else if(msg.action === 'nextBtn') {
      if(currentIndex+1 >= matchedWordCnt) {
        sendResponse({status : -1});
      }
      else {
        currentIndex++;
        focusWord();
        
        sendResponse({currentIndex : currentIndex, status : 0});
      }
    }
  });
}


window.onload = () => {
  init();
}

