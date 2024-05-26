import express from "express"
import path from "path"
import {db , auth} from "../config/config.js";
import {QuerySnapshot, addDoc, collection, deleteDoc, doc, documentId, getDoc, getDocs, query, setDoc, updateDoc, where} from "firebase/firestore"
import { getAuth } from "firebase/auth";

const app = express()

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(process.cwd() , "/public")

const configPath = path.join(process.cwd(),"/config")

const hotelsRef = doc(collection(db,'hotels'))
const orderRef = doc(collection(db,'orders'))
const customerRef = doc(collection(db,'customer'))

app.use(express.static(publicDirectoryPath))
app.use(express.static(configPath))
app.use(express.json()) 


//Hotel Endpoints
app.post('/create' , async (req, res) => {
  try{
    const querySnapshot = await getDocs(collection(db, "hotels"));
    let exist = false
    querySnapshot.forEach((doc) => {
      if(doc.data().username == req.body.username){
        exist = true
      }
    })

    if(exist){ 
      res.send("Username already in use.")
    }
    else{
    const docRef = await addDoc(collection(db,'hotels'), req.body);    
    //Return id of the new hotel created. 
    res.send({
      "message":"Hotel Added!",
      "id":docRef.id,
      "username":req.body.username
    })
    } 
  }catch(error){
    res.status(500).send("Something Went Wrong! Try Again...")
  }  
})

app.get('/hotel' , async (req,res) => {
  try {
    const q = query(collection(db, 'hotels'), where('hotel_name', '==', req.body.hotel_name));
    const querySnapshot = await getDocs(q);
    
    const hotels = [];
    querySnapshot.forEach((doc) => {
        hotels.push(doc.data());
    });

    res.send(hotels);
  } catch (e) {
      console.error(e);
      res.status(500).send(e);    
  }
})

app.get('/hotels', async (req,res) => {
  try{
    const querySnapshot = await getDocs(collection(db, "hotels"));
    const hotels= [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      hotels.push({
        "Hotel":doc.data().hotel_name,
        "Cuisine":doc.data().hotel_type
      })
    })
    res.send(hotels)
  }catch(error){
    res.status(500).send(error.message)
  }
})

app.patch('/hotelUpdate', async (req, res) => {
  const id = req.body.info.id;
  const username = req.body.info.username;
  const passward = req.body.info.passward;

  try {
    const docRef = doc(db, 'hotels', id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists() && docSnapshot.data().username === username && docSnapshot.data().passward === passward) {
      await updateDoc(docRef, req.body.updates);
      res.send("Hotel details updated successfully!");
    } else {
      res.status(412).send("Credentials Mismatch Error!");
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.delete('/hotel' , async (req, res) => {
  // console.log(req.body)  
  const id = req.body.id
  const username = req.body.username
  const passward = req.body.passward
  try{
    const docRef = doc(db, 'hotels', id);
    const docSnapshot = await getDoc(docRef);    
    if (docSnapshot.exists() && docSnapshot.data().username === username && docSnapshot.data().passward === passward) {
      await deleteDoc(doc(db, "hotels", id))
      res.send("Hotel Removed")
    }else{
      res.status(412).send("Credentials Mismatch Error!")
    }
  }catch(e){
    res.status(500).send(e.message)
  }
})

app.patch('/getDishes' , async (req, res) => {

})



//Order Endpoints
app.post('/orders', async (req,res) => {
  const order = await addDoc(collection(db,'orders') , req.body)
  res.send({
    "message":"Order Placed!",
    "id":order.id
  })  
})

app.get('/orderstatus' , async (req,res) => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders= [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data()); 
      orders.push(doc.data())
    })
    res.send(orders)
}) 

app.get('/hotelallorders' , async (req, res) => {
  const username = req.body.username
  try{
    const q = query(collection(db, 'orders') , where("hotel_username","==",username))
  const querySnapshot = await getDocs(q)
  const orders = []
  console.log(querySnapshot.empty)
  if(!querySnapshot.empty){
    querySnapshot.forEach((doc) => {
    orders.push(doc.data())
    })
    res.status(200).send(orders)
  }else{
    res.status(404).send("No Orders Found!")
  }
  
}catch(error){
  res.status(500).send(error.message)
}
})

app.get('/customerallorders' , async (req, res) => {
  const username = req.body.username
  try{
    const q = query(collection(db, 'orders') , where("customer_username","==",username))
  const querySnapshot = await getDocs(q)
  const orders = []
  console.log(querySnapshot.empty)
  if(!querySnapshot.empty){
    querySnapshot.forEach((doc) => {
    orders.push(doc.data())
    })
    res.status(200).send(orders)
  }else{
    res.status(404).send("No Orders Found!")
  }
  
}catch(error){
  res.status(500).send(error.message)
}
})
    

// app.delete('/deleteorder', async (req, res) => {
//   const id = req.body.id
//     try{
//     const order = await deleteDoc(doc(db, "orders", req.params.id));
//     res.send("Order Deleted!");
//   }catch(error){
//     console.log(error)
//     res.status(500).send(error)
//   }
// })



// Costumer CRUD
app.post('/createCustomer', async (req, res) => {
  try{
    const querySnapshot = await getDocs(collection(db, "customer"));
    let exist = false
    querySnapshot.forEach((doc) => {
      if(doc.data().username == req.body.username){
        exist = true
      }
    })

    if(exist){ 
      res.send("Username already in use.")
    }
    else{
      const customer = await addDoc(collection(db,"customer"), req.body)
      res.send({
        "message":"Customer Added!",
        "id":customer.id,
        "username":req.body.username
      })
    }  
  }catch(error){
    console.log(error.message)
    res.send("Something Went Wrong! Try Again...")
  }
  
})

app.get('/detailscustomer', async (req, res) => {
  try {
    const q = query(collection(db, "customer"), where('username', '==', req.body.username));
    const querySnapshot = await getDocs(q);
    
    const hotels = [];
    querySnapshot.forEach((doc) => {
        hotels.push(doc.data());
    });

    res.send(hotels);
  } catch (e) {
      console.error(e);
      res.status(500).send(e);    
  }
})

app.patch('/updatecustomer', async (req, res) => {
  const username = req.body.info.username;
  const passward = req.body.info.passward;

try {
  const q = query(collection(db, "customer"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return res.status(412).send("Credentials Mismatch Error!");
  }
  let customerDoc = null;
  querySnapshot.forEach((docSnapshot) => {
    if (docSnapshot.exists() && docSnapshot.data().passward === passward) {
      customerDoc = docSnapshot;
    }
  })
  if (customerDoc) {
    const docRef = doc(db, "customer", customerDoc.id);
    await updateDoc(docRef, req.body.updates);
    res.send("Customer details updated successfully!");
  } else {
    res.status(412).send("Credentials Mismatch Error!");
  }
} catch (e) {
  res.status(500).send(e.message);
}
})

app.delete('/deletecustomer', async (req, res) => {
  const id = req.body.id
  const username = req.body.username
  const passward = req.body.passward
  try{
    const docRef = doc(db, 'customer', id);
    const docSnapshot = await getDoc(docRef);    
    if (docSnapshot.exists() && docSnapshot.data().username === username && docSnapshot.data().passward === passward) {
      await deleteDoc(doc(db, "customer", id))
      res.send("Account Deleted!! We are sad to see you leaving.")
    }else{
      res.status(412).send("Credentials Mismatch Error!")
    }
  }catch(e){
    res.status(500).send(e.message)
  }
})



app.listen(port, () => {
    console.log('Server is up and running on port: ', port)
})   