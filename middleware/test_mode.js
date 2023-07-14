export default class TestMode {
  
  constructor(){}

    static checkTestMode  (req, res, next) {
    if(req.app.get('isTestMode')) {
        return res.status(403).json({ message: "The server is in test mode. Access denied." });
    }
    next();
    }
}