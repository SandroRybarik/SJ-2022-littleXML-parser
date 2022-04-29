const TOKEN_MAP = {
    'version=': 'xml_ver',
    '<?xml': 'xml_open',
    '?>': 'xml_close',
    '/>': 'slash_rangle',
    '</': 'langle_slash',
    '>': 'rangle',
    ' ': 'space',
    '<': 'langle',
    ':': 'colon',
    '_': 'underscore',
    '-': 'minus',
    '.': 'dot',
}

const REGEXP_TOKEN_MAP = {
    '^[A-Za-z]': 'letter',
    '^[0-9]': 'digit',
    '^[\\n\\t]': '__whitespace__',
}

const input = "<?xmlversion=2.2?>"

/**
 * 
 * @param {string} input 
 */
export function tokenize(input) {
    let position = 0;
    const tokens = [];
    let breakout = false

    while (position < input.length) {
        breakout = false
        for (const [key, val] of [...Object.entries(TOKEN_MAP), ...Object.entries(REGEXP_TOKEN_MAP)]) {
            if (input.substring(position).startsWith(key)) {
                tokens.push({
                    position,
                    type: val,
                })

                position += key.length
                breakout = true
                break
            }

            if (key.startsWith('^')) { // dealing with regex matching
                const match = input.substring(position).match(key)
                if (match) {
                    tokens.push({
                        position,
                        type: val,
                    })

                    position += match[0].length
                    break
                }
            }
        }

    }
    return tokens
}

/**
 * 
 * @param {{position: number, type: string}[]} tokens 
 */
export function lexicalRecovery(tokens) {
    const justTypes = tokens.map(e => e.type)
    // Case to recovery from:
    // langle langle -> langle
    const recoveryPositions = []
    for (let i = 0; i < tokens.length - 1; i++) {
        if (justTypes[i] === 'langle' && justTypes[i+1] === 'langle') {
            console.log('RECOVERY: langle, langle -> lange')
            recoveryPositions.push(i)
        }
    }
    return tokens.filter((v, idx) => !recoveryPositions.includes(idx)) // filter out duplicates
}

function reportStep(token, stack, message) {
    console.log(`TOKEN( ${token} ), STACK( ${stack.join(', ')} ) -- ${message}`)
}

export function parse(tokens, table, originalInput, recoveringFrom, inpIdx) {
    // Filter whitespace tokens
    tokens = tokens.filter(t => t.type !== '__whitespace__')

    const stack = ['S']
    // let inpIdx = 0
    reportStep(tokens[0]['type'], stack, 'Initial State')
    while (stack.length > 0) {
        const pop = stack.pop()
        
        if (inpIdx >= tokens.length) {
            return 'NOT_ACCEPTED'
        }

        const curr = tokens[inpIdx]['type']
        
        reportStep(curr, stack, `Popped ${pop} from stack`)
        if (curr === pop) {
            inpIdx++
            reportStep(curr, stack, `Moving on input to (${inpIdx <= tokens.length - 1 ? tokens[inpIdx]['type'] : '$'} ${inpIdx <= tokens.length - 1 ? originalInput[tokens[inpIdx]['position']] : null})`)
        }
        else if (table[pop][curr]) {
            let toStack = [...table[pop][curr]]
            toStack = toStack.reverse()
            stack.push(...toStack)
            reportStep(curr, stack, 'Pushed to stack')
        } else {
            reportStep(curr, stack, `Error happened (last pop = (${pop})`)

            // Check current grammar Rule
            // pop is current rule
            let recovered = false
            let recoveryTokens = null
            if (pop === 'S' && recoveringFrom !== 'S') { // try to recovery only from 'S'
                const possibleNonterminals = Object.keys(table[pop])
                for (const pnt of possibleNonterminals) {
                    console.log(`possibleNonterminals ==> ${pnt}`)
                    // modify tokens
                    let newTokens = [...tokens]
                    newTokens[inpIdx] = { position: inpIdx, type: pnt }
                    console.log(newTokens)
                    // try to parse it
                    if (parse(newTokens, table, originalInput, 'S', inpIdx) === 'ACCEPTED') {
                        console.log(`SUCCESSFUL SYNTAX RECOVERY`)
                        recovered = true
                        tokens = newTokens
                    }
                }
            }

            if (recovered) {
                continue
            }

            return 'NOT_ACCEPTED'
        }
    }

    return 'ACCEPTED'
}

/**
 * 
 * @param {{position: number, type: string}[]} tokens 
 * @param {object} ptbale parsing table
 * @param {(tokens: any[], table: object, originalInput: string) => string} parseFunc
 */
export function syntaxRecovery(tokens, ptable, originalInput, parseFunc) {
    // recovery on XMLDECL
    const tryToParse = parseFunc(tokens, ptable, originalInput)

    if (tryToParse === 'NOT_ACCEPTED') {

    }

}