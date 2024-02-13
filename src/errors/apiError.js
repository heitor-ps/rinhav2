function ApiError({ statusCode = 500, error = "internal_error", message = "Internal Error" }) {
    return {
        statusCode,
        error,
        message
    }
}

module.exports = ApiError