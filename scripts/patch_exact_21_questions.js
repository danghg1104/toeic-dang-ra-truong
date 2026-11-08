const fs = require('fs');
const path = require('path');

console.log('--- Patching Exact 21 Questions with True English Options ---');

const patches = {
    // TEST 1
    1: {
        141: {
            options: [
                "A. I have already begun drawing up plans for your kitchen.",
                "B. We are not planning to begin work for another two weeks.",
                "C. Your living room is particularly spacious and airy.",
                "D. We have not yet received your current payment."
            ],
            ans: 1, // B
            ansLetter: "B"
        },
        146: {
            options: [
                "A. We hope you will use this resource to manage your health-care needs.",
                "B. The staff will close the office early on Friday afternoons.",
                "C. Please be sure to come to our office fifteen minutes in advance.",
                "D. We apologize for any confusion about your appointment time."
            ],
            ans: 0, // A
            ansLetter: "A"
        },
        185: {
            options: [
                "A. It will provide lunch for musicians.",
                "B. It will have artwork for sale on its property.",
                "C. It will offer arts-and-crafts workshops.",
                "D. It will provide the stage for performers."
            ],
            ans: 1, // B
            ansLetter: "B"
        }
    },
    // TEST 2
    2: {
        32: {
            q: "What kind of work does the man do?",
            options: [
                "A. He is a tour guide.",
                "B. He is a landlord.",
                "C. He repairs appliances.",
                "D. He delivers food."
            ],
            ans: 3, // D
            ansLetter: "D"
        },
        137: {
            options: [
                "A. Many soaps have a fragrance that is too strong for customers.",
                "B. Handwashing is essential for workers in the food industry.",
                "C. Several factors can influence the price of soap products.",
                "D. All the ingredients are sourced from plants found in the wild."
            ],
            ans: 3, // D
            ansLetter: "D"
        }
    },
    // TEST 4
    4: {
        142: {
            options: [
                "A. The theater will close for renovations.",
                "B. Call the theater at 704-555-0138 to reserve tickets.",
                "C. Chang’s memoir is available online and at local bookstores.",
                "D. Chang grew up in Southern California and attended college in Minnesota."
            ],
            ans: 1, // B
            ansLetter: "B"
        },
        146: {
            options: [
                "A. I want to thank you again for the nomination.",
                "B. I can certainly see the resemblance.",
                "C. I think this was all a misunderstanding.",
                "D. I believe this arrangement could be mutually beneficial."
            ],
            ans: 3, // D
            ansLetter: "D"
        },
        151: {
            q: "What is indicated about Dr. Jaris?",
            options: [
                "A. He is employed by a university laboratory.",
                "B. He has published a book on device design and development.",
                "C. He assembles prototypes of sensing instruments.",
                "D. He works as an engineer at Alita Technology."
            ],
            ans: 0, // A
            ansLetter: "A"
        }
    },
    // TEST 5
    5: {
        32: {
            q: "What does the woman ask the man to do for her?",
            options: [
                "A. Greet a client in the lobby",
                "B. Present a product pitch",
                "C. Organize some binders",
                "D. Make some photocopies"
            ],
            ans: 0, // A
            ansLetter: "A"
        },
        38: {
            q: "What department does the man work in?",
            options: [
                "A. Legal",
                "B. Accounting",
                "C. Human resources",
                "D. Public relations"
            ],
            ans: 0, // A
            ansLetter: "A"
        },
        45: {
            q: "Who does the man suggest contacting?",
            options: [
                "A. A leather supplier",
                "B. A delivery driver",
                "C. An interior designer",
                "D. A machine technician"
            ],
            ans: 0, // A
            ansLetter: "A"
        }
    },
    // TEST 7
    7: {
        13: {
            q: "How do I log on to this computer?",
            options: [
                "A. Some printer ink and paper.",
                "B. I’ll send you a temporary password.",
                "C. No, he was late."
            ],
            ans: 1, // B
            ansLetter: "B"
        },
        28: {
            q: "Ms. Martin is demonstrating the new software at the conference.",
            options: [
                "A. I live on Vine Street.",
                "B. No, they catered food last year.",
                "C. I thought she was on vacation."
            ],
            ans: 2, // C
            ansLetter: "C"
        },
        192: {
            q: "What does the price list indicate about bags?",
            options: [
                "A. They are available to buy in different quantities.",
                "B. They fit in all brands of umbrella-wrapping machines.",
                "C. They are not included in the price of PUW machines.",
                "D. They are sold in retail stores."
            ],
            ans: 0, // A
            ansLetter: "A"
        },
        194: {
            q: "What is the cost of the product that Mr. Barr reviewed?",
            options: [
                "A. $35",
                "B. $100",
                "C. $350",
                "D. $450"
            ],
            ans: 3, // D
            ansLetter: "D"
        }
    },
    // TEST 8
    8: {
        20: {
            q: "The product launch was a success, wasn’t it?",
            options: [
                "A. No, I haven’t eaten yet.",
                "B. Yes, we already have a lot of orders.",
                "C. He’ll meet you next week."
            ],
            ans: 1, // B
            ansLetter: "B"
        },
        28: {
            q: "What can I do for you, ma’am?",
            options: [
                "A. Tomorrow would be fine.",
                "B. My key card doesn’t work.",
                "C. Thanks, I will."
            ],
            ans: 1, // B
            ansLetter: "B"
        }
    },
    // TEST 9
    9: {
        29: {
            q: "Please close the door so that the presentation can start.",
            options: [
                "A. The car keys are on my desk.",
                "B. Our filing cabinets are full.",
                "C. We’re waiting for a few more people."
            ],
            ans: 2, // C
            ansLetter: "C"
        }
    },
    // TEST 10
    10: {
        13: {
            q: "Did we complete the inventory, or is there more to do?",
            options: [
                "A. OK, that’d be fine.",
                "B. We’re not quite finished.",
                "C. About 1,000 dollars."
            ],
            ans: 1, // B
            ansLetter: "B"
        },
        15: {
            q: "How can we interest the client in our business?",
            options: [
                "A. By sharing positive customer reviews.",
                "B. No, I didn't go this year.",
                "C. At the meeting last Wednesday."
            ],
            ans: 0, // A
            ansLetter: "A"
        },
        20: {
            q: "How many people are attending the orientation session?",
            options: [
                "A. There should be 21 people.",
                "B. Maybe next week.",
                "C. I can’t see the screen."
            ],
            ans: 0, // A
            ansLetter: "A"
        }
    }
};

