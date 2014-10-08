Meteor.publish('posts', function (options) {
  return Posts.find({}, options);
});

Meteor.publish('singlePost', function (id) {
  return id && Posts.find(id);
});

Meteor.publish('comments', function (postId) {
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function () {
  return Notifications.find({userId: this.userId});
});

if(Meteor.isServer) {
	Meteor.methods({
		'geocode': function geocode (postID, location) {
			var GeoCoder=Meteor.require('geocoder');
			console.log(GeoCoder);
			GeoCoder.getGeocodeSync = Meteor._wrapAsync(GeoCoder.geocode.bind(GeoCoder));
			var data = GeoCoder.getGeocodeSync(location);	
				//console.log("hey");
				Meteor.call('update', postID, data,function (e, d) {});
		},
		'update': function update(postID, data){
			var dat;
			//console.log("yum");
			//console.log(data);
			dat=data.results;
			//console.log(dat);
			var lat = dat[0].geometry.location.lat;
			var longg = dat[0].geometry.location.lng;
			var formatted = dat[0].formatted_address;
			// console.log(lat);
			// console.log(longg);
			// console.log(formatted);
			var postProperties = {};
			postProperties["location"] = formatted;
			postProperties["lat"] = lat;
			postProperties["lng"] = longg;
/*			console.log("yay");
			console.log(postProperties);
			console.log(postID);*/
			Posts.update(postID, {$set: postProperties}, function (err){
				console.log(err);
				console.log(Posts.find(postID));
			});

		}

	});
}
