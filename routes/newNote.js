/* 
 * GET new note page
 */

exports.newNote = function(req, res){
  res.render('newNote.jade', { locals: 
    { title: 'Write a note!' }
  });
};
