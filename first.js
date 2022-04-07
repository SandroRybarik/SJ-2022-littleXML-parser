// Not used yet
const TOKEN_MAP = {
    '<?xml'      : 'XML_OPEN',
    'version='   : 'XML_VER',
    '?>'         : 'XML_CLOSE',
    '.'          : 'DOT',
    '<'          : 'LANGLE',
    '>'          : 'RANGLE',
    '</'         : 'LANGLE_SLASH',
    '/>'         : 'SLASH_RANGLE',
    '_'          : 'UNDERSCORE',
    ':'          : 'COLON',
    '-'          : 'MINUS',
    '/[A-Za-z]/' : 'LETTER',
    '/[0-9]/'    : 'DIGIT',
}

const GRAMMAR = [
//  [                  ->           ]
    [ 'xmldokument'     , 'xmldecl' ],
    [ 'xmldokument'     , 'element' ],
    [ 'xmldecl'         , 'XML_OPEN XML_VER vernumb XML_CLOSE' ],
    [ 'vernumb'         , 'number DOT number' ],
    [ 'element'         , 'emptyelementtag' ],
    [ 'element'         , 'starttag starttag_after' ],
    [ 'starttag_after'  , 'words endtag' ],
    [ 'starttag_after'  , 'elements endtag' ],
    [ 'starttag'        , 'LANGLE name RANGLE' ],
    [ 'endtag'          , 'LANGLE_SLASH name RANGLE' ],
    [ 'words'           , 'word' ],
    [ 'words'           , 'word words' ],
    [ 'elements'        , 'element' ],
    [ 'elements'        , '𝝴' ],
    [ 'emptyelementtag' , 'LANGLE name SLASH_RANGLE' ],
    [ 'name'            , 'letter nameletter' ],
    [ 'name'            , 'UNDERSCORE nameletter' ],
    [ 'name'            , 'COLON nameletter' ],
    [ 'nameletter'      , 'namechar nameletterone' ],
    [ 'nameletterone'   , 'namechar nameletterone' ],
    [ 'nameletterone'   , '𝝴' ],
    [ 'letter'          , 'LETTER' ],
    [ 'number'          , 'DIGIT DIGIT numbernumber' ],
    [ 'numbernumber'    , 'DIGIT numbernumber' ],
    [ 'numbernumber'    , '𝝴' ],
    [ 'digit'           , 'DIGIT' ],
    [ 'word'            , 'char char wordword' ],
    [ 'wordword'        , 'char wordword' ],
    [ 'wordword'        , '𝝴' ],
    [ 'char'            , 'letter' ],
    [ 'char'            , 'digit' ],
    [ 'char'            , 'UNDERSCORE' ],
    [ 'char'            , 'COLON' ],
    [ 'char'            , 'MINUS' ],
    [ 'char'            , 'DOT' ],
]


function isTerminal(value) {
    return /[A-Z_]/.test(value);
}
function isNonTerminal(value) {
    return /[a-z_]/.test(value);
}
function canBeEpsilon(nonTerminal, grammar) {
    for (const [rule, inference] of grammar) {
        if (rule === nonTerminal) {
            const rightSide = inference.split(" ")
            if (rightSide[0] === '𝝴') {
                return true;
            }
        }
    }
    return false;
}

function findFirst(inputRule, grammar) {
    let first = [];
    for (const [rule, inference] of grammar) {
        if (rule === inputRule) {
            const rightSide = inference.split(" ")

            for (let i = 0; i < rightSide.length; i++) {
                const symbol = rightSide[i]
                if (isTerminal(symbol)) {
                    first.push(symbol);
                    break;
                }

                if (isNonTerminal(symbol)) {
                    const firstOfSymbol = findFirst(symbol, grammar)
                    first = first.concat(firstOfSymbol);
                    if (!canBeEpsilon(symbol, grammar)) {
                        break;
                    }
                }

            }
        }
    }
    return Array.from(new Set(first))
}


for (const rule of Array.from(new Set(GRAMMAR.map(([rule, _]) => rule )))) {
    console.log(`${rule} :: { ${findFirst(rule, GRAMMAR).join(",")} }`)
}