// content.js
const jDictUrl = chrome.runtime.getURL('scripts/data/dictionary.js');
const mainURL = chrome.runtime.getURL('scripts/main.js');
console.log(jDictUrl + " and " + mainURL);
const jDict = document.createElement('script');
jDict.src = jDictUrl;
(document.head || document.documentElement).appendChild(jDict);
const jieba = document.createElement('script');
jieba.src = mainURL;
(document.head || document.documentElement).appendChild(jieba);
const result = jieba.cut("我的中文東西。");
console.log(result);

async function fetchDefinition(character) {
    try {
        const dictData = await fetch('cedict.json') // FIX: tries to get it from youtube.com/cedict.json
            .then(response => response.json());
            console.log(dictData);
    } catch (err) {
        console.error('Error: ', err);
    }
    const entry = dictData.find(entry => entry.traditional === character || entry.simplified === character);
    console.log(entry);
}

function displayInfo(definition) {
    let wordInfo = document.createElement('div');
    wordInfo.id = 'word-info';
    wordInfo.style.width = '100px';
    wordInfo.style.height = '100px';
    // set max and min?
    wordInfo.style.position = 'absolute';
    wordInfo.style.padding = '5px';
    wordInfo.innerText = definition;
}

let captionSpan, captionText, segText;
let newCaptionObserver = new MutationObserver(() => {
    // CALLBACK FUNC
    // FIX: occurs when zooming or change console width
    if (captionSpan) {
        console.log("New caption!");
        captionText = captionSpan.firstChild.firstChild.firstChild.firstChild.textContent;
        console.log(captionText);
        script.onload = function() {
            segText = jieba.cut(captionText);
            console.log(segText);
        }
    }

})

const observer = new MutationObserver(() => {
    // CALLBACK FUNC
    captionSpan = document.getElementById('ytp-caption-window-container');
    if (captionSpan) {
        observer.disconnect();
        newCaptionObserver.observe(captionSpan, {
            characterData: false,
            childList: true,
            subtree: false
        })
    }
});

observer.observe(document.body, { childList: true, subtree: true});


document.addEventListener('mouseover', (event) => {
    const range = document.createRange();
    const x = event.clientX;
    const y = event.clientY;
    const node = document.elementFromPoint(x, y);
    if (node && node.firstChild.nodeType === Node.TEXT_NODE) {
        const textNode = node.firstChild; // is there ever a case where first child isn't text?
        if (textNode && textNode.parentNode.closest('.ytp-caption-segment')) {
            //console.log(textNode.textContent);

            /*let word = textNode.nodeValue.trim();
            if (word) {
                let definition = fetchDefinition(word);
                displayInfo(definition);
            }*/
        }
    }
});