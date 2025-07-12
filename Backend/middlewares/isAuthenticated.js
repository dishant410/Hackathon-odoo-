import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                message: "User is not Authenticated."
            })
        }
        // console.log(token);
        const decode = await jwt.verify(token, process.env.JWT_SECRET || "jnjininujfnocnojn");
        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token."
            });
        }
        req.user = { id: decode.id };
        next();

    } catch (err) {
        console.log(err);
    }

}
export default isAuthenticated;