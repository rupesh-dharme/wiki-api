const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleScheme = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleScheme);

app.route("/articles")

  .get(function (req, res) {
    Article.find({}, function (err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save(function (err) {
      if (!err) {
        res.send("Successfully posted the article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all the articles.");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:title")

.get(function(req, res) {
    Article.findOne({title: req.params.title}, function(err, article) {
        if (article) {
            res.send(article);
        } else {
            res.send("No article found with this title.");
        }
    })
})

.put(function(req, res) {
  Article.updateOne(
    {title: req.params.title},
    {title: req.body.title, content: req.body.content},
    {},
    function(err, doc) {
      if (!err) {
        res.send(doc);
      }
    }
  )
})

.patch(function(req, res) {
  Article.update(
    {title: req.params.title},
    {$set: req.body},
    function(err) {
      if (!err) {
        res.send("Successfully updated the article.");
      }
    }
  )
})

.delete(function(req, res) {
  Article.deleteOne(
    {name: req.params.title},
    function(err, result) {
      if (!err) {
        res.send("The object is deleted.");
      }
    }
  )
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Successfully listening on port 3000.");
});
