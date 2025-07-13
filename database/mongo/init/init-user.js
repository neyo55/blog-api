// mongo-init.js
db.createUser({
  user: "neyo",
  pwd: "neyo@53669",
  roles: [
    {
      role: "readWrite",
      db: "blog-db"
    }
  ]
});
