const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const algoRouter = require('./routes/algos');

app.use(express.json());

app.use('/algos', algoRouter);

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
