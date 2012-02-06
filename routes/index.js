
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'CrowdNotes' })
};

/* 
 * GET new note page
 */

exports.newNote = function(req, res){
  res.render('newNote.jade', { locals: 
    { title: 'Write a note!' }
  });
};

/* 
 * GET new user page
 */

exports.newUser = function(req, res){
  res.render('newUser.jade', { locals: 
    { title: 'Create a user!' }
  });
};
