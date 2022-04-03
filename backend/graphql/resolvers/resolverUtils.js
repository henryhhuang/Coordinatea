exports.isAuthenticated = function(context) {
    if (!context.req.session || !context.req.session.username) throw new Error("User is not authenticated.");
}

exports.isAuthorized = function (context, username, owner = null) {
    if (context.req.session.username != username && context.req.session.username != owner) throw new Error("User is not authorized.")
}