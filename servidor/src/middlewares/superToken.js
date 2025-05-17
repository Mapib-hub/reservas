import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequire = (req, res, next) => {
    const {token} = req.cookies;

    if(!token) return res.status(400).json({message: "No Token, No Autorizado"});

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({message: "Invalid Token"});

        req.user = user;

        if(req.user.id !== "65ecfcbac92d9ad6c82451c7") {
            return res.status(400).json({message: "No Token, No Autorizado"});
            //return res.redirect("/api/noticias");
        } else {
            next();
        }
    } );
};
