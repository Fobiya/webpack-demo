module.exports = {
    plugins: [
        require('cssnano'),
        require('css-mqpacker')({
            preset: [
                'default', {
                    discardComments: {
                        removeAll: true
                    }
                }
            ]
        })
    ]
}