for (const t in patches) {
    const filePath = path.join(__dirname, '..', 'data', 'ets2026', `test${String(t).padStart(2, '0')}_full.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    function applyPatch(q) {
        if (!q) return;
        const p = patches[t][q.qNum || q.num];
        if (p) {
            if (p.q) q.q = p.q;
            if (p.options) q.options = p.options;
            if (p.ans !== undefined) q.ans = p.ans;
            if (p.ansLetter !== undefined) q.ansLetter = p.ansLetter;
            console.log(`✓ Patched Test ${t} Q${q.qNum || q.num}`);
        }
    }

    if (data.listening) {
        if (data.listening.part1) data.listening.part1.forEach(applyPatch);
        if (data.listening.part2) data.listening.part2.forEach(applyPatch);
        if (data.listening.part3) data.listening.part3.forEach(s => s.questions ? s.questions.forEach(applyPatch) : applyPatch(s));
        if (data.listening.part4) data.listening.part4.forEach(s => s.questions ? s.questions.forEach(applyPatch) : applyPatch(s));
    }
    if (data.reading) {
        if (data.reading.part5) data.reading.part5.forEach(applyPatch);
        if (data.reading.part6) data.reading.part6.forEach(s => s.questions ? s.questions.forEach(applyPatch) : applyPatch(s));
        if (data.reading.part7) data.reading.part7.forEach(s => s.questions ? s.questions.forEach(applyPatch) : applyPatch(s));
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

console.log('✓ All 21 questions healed with authentic English options!');
