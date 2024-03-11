import express from 'express'
import IdentityRoute from './identity.route.js'
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.json({"message":"Welcome to the api."})
})

app.use("/api", IdentityRoute);

app.listen(3000, () => {
    console.log("App running and listening to port 3000")
})