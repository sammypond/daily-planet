const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const fs = require('fs');
const methodOverride = require('method-override');


const PORT = 3000;


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(methodOverride('_method'));


app.get('/', function(req, res){
    res.send('We should add some nicelading page stuff here');
});
//GET ALL ARTICLES
app.get('/articles', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    res.render('articles/index', {articleData});
});

//GET ARTICLES NEW - SERVE UP NEW ARTICLE FORM
app.get('/articles/new', function(req, res){
    res.render('articles/new');
})

//GET articles/edit
app.get('/articles/:id/edit', function(req, res){
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    let id = parseInt(req.params.id)
    res.render('articles/edit', {article: articleData[id], id});
})

//GET ONE ARTICLE
app.get('/articles/:id', function(req, res){
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/show', {article: articleData[id], id})
});

//POST /ARTICLES
app.post('/articles', function(req, res){
    //read in our JSON file
    let articles = fs.readFileSync('./articles.json');
    //convert it to an array 
    let articleData = JSON.parse(articles);
    //push our new data into the array
    let newArticle = {
        title: req.body.articleTitle,
        body: req.body.articleBody
    }
    articleData.push(newArticle);
    //write the array back to the file
    fs.writeFileSync('./articles.json', JSON.stringify(articleData))

    res.redirect('/articles');
})

//DELETE /dinosaurs
app.delete('/articles/:id', function(req, res){
    //read the data from the file
    let articles = fs.readFileSync('./articles.json');
    //parse the data into an object
    var articleData = JSON.parse(articles);
    //splice out the item at the specified index
    var id = parseInt(req.params.id);
    articleData.splice(id, 1);
    //stringify the object
    var articleString = JSON.stringify(articleData);
    //write the object back to the file
    fs.writeFileSync('./articles.json', articleString);

    res.redirect('/articles');
})

//PUT ROUTE
app.put('/articles/:id', function(req, res){
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    articleData[id].title = req.body.articleTitle;
    articleData[id].body = req.body.articleBody;
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect("/articles/" + id);
})

app.listen( PORT || 3000 );