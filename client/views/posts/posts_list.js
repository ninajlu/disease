Template.postsList.helpers({
  postsWithRank: function() {
    this.posts.rewind();
    return this.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  }
});
Template.postsList.events({
	'click .toggleHeatmap': function (eve) {
		console.log("heee");
		gmaps.toggleHeatmap();
    },
    'click .changeGradient': function (eve) {
      gmaps.changeGradient();
    },
    'click .changeRadius': function (eve) {
      gmaps.changeRadius();
    },
    'click .changeOpacity': function (eve) {
      gmaps.changeOpacity();
    }
});
Template.postsList.rendered = function(){
        gmaps.initialize(this.data);
};

