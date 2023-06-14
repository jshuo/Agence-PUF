const { assert } = require("chai")
const { curly } = require('node-libcurl')
const parallel = require('mocha.parallel')

const externalIP = ""

parallel("HTTP test", () => {
    // it("Should return info", done => {
    //     curly.get(`http://${externalIP}/cgi-bin/get_info`)
    //         .then(({ statusCode, data, headers }) => {
    //             const json = JSON.parse(Buffer.from(data).toString())
    //             assert.hasAllKeys(json, ["uid", "public_key"])
    //             assert.lengthOf(json.public_key, 128)

    //             if (statusCode == 200) done()
    //         })
    // })

    for (let i = 0; i < 20; i++) {
        it("Should return random number", done => {
            const size = Math.floor(Math.random() * 31) + 1
            curly.get(`http://${externalIP}/cgi-bin/get_random_2?${size}`)
                .then(({ statusCode, data, headers }) => {
                    const obj = Buffer.from(data).toString()
                        .split('\n')[1]
                    const json = JSON.parse(obj)
                    assert.hasAllKeys(json, ["rn", "signature_payload"])
                    assert.lengthOf(json.rn, size * 2)

                    if (statusCode == 200) done()
                })
        })
    }
})
