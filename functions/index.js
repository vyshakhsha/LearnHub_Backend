const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
// app.use(cors({ origin: true }));
app.use(cors({ origin: '*' }));
var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://learnhub-60b63..firebaseio.com"
});
const db = admin.firestore();

// #region Hello World
app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});
// #endregion

// #region Insert
app.post('/api/insert', (req, res) => {
  (async () => {
      try {
        await db.collection('users').doc('/' + req.body.id + '/')
            .create({
              userName:req.body.userName,
              userType:req.body.userType,
              dob:req.body.dob
            });
        return res.status(200).send("Success");
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});
// #endregion

// #region read an item
app.get('/api/read/:id', (req, res) => {
  (async () => {
      try {
          const document = db.collection('Users').doc(req.params.id);
          let item = await document.get();
          
          if (!item.exists) {
            return res.status(404).send('No data found');
        }
          let response = item.data();
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });
  // #endregion

// #region read all
app.get('/api/read', (req, res) => {
  (async () => {
      try {
          let query = db.collection('Users');
          let response = [];
          await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs;
          for (let doc of docs) {
              const selectedItem = {
                  id: doc.id,
                  userName:doc.data().userName,
                  userType:doc.data().userType,
                  dob:doc.data().dob
              };
              response.push(selectedItem);
          }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });
// #endregion

// #region update
app.put('/api/update/:id', (req, res) => {
(async () => {
  try {
      const document = db.collection('users').doc(req.params.id);
      await document.update({
          userName: req.body.userName
      });
      return res.status(200).send('Update success');
  } catch (error) {
      console.log(error);
      return res.status(500).send(error);
  }
  })();
});
// #endregion

// #region delete
app.delete('/api/delete/:id', (req, res) => {
(async () => {
  try {
      const document = db.collection('users').doc(req.params.id);
      await document.delete();
      return res.status(200).send('Delete success');
  } catch (error) {
      console.log(error);
      return res.status(500).send(error);
  }
  })();
});
// #endregion

// #region Get all Course Details


app.get('/api/courses', (req, res) => {
  (async () => {
      try {
          let query = db.collection('Courses');
          let response = [];
          await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs;
          for (let doc of docs) {
              const selectedItem = {
                  id: doc.id,
                  courseName:doc.data().name,
                  author:doc.data().author,
                  category:doc.data().category,
                  price:doc.data().price,
                  rating:doc.data().rating,
                  students:doc.data().students,
                  AuthorEmail:doc.data().Email,
                  image:doc.data().image
              };
              response.push(selectedItem);
          }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });
// #endregion

// #region Add new course POST
app.post('/api/newCourse', (req, res) => {
  (async () => {
      try {
        await db.collection('Courses').doc('/' + req.body.id + '/')
            .create({
              name:req.body.name,
              author:req.body.author,
              category:req.body.category,
              image:req.body.image,
              price:req.body.price,
              rating:req.body.rating,
              students:req.body.students,
              Email:req.body.Email
            });
        return res.status(200).send("Success");
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});
// #endregion

// #region Filter Courses by Author Email 

app.get('/api/courses/author', (req, res) => {
  (async () => {
      try {
          const email = req.headers['email']; // Get email from request headers
          if (!email) {
              return res.status(400).send('Email header is required');
          }

          let query = db.collection('Courses').where('Email', '==', email); // Filter courses by author's email
          let response = [];
          await query.get().then(querySnapshot => {
              let docs = querySnapshot.docs;
              for (let doc of docs) {
                  const selectedItem = {
                      id: doc.id,
                      courseName: doc.data().name,
                      author: doc.data().author,
                      category: doc.data().category,
                      price: doc.data().price,
                      rating: doc.data().rating,
                      students: doc.data().students,
                      AuthorEmail: doc.data().Email,
                      image:doc.data().image
                  };
                  response.push(selectedItem);
              }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
  })();
});

// #endregion

// #region filter Courses by Category

app.get('/api/courses/category', (req, res) => {
  (async () => {
      try {
          const category = req.headers['category']; // Get email from request headers
          if (!category) {
              return res.status(400).send('category header is required');
          }

          let query = db.collection('Courses').where('category', '==', category); // Filter courses by category
          let response = [];
          await query.get().then(querySnapshot => {
              let docs = querySnapshot.docs;
              for (let doc of docs) {
                  const selectedItem = {
                      id: doc.id,
                      courseName: doc.data().name,
                      author: doc.data().author,
                      category: doc.data().category,
                      price: doc.data().price,
                      rating: doc.data().rating,
                      students: doc.data().students,
                      AuthorEmail: doc.data().Email,
                      image:doc.data().image
                  };
                  response.push(selectedItem);
              }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
  })();
});

// #endregion

// #region Get specific course details by id

app.get('/api/Courses/:id', (req, res) => {
  (async () => {
      try {
          const document = db.collection('Courses').doc(req.params.id);
          let item = await document.get();
          
          if (!item.exists) {
            return res.status(404).send('No data found');
        }
          let response = item.data();
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// #endregion

// #region Add an item to Cart POST
app.post('/api/addToCart', (req, res) => {
  (async () => {
      try {
        await db.collection('Cart').doc('/' + req.body.id + '/')
            .create({
              userId:req.body.userId,
              courseId:req.body.courseId, 
              status:req.body.status,
              price:req.body.price            
            });
        return res.status(200).send("Success");
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});
  // #endregion

// #region Cart items -GET 

app.get('/api/cartItems', (req, res) => {
  (async () => {
      try {
          const userid = req.headers['userid'];
          if (!userid) {
              return res.status(400).send('User Id header is required');
          }
          let query = db.collection('Cart').where('userId', '==', userid).where("status",'==',"added"); 
          let response = [];
          await query.get().then(querySnapshot => {
              let docs = querySnapshot.docs;
              for (let doc of docs) {
                  const selectedItem = {
                      courseId:doc.data().courseId,
                      itemId:doc.id,
                      price:doc.data().price
                  };
                  response.push(selectedItem);
              }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
  })();
});

// #endregion

// #region Bought items -GET 

app.get('/api/boughtItems', (req, res) => {
  (async () => {
      try {
          const userid = req.headers['userid'];
          if (!userid) {
              return res.status(400).send('User Id header is required');
          }
          let query = db.collection('Cart').where('userId', '==', userid).where("status",'==',"bought"); 
          let response = [];
          await query.get().then(querySnapshot => {
              let docs = querySnapshot.docs;
              for (let doc of docs) {
                  const selectedItem = {
                      courseId:doc.data().courseId,
                      itemId:doc.id
                  };
                  response.push(selectedItem);
              }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
  })();
});

// #endregion

// #region Remove from cart -Delete
app.delete('/api/cart/:id', async (req, res) => {
  try {
    const document = db.collection('Cart').doc(req.params.id);
    const docSnapshot = await document.get();

    if (!docSnapshot.exists) {
      return res.status(404).send('Document not found');
    }

    await document.delete();
    res.status(200).send('Delete success');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting document');
  }
});




  // #endregion

// #region Buy course...update cart table -Put
app.put('/api/checkoutCart/:id', (req, res) => {
(async () => {
  try {
      const document = db.collection('Cart').doc(req.params.id);
      await document.update({
          status: req.body.status
      });
      return res.status(200).send('Update success');
  } catch (error) {
      console.log(error);
      return res.status(500).send(error);
  }
  })();
});
// #endregion

exports.app = functions.https.onRequest(app);
