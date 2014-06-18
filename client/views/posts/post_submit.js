Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var post = {
      location: $(e.target).find('[name=location]').val(),
      lat:$(e.target).find('[name=lat]').val(),
      lng:$(e.target).find('[name=lng]').val(),
      strain: $(e.target).find('[name=strain]').val(),
      treatment: $(e.target).find('[name=treatment]').val(),
      notes: $(e.target).find('[name=notes]').val(),
      drug: $(e.target).find('[name=drug]').val(),
      cases: $(e.target).find('[name=cases]').val()
    }
    
    Meteor.call('post', post, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        
        if (error.error === 302)
          Router.go('postPage', {_id: error.details})
      } else {
        Router.go('postPage', {_id: id});
      }
    });
  }
});