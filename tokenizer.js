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
    '^[A-Za-z]+': 'word',
    '^[0-9]+': 'digit',
}

const input = "<?xmlversion=2.2?>"

/**
 * 
 * @param {string} input 
 */
function tokenize(input) {
    let position = 0;
    const tokens = [];
    let breakout = false

    while (position < input.length) {
        breakout = false
        // console.log(input.substring(position))
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

console.log(tokenize(input))

function parse(tokens) {
    // $,dot,minus,colon,underscore,digit,letter,slash_rangle,langle,space,rangle,langle_slash,xml_close,xml_ver,xml_open
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
            'digit': ['DIGIT', 'DIGIT', 'NUMBERNUMBER'],
        },
        'NUMBERNUMBER': {
            'dot': ['epsilon'],
            'digit': ['DIGIT', 'NUMBERNUMBER'],
            'xml_close': ['epsilon'],
        },
        'DIGIT': {
            'digit': ['digit'],
        }
        // ...
    }

    const stack = ['S'] // empty
    let currentIndex = 0
    let currentInput = tokens[currentIndex]['type']
    while(stack.length !== 0) {
        const peak = stack[stack.length - 1]
        if (peak === currentInput) {
            stack.pop()
            currentIndex++
            currentInput = tokens[currentIndex]['type']
            console.log(stack, currentInput, peak)
            continue
        } else if (peak === 'epsilon') {
            stack.pop()
            console.log(stack, currentInput, peak)
            continue
        }

        const pop = stack.pop()
        const next = table[pop][currentInput]
        if (!next) {
            console.error("ERROR")
            return
        }
        stack.push(...next.reverse())
        console.log(stack, currentInput, peak)
    }
}

function parse2(tokens) {
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
            'digit':  ['DIGIT', 'NUMBERNUMBER'],
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
            'emptyelementtag': ['EMPTYELEMENTTAG'],
            'langle': ['STARTTAG', 'STARTTAG_AFTER'],
        },
        'STARTTAG_AFTER': {
            'char': ['WORDS', 'ENDTAG'],
            'langle': ['ELEMENTS', 'ENDTAG'],
        }
        // ...
    }

    const stack = ['S']
    let inpIdx = 0
    while (stack.length > 0) {
        const pop = stack.pop()
        const curr = tokens[inpIdx]['type']
        console.log(stack, `[ ${curr} :: ${pop} ]`)
        if (curr === pop) {
            inpIdx++
        }
        else if (table[pop][curr]) {
            const toStack = [...table[pop][curr]]
            toStack.reverse()
            stack.push(...toStack)
        } else {
            console.error("ERROR")
            return
        }
    }
}

parse2(tokenize(input))