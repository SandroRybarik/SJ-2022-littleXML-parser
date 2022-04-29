export default {
    'S': {
        langle: ['ELEMENT'],
        xml_open: ['XMLDECL', 'ELEMENT'],
    },
    'XMLDECL': {
        xml_open: ['xml_open', 'xml_ver', 'VERNUMB', 'xml_close'],
    },
    'VERNUMB': {
        digit: ['NUMBER', 'dot', 'NUMBER'],
    },
    'ELEMENT': {
        langle: ['langle', 'NAME', 'ELEMENT2'],
    },
    'ELEMENT2': {
        rangle: ['rangle', 'ELEMENT3'],
        slash_rangle: ['slash_rangle'],
    },
    'ELEMENT3': {
        curly_right: ['WORDS', 'ENDTAG'],
        curly_left: ['WORDS', 'ENDTAG'],
        exclamation_mark: ['WORDS', 'ENDTAG'],
        question_mark: ['WORDS', 'ENDTAG'],
        digit: ['WORDS', 'ENDTAG'],
        letter: ['WORDS', 'ENDTAG'],
        langle_slash: ['ELEMENTS', 'ENDTAG'],
        langle: ['ELEMENTS', 'ENDTAG'],
    },
    'ENDTAG': {
        langle_slash: ['langle_slash', 'NAME', 'rangle'],
    },
    'WORDS': {
        curly_right: ['WORD', 'WORDS2'],
        curly_left: ['WORD', 'WORDS2'],
        exclamation_mark: ['WORD', 'WORDS2'],
        question_mark: ['WORD', 'WORDS2'],
        digit: ['WORD', 'WORDS2'],
        letter: ['WORD', 'WORDS2'],
    },
    'WORDS2': {
        space: ['space', 'WORDS'],
        langle_slash: [/*epsilon*/],
    },
    'ELEMENTS': {
        langle_slash: [/*epsilon*/],
        langle: ['ELEMENT'],
    },
    'NAME': {
        letter: ['LETTER', 'NAMECHAR'],
        colon: ['colon', 'NAMECHAR'],
        underscore: ['underscore', 'NAMECHAR'],
    },
    'NAMECHAR': {
        digit: ['DIGIT', 'NAMECHAR'],
        letter: ['LETTER', 'NAMECHAR'],
        colon: ['colon', 'NAMECHAR'],
        underscore: ['underscore', 'NAMECHAR'],
        minus: ['minus', 'NAMECHAR'],
        dot: ['dot', 'NAMECHAR'],
        rangle: [/*epsilon*/],
        slash_rangle: [/*epsilon*/],
    },
    'LETTER': {
        letter: ['letter'],
    },
    'NUMBER': {
        digit: ['DIGIT', 'NUMBER2'],
    },
    'NUMBER2': {
        digit: ['DIGIT', 'NUMBER2'],
        dot: [/*epsilon*/],
        xml_close: [/*epsilon*/],
    },
    'DIGIT': {
        digit: ['digit'],
    },
    'WORD': {
        curly_right: ['CHAR', 'WORD2'],
        curly_left: ['CHAR', 'WORD2'],
        exclamation_mark: ['CHAR', 'WORD2'],
        question_mark: ['CHAR', 'WORD2'],
        digit: ['CHAR', 'WORD2'],
        letter: ['CHAR', 'WORD2'],
    },
    'WORD2': {
        curly_right: ['CHAR', 'WORD2'],
        curly_left: ['CHAR', 'WORD2'],
        exclamation_mark: ['CHAR', 'WORD2'],
        question_mark: ['CHAR', 'WORD2'],
        digit: ['CHAR', 'WORD2'],
        letter: ['CHAR', 'WORD2'],
        space: [/*epsilon*/],
        langle_slash: [/*epsilon*/],
        
    },
    'CHAR': {
        curly_right: ['curly_right'],
        curly_left: ['curly_left'],
        exclamation_mark: ['exclamation_mark'],
        question_mark: ['question_mark'],
        digit: ['DIGIT'],
        letter: ['LETTER'],
    }
}
