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
    '{': 'curly_left',
    '}': 'curly_right',
    '?': 'question_mark',
    '!': 'exclamation_mark',
}

const REGEXP_TOKEN_MAP = {
    '^[A-Za-z]': 'letter',
    '^[0-9]': 'digit',
    '^[\\n\\t]': '__whitespace__',
}

/**
 * 
 * @param {string} input 
 */
export function tokenize(input) {
    let position = 0;
    const tokens = [];
    

    while (position < input.length) {
        let found = false

        for (const [key, val] of [...Object.entries(TOKEN_MAP), ...Object.entries(REGEXP_TOKEN_MAP)]) {
            if (input.substring(position).startsWith(key)) {
                tokens.push({
                    position,
                    type: val,
                })

                position += key.length
                found = true
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
                    found = true
                    break
                }
            }
        }

        if (!found) {
            // no token matched, error
            throw new Error(`Failed to tokenize, unexpected token at position ${position}`)
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
    if (tokens.length < 1) {
        return 'NOT_ACCEPTED'
    }

    // Filter whitespace tokens
    tokens = tokens.filter(t => t.type !== '__whitespace__')
    // Try to do lexical recovery
    tokens = lexicalRecovery(tokens)

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
        else if (table[pop] && table[pop][curr]) {
            let toStack = [...table[pop][curr]]
            toStack = toStack.reverse()
            stack.push(...toStack)
            reportStep(curr, stack, 'Pushed to stack')
        } else {
            reportStep(curr, stack, `Error happened (last pop = (${pop})`)

            let recovered = false
            if (pop === 'S' && recoveringFrom !== 'S') { // try to recovery only from 'S'
                const possibleNonterminals = Object.keys(table[pop])
                
                // Try to modify a token at that position
                for (const pnt of possibleNonterminals) {
                    // modify tokens
                    let newTokens = [...tokens]
                    newTokens[inpIdx] = { position: inpIdx, type: pnt }
                    // try to parse it
                    if (parse(newTokens, table, originalInput, 'S', inpIdx) === 'ACCEPTED') {
                        console.log(`SYNTAX RECOVERY (${curr}) -> (${pnt})`)
                        recovered = true
                        tokens = newTokens
                    }
                }

                // Try to prepend new token at that position
                for (const pnt of possibleNonterminals) {
                    // modify tokens
                    let newTokens = [...tokens]
                    newTokens = [{ position: inpIdx, type: pnt }, ...newTokens ]
                    // try to parse it
                    if (parse(newTokens, table, originalInput, 'S', inpIdx) === 'ACCEPTED') {
                        console.log(`SYNTAX RECOVERY PREPENDED (${pnt})`)
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
