"""
Grammalecte - Thesaurus
"""

# License: GPL 3


from .thesaurus_data import dThesaurus as _dThesaurus


def getSyns (sWord):
    "return list of synonyms of <sWord>"
    if not sWord:
        return []
    if sWord in _dThesaurus:
        return _dThesaurus[sWord]
    if sWord[0:1].isupper():
        sWord = sWord.lower()
        if sWord in _dThesaurus:
            return _dThesaurus[sWord]
    return []
