
export const createComment = (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Comment created successfully"
    });
};