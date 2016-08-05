var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.param('post',function(req,res,next,id){
  var query = Post.findById(id);

  query.exec(function(err,post){
    if(err){return next(err)};
    if(!post){ return next(new Error('cant find post'));}

    req.post = post;
    return next();
  })
})

router.param('comment',function(req,res,next,id){
  var query = Comment.findById(id);

  query.exec(function(err,comment){
    if(err){return next(err)};
    if(!comment){return next(new Error('cant find comment'))};

    req.comment = comment;
    return next();
  })

})

router.get('/',function(req,res,next){
  Post.find(function(err,posts){
    if(err){return next(err)};

    res.json(posts);
  })
})


router.post('/',function(req,res,next){
  var post = new Post(req.body);

  post.save(function(err,post){
    if(err){return next(err)};

    res.json(post);
  })
});

router.get('/:post',function(req,res){
  req.post.populate('comments',function(err,post){
      res.json(req.post);
  })
})


router.put('/:post/upvote',function(req,res,next){
  req.post.upvote(function(err,post){
    if(err){return next(err);}

    res.json(post);
  })
})

router.post('/:post/comments',function(req,res,next){
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err,comment){
    if(err){return next(err)};
    req.post.comments.push(comment);
    req.post.save(function(err,post){
      res.json(comment);
    })
  })
})

router.put('/:post/comments/:comment/upvote'){
  req.comment.upvote(function(err,comment){
    res.json(comment);
  })
}

module.exports = router;