export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (err) {
            if (err.issues) {
                const errorMessages = err.issues.map((error) => {
                    return `${error.path.join('.')} - ${error.message}`;
                });

                return res.status(400).json({
                    message: "Validation Failed",
                    errors: errorMessages
                });
            }
            
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message
            });
        }
    };
};