# Tool
https://smlweb.cpsc.ucalgary.ca/start.html

# grammar format, terminals = upper case
S     -> XMLDECL ELEMENT.
S     -> ELEMENT.
XMLDECL         -> xml_open xml_ver VERNUMB xml_close.
VERNUMB         -> NUMBER dot NUMBER.
ELEMENT         -> EMPTYELEMENTTAG.
ELEMENT         -> STARTTAG STARTTAG_AFTER.
STARTTAG_AFTER  -> WORDS ENDTAG.
STARTTAG_AFTER  -> ELEMENTS ENDTAG.
STARTTAG        -> langle NAME rangle.
ENDTAG          -> langle_slash NAME rangle.
WORDS           -> WORD WORDS.
WORDS           -> .
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
NUMBER          -> DIGIT DIGIT NUMBERNUMBER.
NUMBERNUMBER    -> DIGIT NUMBERNUMBER.
NUMBERNUMBER    -> .
DIGIT           -> digit.
WORD            -> CHAR WORDWORD.
WORDWORD        -> CHAR WORDWORD.
WORDWORD        -> .
CHAR            -> leter.
CHAR            -> digit.
CHAR            -> underscore.
CHAR            -> colon.
CHAR            -> minus.
CHAR            -> dot.
CHAR            -> space.