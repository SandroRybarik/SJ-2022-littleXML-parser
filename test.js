// import { parse, tokenize } from "./tokenizer.js"
import PARSING_TABLE from './parsing_table.js'
import { parse, tokenize } from './tokenizer.js'

const shouldPass = [
    `<?xmlversion=1.1?><a>x</a>`,
    '<?xmlversion=1.1?><level1><level2>aa</level2></level1>',
    '<:./>',
    '<e>aa</e>',
    '<element>a</element>',
    '<element>aa</element>',
    '<eleme_:nt>COOL</eleme_:nt>',
    '<element><x>hello world</x></element>',
    '<?xmlversion=1.1?><a./>',
]

const shouldNotPass = [
    '<x>ahoj<e></e></x>',
    '<>Hi!</e>',
    '<hello>',
    'hello',
    '',
]

const shouldFailToTokenize = [
    '<?xmlverssion=1.1?><a>x</a>', // tokenizer will throw exception of enexpected token
]

const syntacticRecovery = [
    'aversion=1.1?><a>x</a>', // replacing 'a' (letter token) -> (xml_open token)
    'version=1.1?><a>x</a>', // prepending (xml_open token)
    '.version=1.1?><a>x</a>', // replacing '.' (dot token) -> (xml_open token)
];

const lexicalRecovery = [
    '<<<element/>', // replace all <<< with single <
    '<<level1><<level2>aa</level2></level1>', // Multiple lexical recovery from <<
];

/**
 * 
 * @param {string[]} inputs 
 * @param {string} assertion
 */
function test(inputs, assertion) {
    for (const input of inputs) {
        console.log(`\nRUNNING TEST: "${input}"\n`)
        try {
            if (parse(tokenize(input), PARSING_TABLE, input, null, 0) !== assertion) {
                return false
            }
        } catch (e) {
            console.log(e.toString())
            return assertion === 'THROW'
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

    const shouldFailTokenize = test(shouldFailToTokenize, 'THROW')

    const syntacticRecoveryResult = test(syntacticRecovery, 'ACCEPTED')

    const lexicalRecoveryResult = test(lexicalRecovery, 'ACCEPTED')

    console.log('')
    console.log(`${'shouldPass'.padEnd(20, '.')} ${shouldPassResult ? 'OK' : 'FAIL'}`)
    console.log(`${'shouldNotPass'.padEnd(20, '.')} ${shouldNotPassResult ? 'OK' : 'FAIL'}`)
    console.log(`${'shouldFailTokenize'.padEnd(20, '.')} ${shouldFailTokenize ? 'OK' : 'FAIL'}`)
    console.log(`${'syntacticRecovery'.padEnd(20, '.')} ${syntacticRecoveryResult ? 'OK' : 'FAIL'}`)
    console.log(`${'lexicalRecovery'.padEnd(20, '.')} ${lexicalRecoveryResult ? 'OK' : 'FAIL'}`)
}

doTesting()
