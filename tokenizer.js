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

function reportStep(token, stack, message) {
    console.log(`TOKEN( ${token} ), STACK( ${stack.join(', ')} ) -- ${message}`)
}

export function parse(tokens, originalInput) {

    // Filter whitespace tokens
    tokens = tokens.filter(t => t.type !== '__whitespace__')

    const table = {
        'S': {
            'langle': ['ELEMENT'],
            'xml_open': ['XMLDECL', 'ELEMENT'],
        },
        'XMLDECL': {
            'xml_open': ['xml_open', 'xml_ver', 'VERNUMB', 'xml_close'],
        },
        'VERNUMB': {
            'digit': ['NUMBER', 'dot', 'NUMBER'],
        },
        'NUMBER': {
            'digit': ['DIGIT', 'NUMBERNUMBER'],
        },
        'NUMBERNUMBER': {
            'dot': [/*'epsilon'*/],
            'digit': ['DIGIT', 'NUMBERNUMBER'],
            'xml_close': [/*'epsilon'*/],
        },
        'DIGIT': {
            'digit': ['digit'],
        },
        'ELEMENT': {
            'langle': ['langle', 'NAME', 'E_PRIME'],
        },
        'E_PRIME': {
            'slash_rangle': ['slash_rangle'],
            'rangle': ['rangle', 'INNER'],
        },
        'INNER': {
            'dot': ['WORDS', 'ENDTAG'],
            'minus': ['WORDS', 'ENDTAG'],
            'colon': ['WORDS', 'ENDTAG'],
            'underscore': ['WORDS', 'ENDTAG'],
            'digit': ['WORDS', 'ENDTAG'],
            'letter': ['WORDS', 'ENDTAG'],
            'langle': ['ELEMENT', 'ELEMENTS', 'ENDTAG'],
            'langle_slash': ['ENDTAG'],
        },
        'ENDTAG': {
            'langle_slash': ['langle_slash', 'NAME', 'rangle'],
        },
        'WORDS': {
            'dot': ['WORD', 'WORDS_PRIME'],
            'minus': ['WORD', 'WORDS_PRIME'],
            'colon': ['WORD', 'WORDS_PRIME'],
            'underscore': ['WORD', 'WORDS_PRIME'],
            'digit': ['WORD', 'WORDS_PRIME'],
            'letter': ['WORD', 'WORDS_PRIME'],
        },
        'WORDS_PRIME': {
            'space': ['space', 'WORDS'],
            'langle_slash': [/*'epsilon'*/],
        },
        'ELEMENTS': {
            'langle': ['ELEMENT'],
            'langle_slash': [/*'epsilon'*/],
        },
        'NAME': {
            'colon': ['colon', 'NAMELETTER'],
            'underscore': ['underscore', 'NAMELETTER'],
            'letter': ['LETTER', 'NAMELETTER'],
        },
        'NAMELETTER': {
            'dot': ['NAMECHAR', 'NAMELETTERONE'],
            'minus': ['NAMECHAR', 'NAMELETTERONE'],
            'colon': ['NAMECHAR', 'NAMELETTERONE'],
            'underscore': ['NAMECHAR', 'NAMELETTERONE'],
            'digit': ['NAMECHAR', 'NAMELETTERONE'],
            'letter': ['NAMECHAR', 'NAMELETTERONE'],
        },
        'NAMELETTERONE': {
            'dot': ['NAMECHAR', 'NAMELETTERONE'],
            'minus': ['NAMECHAR', 'NAMELETTERONE'],
            'colon': ['NAMECHAR', 'NAMELETTERONE'],
            'underscore': ['NAMECHAR', 'NAMELETTERONE'],
            'digit': ['NAMECHAR', 'NAMELETTERONE'],
            'letter': ['NAMECHAR', 'NAMELETTERONE'],
            'slash_rangle': [/*'epsilon'*/],
            'rangle': [/*'epsilon'*/],
        },
        'NAMECHAR': {
            'dot': ['dot'],
            'minus': ['minus'],
            'colon': ['colon'],
            'underscore': ['underscore'],
            'digit': ['digit'],
            'letter': ['letter'],
        },
        'LETTER': {
            'letter': ['letter'],
        },
        'WORD': {
            'dot': ['CHAR', 'WORD_PRIME'],
            'minus': ['CHAR', 'WORD_PRIME'],
            'colon': ['CHAR', 'WORD_PRIME'],
            'underscore': ['CHAR', 'WORD_PRIME'],
            'digit': ['CHAR', 'WORD_PRIME'],
            'letter': ['CHAR', 'WORD_PRIME'],
        },
        'WORD_PRIME': {
            'dot': ['WORD'],
            'minus': ['WORD'],
            'colon': ['WORD'],
            'underscore': ['WORD'],
            'digit': ['WORD'],
            'letter': ['WORD'],
            'space': [/*'epsilon'*/],
            'langle_slash': [/*'epsilon'*/],
        },
        'CHAR': {
            'dot': ['dot'],
            'minus': ['minus'],
            'colon': ['colon'],
            'underscore': ['underscore'],
            'digit': ['digit'],
            'letter': ['letter'],
        },
    }

    const stack = ['S']
    let inpIdx = 0
    reportStep(tokens[0]['type'], stack, 'Initial State')
    while (stack.length > 0) {
        const pop = stack.pop()
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
            return 'NOT_ACCEPTED'
        }
    }

    return 'ACCEPTED'
}
