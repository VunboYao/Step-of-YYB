let str = parseUrl("http://www.xiyanghui.com/product/list?id=123456&sort=discount#title");

function parseUrl(url) {
    let protocol = url.match(/\w+/);
    console.log(protocol[0]);
    let href = url.match(/^(w+)\d+\/$)/);
    console.log(href);
}
/*
* {
    protocol: "http",
    host: "www.xiyanghui.com",
    path: "/product/list",
    query: {
        id: "123456",
        sort: "discount"
    },
    hash: "title"
}*/