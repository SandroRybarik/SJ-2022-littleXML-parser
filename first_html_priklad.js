// kontrola vystupu voci prikladu v ucebnici...

const GRAMMAR_HTML = [
    [ 'htmldocument', 'html_tz documentheader documentbody html_tk', ],
    [ 'documentheader', 'head_tz headertags head_tk', ],
    [ 'headertags', 'headertag headertags', ],
    [ 'headertags', '𝝴', ],
    [ 'headertag', 'titletag', ],
    [ 'headertag', 'metatag', ],
    [ 'titletag', 'title_tz content title_tk', ],
    [ 'metatag', 'meta_tz word meta_ts word meta_tk', ],
    [ 'documentbody', 'body_tz bodytags body_tk', ],
    [ 'bodytags', 'bodytag bodytags', ],
    [ 'bodytags', '𝝴', ],
    [ 'bodytag', 'table table_tz', ],
    [ 'bodytag', 'list ul ol dl_tz', ],
    [ 'bodytag', 'paragraph p_tz', ],
    [ 'bodytag', 'content znaky', ],
    [ 'paragraph', 'p_tz bodytag p_tk', ],
    [ 'table', 'table_tz tablerows table_tk', ],
    [ 'tablerows', 'tablerow tablerows', ],
    [ 'tablerows', '𝝴', ],
    [ 'tablerow', 'tr_tz tablecells tr_tk', ],
    [ 'tablecells', 'tablecell tablecells', ],
    [ 'tablecells', '𝝴', ],
    [ 'tablecell', 'td_tz bodytag A', ],
    [ 'A', 'td_tk', ],
    [ 'A', '𝝴', ],
    [ 'list', 'unordered', ],
    [ 'list', 'ordered', ],
    [ 'list', 'definitionlist', ],
    [ 'unordered', 'ul_tz listitems ul_tk', ],
    [ 'ordered', 'ol_tz listitems ol_tk', ],
    [ 'listitems', 'listitem listitems', ],
    [ 'listitems', '𝝴', ],
    [ 'listitem', 'li_tz bodytag', ],
    [ 'definitionlist', 'dl_tz defterms dl_tk', ],
    [ 'defterms', 'defterm defterms', ],
    [ 'defterms', '𝝴', ],
    [ 'defterm', 'dt_tz deftems', ],
    [ 'deftems', 'deftem deftems', ],
    [ 'deftems', '𝝴', ],
    [ 'deftem', 'dd_tz bodytag', ],
    [ 'content', 'word B', ],
    [ 'B', 'medzera conten', ],
    [ 'B', 'koniec contentu', ],
    [ 'word', 'char C', ],
    [ 'C', 'word', ],
    [ 'C', '𝝴', ],
    [ 'char', 'digit', ],
    [ 'char', 'letter', ],
    [ 'char', 'bodka', ],
    [ 'char', 'ciarka', ],
    [ 'char', 'vykricnik', ],
    [ 'char', 'otaznik', ],
]

// HTML GRAMMAR
function isTokenHTML(symbol) {
    const TOKENS = [
        'html_tz',
        'head_tz',
        'title_tz',
        'body_tz',
        'p_tz',
        'table_tz',
        'li_tz',
        'dl_tz',
        'dt_tz',
        'dd_tz',
        'dl_tk',
        'tr_tz',
        'td_tz',
        'ul_tz',
        'ol_tz',
        'html_tk',
        'head_tk',
        'title_tk',
        'body_tk',
        'p_tk',
        'table_tk',
        'tr_tk',
        'td_tk',
        'ul_tk',
        'ol_tk',
        'meta_tz',
        'meta_ts',
        'meta_tk',
        'bodka',
        'ciarka',
        'vykricnik',
        'otaznik',
        'medzera',
        'digit',
        'letter',
    ]

    return TOKENS.includes(symbol)
}

function isTerminalHTML(value) {
    return isTokenHTML(value)
}
function isNonTerminalHTML(value) {
    return !isTokenHTML(value)
}
function canBeEpsilonHTML(nonTerminal, grammar) {
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

function findFirstHTML(inputRule, grammar) {
    let first = [];
    for (const [rule, inference] of grammar) {
        if (rule === inputRule) {
            const rightSide = inference.split(" ")

            for (let i = 0; i < rightSide.length; i++) {
                const symbol = rightSide[i]
                if (isTerminalHTML(symbol) || symbol === '𝝴') {
                    first.push(symbol);
                    break;
                }

                if (isNonTerminalHTML(symbol)) {
                    const firstOfSymbol = findFirstHTML(symbol, grammar)
                    first = first.concat(firstOfSymbol);
                    if (!canBeEpsilonHTML(symbol, grammar)) {
                        break;
                    }
                }

            }
        }
    }
    return Array.from(new Set(first))
}


for (const rule of Array.from(new Set(GRAMMAR_HTML.map(([rule, _]) => { return rule })))) {
    console.log(`${rule} :: { ${findFirstHTML(rule, GRAMMAR_HTML).join(",")} }`)
}
