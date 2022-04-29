// import { parse, tokenize } from "./tokenizer.js"
import ptable from './v2parsingtable.js'
import { parse, tokenize, lexicalRecovery } from './tokenizerv2.js'

const shouldPass = [
    `<?xmlversion=1.1?><a>x</a>`,
    '<:./>',
    '<e>aa</e>',
    '<element>a</element>',
    '<element>aa</element>',
    '<eleme_:nt>COOL</eleme_:nt>',
    '<element><x>hello world</x></element>',
]

const shouldNotPass = [
    '<x>ahoj<e></e></x>',
    '<hello>',
    'hello'
]


const syntacticRecoveryExample = [
    'version=1.1?>' // => <hello />
];

const lexicalRecoveryExample = [
    '<<element />' // => reads as <element>
];

// console.log(lexicalRecovery(tokenize(lexicalRecoveryExample[0])))

function mainTest() {
    try {
        for (const test of shouldPass) {
            const tokens = tokenize(test)
            if (parse(tokens,ptable, test) === 'ACCEPTED') {
                console.log("OK")
            } else {
                // console.log(`ERROR on ${test}`)
                throw `ERROR on ${test}`
            }
        }
        
        for (const test of shouldNotPass) {
            const tokens = tokenize(test)
            if (parse(tokens,ptable, test) === 'NOT_ACCEPTED') {
                console.log("OK")
            } else {
                // console.log(`ERROR on ${test}`)
                throw `ERROR on ${test}`
            }
        }
    } catch (e) {
        console.log(e)
    }
}
// mainTest()
// langle colon dot slash_rangle

function testSyntaxRecovery() {
    console.log(tokenize('Xversion=1.1?><a>x</a>'))
    console.log(parse(tokenize('Xversion=1.1?><a>x</a>'), ptable, 'Xversion=1.1?><a>x</a>', null, 0))
}

testSyntaxRecovery()