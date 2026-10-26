const fs = require('fs');

// Comprehensive CEFR Classifier Engine
class CEFRClassifier {
  constructor() {
    this.knownLevels = {
      // A1 (Fundamental)
      'water': 'A1', 'book': 'A1', 'house': 'A1', 'happy': 'A1', 'family': 'A1', 'food': 'A1',
      'school': 'A1', 'friend': 'A1', 'money': 'A1', 'time': 'A1', 'work': 'A1', 'day': 'A1',
      'help': 'A1', 'name': 'A1', 'place': 'A1', 'room': 'A1', 'city': 'A1', 'country': 'A1',
      'car': 'A1', 'phone': 'A1', 'music': 'A1', 'movie': 'A1', 'morning': 'A1', 'night': 'A1',
      'dog': 'A1', 'cat': 'A1', 'baby': 'A1', 'man': 'A1', 'woman': 'A1', 'child': 'A1',

      // A2 (Elementary / Daily)
      'travel': 'A2', 'flight': 'A2', 'ticket': 'A2', 'weather': 'A2', 'airport': 'A2', 'hotel': 'A2',
      'dinner': 'A2', 'lunch': 'A2', 'breakfast': 'A2', 'holiday': 'A2', 'vacation': 'A2', 'station': 'A2',
      'bus': 'A2', 'train': 'A2', 'driver': 'A2', 'visitor': 'A2', 'tourist': 'A2', 'luggage': 'A2',
      'passport': 'A2', 'advice': 'A2', 'invitation': 'A2', 'appointment': 'A2', 'message': 'A2',
      'decide': 'A2', 'explain': 'A2', 'borrow': 'A2', 'lend': 'A2', 'repair': 'A2', 'clean': 'A2',

      // B1 (Intermediate)
      'convenient': 'B1', 'experience': 'B1', 'develop': 'B1', 'schedule': 'B1', 'environment': 'B1',
      'improve': 'B1', 'afford': 'B1', 'budget': 'B1', 'colleague': 'B1', 'customer': 'B1',
      'delivery': 'B1', 'discount': 'B1', 'employee': 'B1', 'employer': 'B1', 'equipment': 'B1',
      'facility': 'B1', 'feedback': 'B1', 'guarantee': 'B1', 'increase': 'B1', 'interview': 'B1',
      'manager': 'B1', 'payment': 'B1', 'product': 'B1', 'promotion': 'B1', 'receipt': 'B1',

      // B2 (Upper Intermediate / Business)
      'negotiate': 'B2', 'collaborate': 'B2', 'innovative': 'B2', 'sustainable': 'B2', 'strategy': 'B2',
      'significant': 'B2', 'implement': 'B2', 'allocate': 'B2', 'clarify': 'B2', 'compensation': 'B2',
      'compliance': 'B2', 'comprehensive': 'B2', 'coordinate': 'B2', 'criteria': 'B2', 'dedicate': 'B2',
      'efficiency': 'B2', 'evaluate': 'B2', 'expertise': 'B2', 'facilitate': 'B2', 'perspective': 'B2',

      // C1 (Advanced)
      'meticulous': 'C1', 'prerequisite': 'C1', 'ambiguous': 'C1', 'profound': 'C1', 'exacerbate': 'C1',
      'coherent': 'C1', 'contemplate': 'C1', 'cumbersome': 'C1', 'detrimental': 'C1', 'discrepancy': 'C1',
      'exemplify': 'C1', 'formidable': 'C1', 'inevitable': 'C1', 'intricate': 'C1', 'lucrative': 'C1',
      'paramount': 'C1', 'plausible': 'C1', 'prevalent': 'C1', 'scrutinize': 'C1', 'unprecedented': 'C1',

      // C2 (Mastery)
      'serendipity': 'C2', 'quintessential': 'C2', 'ubiquitous': 'C2', 'obfuscate': 'C2', 'idiosyncrasy': 'C2',
      'anachronistic': 'C2', 'ephemeral': 'C2', 'equanimity': 'C2', 'fastidious': 'C2', 'iconoclast': 'C2',
      'juxtaposition': 'C2', 'magnanimous': 'C2', 'nonchalant': 'C2', 'ostentatious': 'C2', 'panacea': 'C2',
      'perfunctory': 'C2', 'quixotic': 'C2', 'recalcitrant': 'C2', 'sycophant': 'C2', 'zeitgeist': 'C2'
    };
  }

  classify(word) {
    const clean = word.toLowerCase().trim();
    if (this.knownLevels[clean]) {
      return this.knownLevels[clean];
    }

    // Heuristic Classification based on morphological & syllable complexity
    const len = clean.length;
    const syllables = (clean.match(/[aeiouy]{1,2}/g) || []).length;

    // C2 markers
    if (len >= 13 || syllables >= 5 || /(?:ification|ousness|lessness|istically|ocentric|morphology)$/.test(clean)) {
      return 'C2';
    }
    // C1 markers
    if (len >= 10 || syllables >= 4 || /(?:ology|aceous|icular|escent|ization|bility|cracy|pathy)$/.test(clean)) {
      return 'C1';
    }
    // B2 markers
    if (len >= 8 || syllables >= 3 || /(?:tion|ment|ence|ance|able|ible|ical|ively|iate|uate)$/.test(clean)) {
      return 'B2';
    }
    // B1 markers
    if (len >= 6 || syllables >= 2 || /(?:ing|ful|less|ness|ship|ward|ize|ise)$/.test(clean)) {
      return 'B1';
    }
    // A2 markers
    if (len >= 5 || syllables >= 2) {
      return 'A2';
    }
    // A1 base
    return 'A1';
  }
}

const classifier = new CEFRClassifier();
const tests = [
  'book', 'water', 'flight', 'weather', 'schedule', 'budget',
  'negotiate', 'innovative', 'meticulous', 'unprecedented',
  'serendipity', 'quintessential', 'transformation', 'communication',
  'biodegradable', 'unconditionally', 'cat', 'pen'
];

console.log('Results:');
tests.forEach(t => {
  console.log(`${t} -> ${classifier.classify(t)}`);
});
