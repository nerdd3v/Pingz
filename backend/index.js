const express = require('express');
const PORT = process.env.PORT

const app = express();
app.use(express.json());

app.use('/user',userRouter)

app.listen(PORT, ()=>{
    console.log("Listening on port: ", PORT);
})