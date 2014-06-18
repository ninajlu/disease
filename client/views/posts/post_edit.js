Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    
    var postProperties = {
      location: $(e.target).find('[name=location]').val(),
      lat:$(e.target).find('[name=lat]').val(),
      lng:$(e.target).find('[name=lng]').val(),
      strain: $(e.target).find('[name=strain]').val(),
      treatment: $(e.target).find('[name=treatment]').val(),
      notes: $(e.target).find('[name=notes]').val(),
      drug: $(e.target).find('[name=drug]').val(),
      cases: $(e.target).find('[name=cases]').val()
    }
    
    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('home');
    }
  }
});
