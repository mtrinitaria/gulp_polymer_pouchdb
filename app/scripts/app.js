(function (document) {
  'use strict';

  
  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.appName = 'Yo, Polymer App!';

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('template-bound', function() {
    console.log('Our app is ready to rock!');
  });

  

  var db = new PouchDB('dbname');
  var showParents = function () {
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      // console.log(doc.rows);
      app.parents = doc.rows;
    });
  }


  /* add parent */
  app.addParent = function() {
    var parent = {
      _id: new Date().toISOString(),
      name:'parent 1', 
      gender:'female', 
      birth:'January 1, 1989', 
      children:[
        {name:'child 1', birth:'January 1, 2014'}, 
        {name:'child 2', birth:'January 1, 2014'}, 
        {name:'child 3', birth:'January 1, 2014'} 
      ]
    };
    db.put(parent, function callback(err, result) {
      if (!err) {
        showParents();
      }
    });
  };

  app.parentClick = function(e) {
    app.parent = e.target.templateInstance.model.parent;
  };
  app.deleteParent = function(e) {
    var selectedParent = e.target.templateInstance.model.parent;
    var index = app.parents.indexOf(selectedParent);
    var mydoc = app.parents[index];

    db.get(mydoc.id, function(err, doc) {
      db.remove(doc, function(err, response) { 
        if (!err) {
          showParents();
        }
      });
    });
  };
  app.saveParent = function() {
    db.get(app.parent.id, function(err, doc) {
      doc = app.parent.doc;
      db.put(doc, function(err, response) { 
        console.log(err, response)
        if (!err) {
          showParents();
        }
      });
    });
  };
  app.deleteChild = function(e) {
    var selectedChild = e.target.templateInstance.model.child;
    console.log(selectedChild, app.parent.doc.children)
    var index = app.parent.doc.children.indexOf(selectedChild);
    app.parent.doc.children.splice(index, 1);

  };

  showParents();
// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));


