// ==UserScript==
// @name         Luogu Feed: Anti-SqrtSecond
// @namespace    https://imken.moe/
// @version      0.2.0
// @description  某些人总是喜欢发一些隐藏犇犇 e.g. `[](你被骗了)`
// @author       Imken Luo
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn/?*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// ==/UserScript==

const contentMap = {
    'rickroll': 'RickRoll',
    'bilibli1': '洛天依 - 凉雨',
    'bilibili2': '天依教你甜甜圈的正确用法',
};

const keywordMap = {
    'BV1GJ411x7h7': 'rickroll',
    'milime.top': 'rickroll',
    'rrHrxMt': 'rickroll',
    '192d9a98d782d9c74c96f09db9378d93.mp4': 'rickroll',
    'BV12x411y7SN': 'bilibli1',
    'BV1sx411S7rN': 'bilibili2',
};

// 根据 contentMap 生成 css
const genCss = (contentMap) => {
    let res = "";
    for (let i in contentMap) {
        res += `.as-${i}::after {
            content: "[Warn: ${contentMap[i]}]"; 
            margin-left: 0.2em;
            font-family: monospace;
            background-color: yellow;
            color: red;
        };\n`;
    }
    return res;
};

// 注入 css
const addCSS = (css) => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
};

const markBenbenA = (ele) => {
    const href = ele.getAttribute('href');
    if (ele.innerHTML.trim() === '') {
        ele.innerHTML = href;
    }
    for (let key in keywordMap) {
        if (href.includes(key)) {
            ele.classList.add(`as-${keywordMap[key]}`);
            ele.classList.add('as-warn');
            break;
        }
    }
    console.log(ele);
};

const markBenbenImg = (ele) => {
    let altText = ele.getAttribute('alt');
    let src = ele.getAttribute('src');
    src = decodeURIComponent(src);
    let newAltText = `${altText} | ${src}`;
    ele.setAttribute('alt', newAltText);
    ele.setAttribute('title', newAltText);
    console.log(ele);
};

// 当观察到变动时执行的回调函数
const observerCallback = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
        for (let addedNode of mutation.addedNodes) {
            if (!addedNode.querySelectorAll) continue;

            aElements = addedNode.querySelectorAll('.feed-comment a');
            for (let ele of aElements) {
                if (ele.hasAttribute("as-marked")) continue;
                ele.setAttribute("as-marked", "1");
                markBenbenA(ele);
            }

            imgElements = addedNode.querySelectorAll('#feed .feed-comment img');
            for (let ele of imgElements) {
                if (ele.hasAttribute("as-marked")) continue;
                ele.setAttribute("as-marked", "1");
                markBenbenImg(ele);
            }

        }
    }
}

(() => {
    addCSS(genCss(contentMap));

    // 选择需要观察变动的节点
    const targetNode = document.getElementById('feed');

    // 没有犇犇不执行
    if (targetNode === null) return ;

    // 观察器的配置（需要观察什么变动）
    const config = { attributes: false, childList: true, subtree: false };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(observerCallback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
})();

// vim:et:sts=4:sw=4
