let now = new Date().getTime() / 1000;

const timer = setInterval(() => {
    const new_now = new Date().getTime() / 1000
    console.log(Math.floor(new_now - now));
}, 1000);