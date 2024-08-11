// content.js


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

let newCaptionObserver = new MutationObserver(() => {
    // CALLBACK FUNC
    console.log("New caption!");

})

const observer = new MutationObserver(() => {
    // CALLBACK FUNC
    let captionSpan = document.getElementById('ytp-caption-window-container');
    if (captionSpan) {
        observer.disconnect();
        newCaptionObserver.observe(captionSpan, {
            characterData: false,
            childList: true,
            subtree: true
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

            let word = textNode.nodeValue.trim();
            if (word) {
                let definition = fetchDefinition(word);
                displayInfo(definition);
            }
        }
    }
});