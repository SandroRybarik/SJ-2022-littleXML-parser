// import { parse, tokenize } from "./tokenizer.js"
import PARSING_TABLE from './parsing_table.js'
import { parse, tokenize } from './tokenizer.js'

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
    'hello',
    '',
]

const syntacticRecovery = [
    'aversion=1.1?><a>x</a>', // replacing 'a' (letter token) -> (xml_open token)
    'version=1.1?><a>x</a>', // prepending (xml_open token)
];

const lexicalRecovery = [
    '<<<element/>' // replace all <<< with single <
];

/**
 * 
 * @param {string[]} inputs 
 * @param {string} assertion
 */
function test(inputs, assertion) {
    for (const input of inputs) {
        console.log(`\nRUNNING TEST: "${input}"\n`)
        if (parse(tokenize(input), PARSING_TABLE, input, null, 0) !== assertion) {
            return false
        }
    }

    return true
}

/**
 * Runs all tests.
 */
function doTesting() {

    const shouldPassResult = test(shouldPass, 'ACCEPTED')

    const shouldNotPassResult = test(shouldNotPass, 'NOT_ACCEPTED')

    const syntacticRecoveryResult = test(syntacticRecovery, 'ACCEPTED')

    const lexicalRecoveryResult = test(lexicalRecovery, 'ACCEPTED')

    console.log('')
    console.log(`${'shouldPass'.padEnd(20, '.')} ${shouldPassResult ? 'OK' : 'FAIL'}`)
    console.log(`${'shouldNotPass'.padEnd(20, '.')} ${shouldNotPassResult ? 'OK' : 'FAIL'}`)
    console.log(`${'syntacticRecovery'.padEnd(20, '.')} ${syntacticRecoveryResult ? 'OK' : 'FAIL'}`)
    console.log(`${'lexicalRecovery'.padEnd(20, '.')} ${lexicalRecoveryResult ? 'OK' : 'FAIL'}`)
}

doTesting()
