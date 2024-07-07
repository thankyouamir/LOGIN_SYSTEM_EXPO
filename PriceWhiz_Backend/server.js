import app from './app.js';






app.listen(process.env.PORT, () => {
  //this function takes port and callback function as argument 
  console.log(`Server running on port ${process.env.PORT}`);
});

