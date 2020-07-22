const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const algoRouter = require('./routes/algos');
const apiRouter = require('./routes/api');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/algos', algoRouter);
app.use('/api', apiRouter);

//404 & Error Handling ---------------------------------------------
app.use((req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

//Port On --------------------------------------------------------
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
