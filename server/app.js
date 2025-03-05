const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let postRequestCount = 0;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.post('/', (req, res) => {
    postRequestCount++;
    res.json({ "postRequestCount": postRequestCount }); // 确保返回 JSON 格式
});

const port = 3000;
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});