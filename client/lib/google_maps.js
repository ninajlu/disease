gmaps={
  map:null,
  pointArray:[],
  heatmap:null,
  taxiData: [],
  initialize:function(posts) {
    var mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(37.774546, -122.433523),
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
          console.log("hey1");
          console.log(posts);
this.taxiData= [new google.maps.LatLng(37.782551, -122.445368),
    new google.maps.LatLng(37.782745, -122.444586),
    new google.maps.LatLng(37.782842, -122.443688),
    new google.maps.LatLng(37.782919, -122.442815),
    new google.maps.LatLng(37.782992, -122.442112),
    new google.maps.LatLng(37.783100, -122.441461),
    new google.maps.LatLng(37.783206, -122.440829),
    new google.maps.LatLng(37.783273, -122.440324),
    new google.maps.LatLng(37.783316, -122.440023),
    new google.maps.LatLng(37.783357, -122.439794),
    new google.maps.LatLng(37.783371, -122.439687),
    new google.maps.LatLng(37.783368, -122.439666),
    new google.maps.LatLng(37.783383, -122.439594),
    new google.maps.LatLng(37.783508, -122.439525),
    new google.maps.LatLng(37.783842, -122.439591),
    new google.maps.LatLng(37.784147, -122.439668),
    new google.maps.LatLng(37.784206, -122.439686),
    new google.maps.LatLng(37.784386, -122.439790),
    new google.maps.LatLng(37.784701, -122.439902),
    new google.maps.LatLng(37.784965, -122.439938),
    new google.maps.LatLng(37.785010, -122.439947)];
    posts.posts.rewind();
    posts=posts.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
    console.log(posts);
    var p;
    for(p in posts){
      post=posts[p];
      this.taxiData.push(new google.maps.LatLng(post.lat,post.lng));
    }
    
    this.pointArray = new google.maps.MVCArray(this.taxiData);

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.pointArray
    });

    this.heatmap.setMap(this.map);
    
  },

  toggleHeatmap:function() {
    this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
  },

  changeGradient:function() {
    var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
    ]
    this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
  },

  changeRadius: function() {
    this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
  },

  changeOpacity:function() {
    this.heatmap.set('opacity', this.heatmap.get('opacity') ? null : 0.2);
  }
}