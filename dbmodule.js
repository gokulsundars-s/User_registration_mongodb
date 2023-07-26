var databaseUrl = "mongodb://127.0.0.1:27017/student";
var mongojs = require("./node_modules/mongojs");
var db = mongojs(databaseUrl);
var fs = require("fs");
//var collections = db.collection("student");
console.log("Connected");
var email_update = "";

exports.authenticateUser = function (username, email, response) {
  console.log(username);
  console.log(email);
  db.student.find({ username: username, email: email }, function (err, op) {
    if (err || !op) {
      response.write("..Not authorized user" || err);
      response.end();
    } else if (op.length == 0) {
      response.write("Not authorized user");
      response.end();
    } else {
      email_update += email;
      fs.readFile("./1.html", (err, data) => {
        if (err) {
          throw err;
        }
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
      });
      // response.end("ok");
    }
  });
};

exports.saveUser = function (username, email, res) {
  console.log("Saving user to mongo");
  db.student.insert(
    { username: username, email: email },
    function (err, saved) {
      if (err || !saved) console.log(err);
      else {
        res.end("user details are stored.....");
      }
    }
  );
};

exports.deleteUser = function (username, email, response) {
  db.student.remove({ username: username, email: email }, function (err, del) {
    console.log(del);
    if (del.deletedCount == 0) {
      response.end("error in delete of the user");
    } else {
      response.end("user successfully deleted");
    }
  });
};

exports.updateUser = function (username, res) {
  console.log(email_update);
  db.student.update(
    { email: email_update },
    { $set: { username: username } },
    function (err, data) {
      console.log(data);
      if (data.nModified > 0) res.end("Your Username has been changed");
      else res.end("Your Username has not been changed");
    }
  );
};
