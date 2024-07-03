export const wrapWordsWithSpans = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const walk = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

    const textNodes = [];
    let node;
    while (node = walk.nextNode()) {
        if (!node.nodeValue.trim()) continue;
        if (node.parentNode.nodeName === 'SPAN') continue;
        textNodes.push(node);
    }

    textNodes.forEach(node => {
        const spanWrappedHtml = node.nodeValue.split(/\s+/).map(word => `<span>${word}</span>`).join(' ');
        const fragment = document.createRange().createContextualFragment(spanWrappedHtml);
        node.parentNode.replaceChild(fragment, node);
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc.body);
};