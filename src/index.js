import express from "express"
import path from "path"
import {db} from "./config/config.js";
import {collection, doc, getDoc, getDocs, setDoc} from "firebase/firestore"

const app = express()

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(process.cwd() , "/public")

app.use(express.static(publicDirectoryPath))
app.use(express.json())

const hotelsRef = doc(collection(db,'hotels'))
const orderRef = doc(collection(db,'orders'))


//Hotel Endpoints
app.post('/create' , async (req, res) => {
    const hotelData = req.body

    await setDoc(hotelsRef, data);  

    res.send("Hotel Added!")
})

app.get('/hotels', async (req,res) => {
    const querySnapshot = await getDocs(collection(db, "hotels"));
    const hotels= [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      hotels.push(doc.data())
    })
    res.send(hotels)
})


//Order Endpoints
app.post('/orders', async (req,res) => {
    const orderData = req.body

    await setDoc(orderRef , orderData)

    res.send("Order Placed!")
})

app.get('/order' , async (req,res) => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders= [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      orders.push(doc.data())
    })
    res.send(orders)
})

app.get('/allorders' , async (req,res) => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders= [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      orders.push(doc.data())
    })
    res.send(orders)
})

app.listen(port, () => {
    console.log('Server is up and running on port: ', port)
})   