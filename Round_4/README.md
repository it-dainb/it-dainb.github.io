# Abbreviations and Slangs in English

A dictionary of Abbreviations and Slangs in English

## Installation

Download abbreviations.p

```bash
git pull https://github.com/it-dainb/it-dainb.github.io.git
```

Install requirement library

```bash
pip install spacy
!python -m spacy download en_core_web_sm
```

## Usage

Import abbreviations_dict

```python
import pickle

with open("abbreviations.p", "rb") as fb:
  abbreviations_dict = pickle.load(fb)
```
Create de_slangs function

```python
import spacy
nlp = spacy.load("en_core_web_sm")

def de_slangs(text):

    processed_text = []
    for tok in nlp(text):
        if tok in slang_dict:
            processed_text.append(abbreviations_dict[tok.lower()])
        else:
            processed_text.append(tok.lower())
    
    return " ".join(processed_text)

text = "Hi everyone. My name is Dai. I come from VN. I'm coder. ty !!!"
de_slangs(text)
```
Output

```bash
hi everyone . my name is dai . i come from vietnam . i'm coder. thank you !!!
```
