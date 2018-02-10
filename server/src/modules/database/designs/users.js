module.exports.default = {

  views: {

    byId: {
      map: function(doc) {
        if (doc.docType === 'user') {
          emit(doc._id, doc);
        }
      }
    },

    byUsername: {
      map: function(doc) {
        if (doc.docType === 'user') {
          emit(doc.username, doc);
        }
      }
    },

    byGithubId: {
      map: function(doc) {
        if (doc.docType === 'user' && doc.auth.github) {
          emit(doc.auth.github.id, doc);
        }
      }
    },

    byTwitterId: {
      map: function(doc) {
        if (doc.docType === 'user' && doc.auth.twitter) {
          emit(doc.auth.twitter.id, doc);
        }
      }
    }

  }

};
