Posts = new Meteor.Collection('posts');
Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'lat','lng', 'location', 'strain','notes','drug','cases', 'treatment').length > 0);
  }
});

Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user()
      
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new incidents");
    
    // ensure the post has a location
    if (!postAttributes.location)
      throw new Meteor.Error(422, 'Please fill in a location');
    
    // check that there are no previous posts with the same link
/*    if (postAttributes.coordinates) {
      throw new Meteor.Error(302, 
        'This link has already been posted', 
        postWithSameLink._id);
    }*/
    console.log(postAttributes.location);
    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes,'location','notes', 'drug', 'cases','treatment'), {
      userId: user._id, 
      lat:0,
      lng:0,
      author: user.username, 
      submitted: new Date().getTime(),
      edited: new Date().getTime(),
      commentsCount: 0,
      starrs: [], votes: 0
    });
    
    var postId = Posts.insert(post);
    Meteor.call('geocode', postId, postAttributes.location, function(error, data) {

    });
    return postId;

  },

  star: function(postId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to star");
    
    Posts.update({
      _id: postId, 
      starrs: {$ne: user._id}
    }, {
      $addToSet: {starrs: user._id},
      $inc: {votes: 1}
    });
  }
});