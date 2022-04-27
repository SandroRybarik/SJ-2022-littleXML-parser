# Tool
https://smlweb.cpsc.ucalgary.ca/start.html

# grammar format, terminals = upper case
S     -> XMLDECL ELEMENT.
S     -> ELEMENT.
XMLDECL         -> xml_open xml_ver VERNUMB xml_close.
VERNUMB         -> NUMBER dot NUMBER.
ELEMENT         -> langle NAME E_PRIME.
E_PRIME         -> slash_rangle.
E_PRIME         -> rangle INNER.
INNER           -> ENDTAG.
INNER           -> ELEMENT ELEMENTS ENDTAG.
INNER           -> WORDS ENDTAG.
ENDTAG          -> langle_slash NAME rangle.
WORDS           -> WORD WORDS_PRIME.
WORDS_PRIME     -> space WORDS.
WORDS_PRIME     -> .
ELEMENTS        -> ELEMENT.
ELEMENTS        -> .
EMPTYELEMENTTAG -> langle NAME slash_rangle.
NAME            -> LETTER NAMELETTER.
NAME            -> underscore NAMELETTER.
NAME            -> colon NAMELETTER.
NAMELETTER      -> NAMECHAR NAMELETTERONE.
NAMELETTERONE   -> NAMECHAR NAMELETTERONE.
NAMELETTERONE   -> .
NAMECHAR        -> letter.
NAMECHAR        -> DIGIT.
NAMECHAR        -> underscore.
NAMECHAR        -> colon.
NAMECHAR        -> minus.
NAMECHAR        -> dot.
LETTER          -> letter.
NUMBER          -> DIGIT NUMBERNUMBER.
NUMBERNUMBER    -> DIGIT NUMBERNUMBER.
NUMBERNUMBER    -> .
DIGIT           -> digit.
WORD            -> CHAR WORD_PRIME.
WORD_PRIME      -> WORD.
WORD_PRIME      -> .
CHAR            -> letter.
CHAR            -> digit.
CHAR            -> underscore.
CHAR            -> colon.
CHAR            -> minus.
CHAR            -> dot.