module.exports = {
    "presets":[
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    "plugins": [
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-transform-react-jsx", {
            "pragma": "React.createElement",
            "pragmaFrag": "React.Fragment"
        }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}