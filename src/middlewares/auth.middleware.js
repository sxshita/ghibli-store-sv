function checkAuth(req, res, next){
    if(req.isAuthenticated()){
      next();
    } else {
      res.redirect("/login")
    }
}

export default checkAuth;