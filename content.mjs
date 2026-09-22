/* CONTENT-START */
/* ============================================================
   CURRICULUM
   Every task starts from a blank scaffold, never from the answer.
   Hints climb: nudge, then method, then the shape of the line.
   Solutions are authored in Python and translated for JavaScript,
   which is the same verified path the language toggle uses.
   ============================================================ */

const LESSONS = [
{
  id: 'speak',
  level: 'Basics',
  title: 'Telling it to speak',
  idea: 'A program is a list of instructions, followed exactly.',
  teach: [
    { h: 'Nothing is implied',
      p: 'The computer does what you wrote, in the order you wrote it, and nothing else. It never guesses what you meant. That sounds harsh, but it is the reason programs are predictable.' },
    { h: 'One instruction shows a value',
      p: { python: 'print( ) puts something on the screen. Whatever you place between the brackets is what appears.',
           javascript: 'console.log( ) puts something on the screen. Whatever you place between the brackets is what appears.',
           ruby: 'puts shows something on the screen. Ruby does not need brackets around it, though it accepts them.' } },
    { h: 'Quotes mean "this is text"',
      p: 'Anything inside quotes is copied out exactly — spelling, spaces, capital letters and all. Open a quote and forget to close it and the program will not run at all.' }
  ],
  demo: { code: 'print("Hello!")\nprint("I am doing exactly what I was told.")',
          caption: 'Two instructions, run top to bottom.' },
  practice: { h: 'Say exactly what you mean',
    p: 'Most early errors are not misunderstandings of programming. They are a missing quote, a missing bracket, or a capital letter in the wrong place.' },
  tasks: [
    { id: 'speak-1', prompt: 'Print this line exactly: Salaam!',
      scaffold: { note: 'Write your instruction on the line below' },
      expect: ['Salaam!'],
      hints: ['You need one instruction, and it goes on its own line.',
              'The instruction is the one from the lesson above, with round brackets after it.',
              'Inside the brackets, put the text in double quotes: "Salaam!"'],
      solution: 'print("Salaam!")' },

    { id: 'speak-2', prompt: 'Print two lines: first Tea, then Biscuits.',
      scaffold: { note: 'Two instructions, one per line' },
      expect: ['Tea', 'Biscuits'],
      hints: ['Two separate instructions, one under the other.',
              'The order you write them is the order they happen.'],
      solution: 'print("Tea")\nprint("Biscuits")' },

    { id: 'speak-3', prompt: 'This program is broken. Fix it so it prints Chai.',
      scaffold: { note: null },
      override: { python: 'print("Chai)', javascript: 'console.log("Chai);', ruby: 'puts "Chai' },
      expect: ['Chai'],
      hints: ['Read the error message underneath. It names the problem.',
              'Count the quote marks. Text needs one at each end.'],
      solution: 'print("Chai")' }
  ]
},

{
  id: 'numbers',
  level: 'Basics',
  title: 'Doing arithmetic',
  idea: 'Numbers are values, not text, and the usual maths rules apply.',
  teach: [
    { h: 'Quotes change everything',
      p: 'Written with quotes, "5" is text — a character that looks like a five. Without quotes, 5 is a number you can do arithmetic with. Joining "5" and "5" gives "55". Adding 5 and 5 gives 10.' },
    { h: 'The symbols',
      p: 'Use + to add, - to subtract, * to multiply and / to divide. There is no × or ÷ on a keyboard, which is why * and / were chosen.' },
    { h: 'Order matters',
      p: 'Multiplication and division happen before addition and subtraction, exactly as in school maths. Round brackets force a different order: 2 + 3 * 4 is 14, but (2 + 3) * 4 is 20.' }
  ],
  demo: { code: 'print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(7 / 2)',
          caption: 'The same numbers, three different answers.' },
  practice: { h: 'Let the machine do the arithmetic',
    p: 'Write 60 * 60 rather than working out 3600 in your head and typing that. The reader can see where the number came from, and you cannot get it wrong.' },
  tasks: [
    { id: 'num-1', prompt: 'Print how many seconds there are in 3 hours. Let the program do the multiplication.',
      scaffold: { note: '3 hours, 60 minutes each, 60 seconds each' },
      expect: ['10800'],
      hints: ['Three numbers multiplied together, all inside the print brackets.',
              'Hours times minutes-per-hour times seconds-per-minute.'],
      solution: 'print(3 * 60 * 60)' },

    { id: 'num-2', prompt: 'A bill of 86 plus a tip of 14, split between 4 people. Print what each person pays.',
      scaffold: { note: 'Careful: the split happens after the tip is added' },
      expect: ['25'],
      hints: ['Without brackets, the division would only apply to the tip.',
              'Put the addition in brackets so it happens first.'],
      solution: 'print((86 + 14) / 4)' },

    { id: 'num-3', prompt: 'This prints 55 instead of 10. Fix it.',
      scaffold: { note: null, code: 'print("5" + "5")' },
      expect: ['10'],
      hints: ['Look closely at what is inside the brackets. Are those numbers?',
              'Quotes make text. Text joins end to end instead of adding.'],
      solution: 'print(5 + 5)' }
  ]
},

{
  id: 'variables',
  level: 'Basics',
  title: 'Remembering a value',
  idea: 'A name that points at a value, so you can use it and change it.',
  teach: [
    { h: 'A name holds a value',
      p: 'Writing price = 250 stores 250 under the name price. Afterwards, writing price anywhere means the same as writing 250.' },
    { h: '= does not mean equals',
      p: 'It means "put the value on the right into the name on the left". It is an instruction, not a statement of fact. That is why count = count + 1 makes sense: work out the right side, then store it back.' },
    { h: 'Values can change',
      p: 'Assign to the same name again and the old value is gone. The name always points at whatever was put in most recently.' }
  ],
  demo: { code: 'price = 250\ncount = 3\nprint(price * count)\nprice = 300\nprint(price * count)',
          caption: 'Step through this one. Watch price change in the Variables panel.' },
  practice: { h: 'Name things for the reader',
    p: 'Call it price, not p. You will read your own code far more often than you write it, and a name is free. Short names like i are accepted for loop counters only, because everyone already knows what they mean.' },
  tasks: [
    { id: 'var-1', prompt: 'Store 12 apples and 30 oranges under sensible names, then print the total number of fruit.',
      scaffold: { note: 'Store each count under a name, then print the total' },
      expect: ['42'],
      hints: ['Two names, each given a value on its own line.',
              'Then print the two names added together — not the numbers.'],
      craft: 'descriptiveNames',
      solution: 'apples = 12\noranges = 30\nprint(apples + oranges)' },

    { id: 'var-2', prompt: 'A score starts at 10. Add 5 to it, then print it. Print only the final score.',
      scaffold: { note: 'Start the score, change it, then print it' },
      expect: ['15'],
      hints: ['Assign to the same name a second time.',
              'The right side can mention the name itself: score = score + 5'],
      solution: 'score = 10\nscore = score + 5\nprint(score)' },

    { id: 'var-3', prompt: 'This program stops with an error. Fix it so it prints 20.',
      scaffold: { note: null, code: 'print(total)\ntotal = 20' },
      expect: ['20'],
      hints: ['Instructions run top to bottom. What does the first line know?',
              'A value has to exist before it can be printed.'],
      solution: 'total = 20\nprint(total)' }
  ]
},

{
  id: 'text',
  level: 'Basics',
  title: 'Working with text',
  idea: 'Joining, measuring, and mixing text with numbers safely.',
  teach: [
    { h: 'Joining text',
      p: 'The + symbol joins two pieces of text end to end. "Salaam, " + "Sobia" becomes "Salaam, Sobia". Notice the space is inside the quotes — the computer will not add one for you.' },
    { h: 'Text and numbers do not mix with +',
      p: 'Adding text to a number is refused, because there is no sensible answer. Instead, pass several values to the print instruction separated by commas, and each one is shown with a space between.' },
    { h: 'Measuring',
      p: { python: 'len(something) counts the characters in text, or the items in a list.',
           javascript: 'something.length counts the characters in text, or the items in a list.',
           ruby: 'something.length counts the characters in text, or the items in a list.' } }
  ],
  demo: { code: 'name = "Sobia"\nprint("Salaam, " + name)\nprint("Letters:", len(name))',
          caption: 'Two ways to combine: joining, and passing several values.' },
  practice: { h: 'Prefer commas to gluing',
    p: 'Joining with + forces everything to be text and breaks the moment a number appears. Commas handle any mixture, so reach for them first.' },
  tasks: [
    { id: 'text-1', prompt: 'Store the name Ayesha, then print: Salaam, Ayesha',
      scaffold: { note: 'Store the name first, then build the greeting' },
      expect: ['Salaam, Ayesha'],
      hints: ['Put the name in a variable on the first line.',
              'Join the greeting text to the name with +. Watch the comma and the space.'],
      solution: 'name = "Ayesha"\nprint("Salaam, " + name)' },

    { id: 'text-2', prompt: 'Print this exactly, using a comma rather than joining: Books: 14',
      scaffold: { note: 'Pass two values to the print instruction, separated by a comma' },
      expect: ['Books: 14'],
      hints: ['The text and the number are two separate values.',
              'A space appears automatically between them, so do not add one at the end of the text.'],
      solution: 'print("Books:", 14)' },

    { id: 'text-3', prompt: 'This one refuses to run. Fix it so it prints: Age: 30',
      scaffold: { note: null, code: 'print("Age: " + 30)' },
      expect: ['Age: 30'],
      hints: ['Read the error. It says which two kinds of thing were involved.',
              'Swap the + for a comma, and drop the trailing space from the text.'],
      solution: 'print("Age:", 30)' }
  ]
},

{
  id: 'choices',
  level: 'Basics',
  title: 'Making a choice',
  idea: 'Run some instructions only when a condition holds.',
  teach: [
    { h: 'A condition is a question',
      p: 'score > 100 is not a number. It is a question with a true or false answer. Compare with > < >= <= for order, == for "is the same as", and != for "is different from".' },
    { h: 'Two equals signs, not one',
      p: 'One = stores a value. Two == asks whether things match. Mixing them up is the single most common beginner error, and now you know it exists.' },
    { h: 'The block belongs to the condition',
      p: { python: 'The line ends with a colon, and everything indented underneath it belongs to that choice. Indentation is not decoration here — it is how the computer knows where the block ends.',
           javascript: 'The condition sits in round brackets, and everything inside the curly braces belongs to that choice. The braces are how the computer knows where the block ends.',
           ruby: 'The condition follows the word if with no brackets needed, and everything up to the matching end belongs to that choice. That end is how the computer knows where the block stops.' } },
    { h: 'Otherwise',
      p: 'else covers every case the condition did not. Between an if and an else, exactly one block always runs — never both, never neither.' }
  ],
  demo: { code: 'temperature = 34\nif temperature > 30:\n    print("Too hot")\nelse:\n    print("Fine")',
          caption: 'Change 34 to 12 and run it again.' },
  practice: { h: 'Check the narrowest case first',
    p: 'When several conditions could all be true at once, the first one that matches wins. Put the most specific test at the top or it will never be reached.' },
  tasks: [
    { id: 'if-1', prompt: 'A score of 47 is stored. Print pass if it is 50 or more, otherwise print fail.',
      scaffold: { note: 'Decide what to print', code: 'score = 47' },
      expect: ['fail'],
      hints: ['Ask the question about score, then give a block for each answer.',
              '"50 or more" is >= 50, not > 50.'],
      solution: 'score = 47\nif score >= 50:\n    print("pass")\nelse:\n    print("fail")' },

    { id: 'if-2', prompt: 'A score of 72 is stored. Print A for 80 or more, B for 60 or more, and C for anything else.',
      scaffold: { note: 'Three possible answers, one of them must happen', code: 'score = 72' },
      expect: ['B'],
      hints: ['You need a middle case between the if and the else.',
              { python: 'That middle case is written elif, followed by its own condition.',
                javascript: 'That middle case is written else if, followed by its own condition in brackets.',
                ruby: 'That middle case is written elsif — no second e — followed by its own condition.' },
              'Check 80 first. If you check 60 first, a score of 90 would also pass it.'],
      solution: 'score = 72\nif score >= 80:\n    print("A")\nelif score >= 60:\n    print("B")\nelse:\n    print("C")' },

    { id: 'if-3', prompt: 'This prints the wrong word. The condition is right — the blocks are the wrong way round. Fix it.',
      scaffold: { note: null, code: 'age = 12\nif age >= 18:\n    print("child")\nelse:\n    print("adult")' },
      expect: ['child'],
      hints: ['Work out by hand which block runs when age is 12.',
              'The condition asks whether the age is 18 or more. What should that block print?'],
      solution: 'age = 12\nif age >= 18:\n    print("adult")\nelse:\n    print("child")' }
  ]
},

{
  id: 'booleans',
  level: 'Basics',
  title: 'Combining tests',
  idea: 'Asking two questions at once, and flipping an answer over.',
  teach: [
    { h: 'True and false are values',
      p: 'A comparison produces one of exactly two values. You can store one in a variable, print it, and pass it around like any number or piece of text.' },
    { h: 'Both, or either',
      p: { python: 'and is satisfied only when both sides hold. or is satisfied when at least one does. Read them out loud and they mean what they say.',
           javascript: '&& is satisfied only when both sides hold. || is satisfied when at least one does. Two symbols, not one — a single & or | means something else entirely.',
           ruby: '&& is satisfied only when both sides hold. || is satisfied when at least one does. Ruby also accepts the words and and or, but the symbols are what you will see in most code.' } },
    { h: 'Flipping an answer',
      p: { python: 'not turns true into false and false into true, which is how you say "as long as it is not raining".',
           javascript: '! turns true into false and false into true, which is how you say "as long as it is not raining". It goes in front of the thing it flips.',
           ruby: '! turns true into false and false into true, which is how you say "as long as it is not raining". It goes in front of the thing it flips.' } }
  ],
  demo: { code: 'age = 20\nticket = True\nif age >= 18 and ticket:\n    print("come in")\nelse:\n    print("sorry")',
          caption: 'Change age to 15 and run it again. Then change it back and set ticket to False.' },
  practice: { h: 'Name the condition when it gets long',
    p: 'If a condition needs three or four parts, store it in a well-named variable first and test that. can_enter reads better than the pile of comparisons that produced it.' },
  tasks: [
    { id: 'bool-1', prompt: 'It is 30 degrees and not raining. Print walk if it is over 20 and not raining, otherwise stay.',
      scaffold: { note: 'Both things have to be true at once', code: 'temperature = 30\nraining = False' },
      expect: ['walk'],
      hints: ['Two questions joined into one condition.', 'For the second half you need to flip the value stored in raining.'],
      solution: 'temperature = 30\nraining = False\nif temperature > 20 and not raining:\n    print("walk")\nelse:\n    print("stay")' },

    { id: 'bool-2', prompt: 'A value of 14 is stored. Print inside if it sits between 10 and 20 with both ends included, otherwise outside.',
      scaffold: { note: 'Two comparisons about the same value', code: 'value = 14' },
      expect: ['inside'],
      hints: ['You cannot write 10 < value < 20 in most languages. Ask two separate questions.', 'Both ends count, so the comparisons need the "or equal to" form.'],
      solution: 'value = 14\nif value >= 10 and value <= 20:\n    print("inside")\nelse:\n    print("outside")' },

    { id: 'bool-3', prompt: 'This lets in a 15 year old. Fix it so it prints sorry.',
      scaffold: { note: null, code: 'age = 15\nticket = True\nif age >= 18 or ticket:\n    print("come in")\nelse:\n    print("sorry")' },
      expect: ['sorry'],
      hints: ['Work out by hand which half of the condition is true.', 'One of the two joining words is satisfied by either side. You want the other one.'],
      solution: 'age = 15\nticket = True\nif age >= 18 and ticket:\n    print("come in")\nelse:\n    print("sorry")' }
  ]
},

{
  id: 'loops',
  level: 'Intermediate',
  title: 'Repeating without copying',
  idea: 'One block of instructions, run many times, with a value that changes.',
  teach: [
    { h: 'Why not copy and paste',
      p: 'Printing five lines by writing five instructions works until the number changes. Then you have five edits and four chances to miss one. A loop has one.' },
    { h: 'Counting loops',
      p: { python: 'for i in range(1, 6): runs the block with i set to 1, then 2, 3, 4 and 5. The second number is where it stops, and it is not included — so range(1, 6) ends at 5.',
           javascript: 'for (let i = 1; i < 6; i++) runs the block with i set to 1, then 2, 3, 4 and 5. It reads as: start at 1, keep going while i is under 6, add one each time.',
           ruby: 'for i in 1...6 runs the block with i set to 1, then 2, 3, 4 and 5. The three dots mean the last number is not included.' } },
    { h: 'The counter is a normal variable',
      p: 'Inside the block, i holds this pass\'s value, so you can print it, add it to a total, or test it with an if. It exists only inside the loop.' }
  ],
  demo: { code: 'for i in range(1, 6):\n    print(i)\nprint("done")',
          caption: 'Step through and watch i climb in the Variables panel.' },
  practice: { h: 'Keep the running total outside',
    p: 'A total must be created before the loop starts, or it would be reset to zero on every pass. What changes goes inside; what must survive goes outside.' },
  tasks: [
    { id: 'loop-1', prompt: 'Print the numbers 1 to 5, one per line — using a loop, not five instructions.',
      scaffold: { note: 'One loop, one instruction inside it' },
      expect: ['1', '2', '3', '4', '5'],
      hints: ['The loop header names the counter and the range it covers.',
              'Remember the end number is not included, so aim one past 5.'],
      craft: 'fewPrints',
      solution: 'for i in range(1, 6):\n    print(i)' },

    { id: 'loop-2', prompt: 'Add up every number from 1 to 100 and print the total. Print only the total.',
      scaffold: { note: 'Create the total before the loop, add to it inside' },
      expect: ['5050'],
      hints: ['Start a variable at 0 above the loop.',
              'Inside the loop, set the total to itself plus the counter.',
              'Print after the loop has finished, not inside it.'],
      craft: 'usesLoop',
      solution: 'total = 0\nfor i in range(1, 101):\n    total = total + i\nprint(total)' },

    { id: 'loop-3', prompt: 'Print the 7 times table up to 7 x 5, as lines like: 7 x 1 = 7',
      scaffold: { note: 'Pass several values to the print instruction, separated by commas' },
      expect: ['7 x 1 = 7', '7 x 2 = 14', '7 x 3 = 21', '7 x 4 = 28', '7 x 5 = 35'],
      hints: ['Loop the counter from 1 to 5.',
              'Print four values: the 7, the letter x, the counter, an equals sign, and the answer.',
              'The answer is 7 * i, worked out inside the print.'],
      craft: 'usesLoop',
      solution: 'for i in range(1, 6):\n    print(7, "x", i, "=", 7 * i)' }
  ]
},

{
  id: 'while',
  level: 'Intermediate',
  title: 'Repeating until something happens',
  idea: 'A loop that runs on a condition rather than a count.',
  teach: [
    { h: 'When you do not know the count',
      p: 'A counting loop needs to know how many passes up front. A while loop does not — it keeps going for as long as its condition holds, however many passes that takes.' },
    { h: 'Something inside must change',
      p: 'The condition is checked before every pass. If nothing inside the block moves it towards false, the loop runs forever. That is not an exotic bug — it is the most common one there is.' },
    { h: 'This app stops runaway loops',
      p: 'Polyglot gives up after a while and tells you the program ran too long. A real computer will not: it will simply sit there until you stop it yourself.' }
  ],
  demo: { code: 'countdown = 3\nwhile countdown > 0:\n    print(countdown)\n    countdown = countdown - 1\nprint("go")',
          caption: 'Step through it and watch countdown fall. Try deleting the last line inside the loop and running it.' },
  practice: { h: 'Use a counting loop when you know the count',
    p: 'Reach for while only when the finish line depends on what happens inside. Using it where a counting loop would do gives you three lines to get wrong instead of one.' },
  tasks: [
    { id: 'while-1', prompt: 'Start at 1 and keep doubling until the value passes 100. Print the value after each doubling.',
      scaffold: { note: 'Change the value inside the loop, then print it', code: 'value = 1' },
      expect: ['2', '4', '8', '16', '32', '64', '128'],
      hints: ['Keep going for as long as the value is still under 100.', 'Double first and print second, so the value that finally passes 100 is printed too.'],
      craft: 'usesLoop',
      solution: 'value = 1\nwhile value < 100:\n    value = value * 2\n    print(value)' },

    { id: 'while-2', prompt: 'How many times can you take 7 away from 100 before there is less than 7 left? Print only that count.',
      scaffold: { note: 'Two things change each pass: what is left, and how many times', code: 'value = 100' },
      expect: ['14'],
      hints: ['You need a second variable, starting at zero, to count the passes.', 'Keep going while there is still at least 7 left to take.', 'Print after the loop has finished, not inside it.'],
      craft: 'usesLoop',
      solution: 'value = 100\ncount = 0\nwhile value >= 7:\n    value = value - 7\n    count = count + 1\nprint(count)' },

    { id: 'while-3', prompt: 'This one never finishes. Fix it so it prints 3, 2, 1.',
      scaffold: { note: null, code: 'countdown = 3\nwhile countdown > 0:\n    print(countdown)' },
      expect: ['3', '2', '1'],
      hints: ['Run it first and read what the app says when it gives up.', 'The condition asks about countdown, but nothing in the block ever changes it.'],
      solution: 'countdown = 3\nwhile countdown > 0:\n    print(countdown)\n    countdown = countdown - 1' }
  ]
},

{
  id: 'nested',
  level: 'Intermediate',
  title: 'Loops inside loops',
  idea: 'The inner loop runs all the way through on every pass of the outer one.',
  teach: [
    { h: 'Three by three is nine',
      p: 'For each single pass of the outer loop, the inner loop starts again and runs to completion. Three passes of an outer loop containing a three-pass inner loop gives nine passes of the innermost block.' },
    { h: 'Each loop needs its own name',
      p: 'Reusing the outer loop\u2019s variable in the inner loop destroys the outer one\u2019s place. Give them different names — row and col say what they are far better than i and j.' },
    { h: 'Build first, print after',
      p: 'A common shape is to build up a piece of text through the inner loop and print it once, after the inner loop has finished. Where the print sits decides whether you get one line or many.' }
  ],
  demo: { code: 'for row in range(1, 4):\n    for col in range(1, 4):\n        print(row, col)',
          caption: 'Step through slowly and watch col race while row crawls.' },
  practice: { h: 'Two levels is usually the limit',
    p: 'Three or more levels of nesting is a signal that the inner work wants to become a function with a name. Depth is where readable code goes to die.' },
  tasks: [
    { id: 'nest-1', prompt: 'Print a 3 by 3 multiplication grid, as nine lines like: 2 x 3 = 6',
      scaffold: { note: 'One loop for the row, another inside it for the column' },
      expect: ['1 x 1 = 1', '1 x 2 = 2', '1 x 3 = 3', '2 x 1 = 2', '2 x 2 = 4', '2 x 3 = 6', '3 x 1 = 3', '3 x 2 = 6', '3 x 3 = 9'],
      hints: ['Both loops count from 1 up to 3.', 'The line prints five values: the row, an x, the column, an equals sign, and the product.'],
      craft: 'usesLoop',
      solution: 'for row in range(1, 4):\n    for col in range(1, 4):\n        print(row, "x", col, "=", row * col)' },

    { id: 'nest-2', prompt: 'Print a triangle of stars: one star, then two, then three.',
      scaffold: { note: 'Build the line inside, print it outside' },
      expect: ['*', '**', '***'],
      hints: ['Start each row with an empty piece of text.', 'The inner loop should run as many times as the row number, adding one star each pass.', 'Print the line after the inner loop has finished, not inside it.'],
      craft: 'usesLoop',
      solution: 'for row in range(1, 4):\n    line = ""\n    for col in range(row):\n        line = line + "*"\n    print(line)' },

    { id: 'nest-3', prompt: 'Every line comes out wrong. Fix it so the four lines read 1 1, 1 2, 2 1, 2 2.',
      scaffold: { note: null, code: 'for row in range(1, 3):\n    for col in range(1, 3):\n        print(row, row)' },
      expect: ['1 1', '1 2', '2 1', '2 2'],
      hints: ['Compare what is printed against what the two loops are actually counting.', 'One of the two loop variables is never used.'],
      solution: 'for row in range(1, 3):\n    for col in range(1, 3):\n        print(row, col)' }
  ]
},

{
  id: 'lists',
  level: 'Intermediate',
  title: 'Holding many values',
  idea: 'One name for a whole sequence of values, in order.',
  teach: [
    { h: 'A list keeps order',
      p: 'Square brackets make a list: [4, 9, 15]. It stays in the order you wrote it, and it can grow.' },
    { h: 'Counting starts at zero',
      p: 'The first item is at position 0, the second at 1. So the last position is always one less than the length. This is the source of a great many bugs, and it catches everyone at first.' },
    { h: 'Adding and measuring',
      p: { python: 'prices.append(22) puts a value on the end. len(prices) tells you how many there are.',
           javascript: 'prices.push(22) puts a value on the end. prices.length tells you how many there are.',
           ruby: 'prices.push(22) puts a value on the end. prices.length tells you how many there are.' } },
    { h: 'Visiting every item',
      p: { python: 'for price in prices: hands you each item in turn, without you needing positions at all.',
           javascript: 'for (let price of prices) hands you each item in turn, without you needing positions at all.',
           ruby: 'for price in prices hands you each item in turn, without you needing positions at all.' } }
  ],
  demo: { code: 'prices = [4, 9, 15]\nprices.append(22)\nprint(len(prices))\nfor price in prices:\n    print(price)',
          caption: 'Watch the list grow, then get visited one item at a time.' },
  practice: { h: 'Ask for the length, do not count by hand',
    p: 'Writing the number 4 because you counted four items works until someone adds a fifth. Ask the list how long it is and the program stays correct.' },
  tasks: [
    { id: 'list-1', prompt: 'Start with the list 3, 17, 8. Add 40 to the end. Print how many items there are, then print the last one.',
      scaffold: { note: 'Make the list, add to it, then print two things' },
      expect: ['4', '40'],
      hints: ['Square brackets to make it, with commas between the values.',
              'The last position is one less than the length — so with four items, it is position 3.'],
      solution: 'nums = [3, 17, 8]\nnums.append(40)\nprint(len(nums))\nprint(nums[3])' },

    { id: 'list-2', prompt: 'Print each of 3, 17 and 8 on its own line, using a loop over the list.',
      scaffold: { note: 'Store the list first, then visit every item' },
      expect: ['3', '17', '8'],
      hints: ['Use the loop that hands you each item, not the counting one.',
              'The name you choose in the loop header is what each item is called inside the block.'],
      craft: 'usesLoop',
      solution: 'nums = [3, 17, 8]\nfor n in nums:\n    print(n)' },

    { id: 'list-3', prompt: 'Find the largest of 3, 17 and 8 with a loop, and print only it.',
      scaffold: { note: 'Track the biggest seen so far in a variable' },
      expect: ['17'],
      hints: ['Start a variable at 0 before the loop.',
              'Inside the loop, if this item is bigger than what you have, store it instead.',
              'Print after the loop, once every item has been seen.'],
      craft: 'usesLoop',
      solution: 'nums = [3, 17, 8]\nbiggest = 0\nfor n in nums:\n    if n > biggest:\n        biggest = n\nprint(biggest)' }
  ]
},

{
  id: 'listedit',
  level: 'Intermediate',
  title: 'Changing a list',
  idea: 'Replacing values in place, and the trap that comes with it.',
  teach: [
    { h: 'Replacing one slot',
      p: 'Putting a position on the left of an assignment replaces just that one value and leaves the rest of the list alone.' },
    { h: 'Swapping needs somewhere to stand',
      p: 'To exchange two values you must park one of them in another variable first. Assign one straight onto the other and the value you overwrote is gone with no way back.' },
    { h: 'The last position, again',
      p: { python: 'The last slot is len(the list) minus one. Asking for len(the list) itself is one past the end, and the program will stop.',
           javascript: 'The last slot is the list\u2019s length minus one. Asking for the length itself is one past the end, and the program will stop.',
           ruby: 'The last slot is the list\u2019s length minus one. Asking for the length itself is one past the end, and the program will stop.' } }
  ],
  demo: { code: 'scores = [40, 90, 70]\nscores[0] = 55\nfor score in scores:\n    print(score)',
          caption: 'One slot changed, the others untouched.' },
  practice: { h: 'A spare variable is not a failure',
    p: 'Clever one-line swaps exist in some languages and confuse everybody in all of them. A named temporary is clearer, and clarity is the whole job.' },
  tasks: [
    { id: 'ledit-1', prompt: 'The list is 40, 90, 70. Replace the middle value with 100, then print each value on its own line.',
      scaffold: { note: 'Change one slot, then visit them all', code: 'scores = [40, 90, 70]' },
      expect: ['40', '100', '70'],
      hints: ['The middle of three is position 1, because counting starts at 0.', 'Put the position on the left of the equals sign.'],
      craft: 'usesLoop',
      solution: 'scores = [40, 90, 70]\nscores[1] = 100\nfor score in scores:\n    print(score)' },

    { id: 'ledit-2', prompt: 'Swap the first and last values of 40, 90, 70, then print each on its own line.',
      scaffold: { note: 'You will need somewhere to put a value while you move the other', code: 'scores = [40, 90, 70]' },
      expect: ['70', '90', '40'],
      hints: ['If you copy the last into the first straight away, the original first value is lost.', 'Save one of them into another variable before overwriting anything.'],
      craft: 'usesLoop',
      solution: 'scores = [40, 90, 70]\nspare = scores[0]\nscores[0] = scores[2]\nscores[2] = spare\nfor score in scores:\n    print(score)' },

    { id: 'ledit-3', prompt: 'This stops with an error. Fix it so it prints the last value, 70.',
      scaffold: { note: null, code: 'scores = [40, 90, 70]\nprint(scores[len(scores)])' },
      expect: ['70'],
      hints: ['Read the error. It says exactly which positions this list has.', 'Three items means positions 0, 1 and 2 — so the last one is the length minus one.'],
      solution: 'scores = [40, 90, 70]\nprint(scores[len(scores) - 1])' }
  ]
},

{
  id: 'functions',
  level: 'Intermediate',
  title: 'Naming a procedure',
  idea: 'Package steps under a name so you can use them anywhere.',
  teach: [
    { h: 'Define once, use often',
      p: { python: 'def twice(n): names a procedure and says it expects one value, which will be called n inside. Nothing runs until someone calls twice(7).',
           javascript: 'function twice(n) names a procedure and says it expects one value, which will be called n inside. Nothing runs until someone calls twice(7).',
           ruby: 'def twice(n) names a procedure and says it expects one value, which will be called n inside. Nothing runs until someone calls twice(7).' } },
    { h: 'return hands a value back',
      p: 'return ends the function immediately and gives its value to whoever called it. That value can then be printed, stored, or passed straight into something else.' },
    { h: 'Printing is not returning',
      p: 'A function that prints has shown you something. A function that returns has given you something you can use again. They are not interchangeable, and mixing them up is a real bug rather than a style opinion.' }
  ],
  demo: { code: 'def twice(n):\n    return n * 2\nprint(twice(7))\nprint(twice(twice(3)))',
          caption: 'Step in and watch n take a different value each call.' },
  practice: { h: 'One function, one job',
    p: 'If you cannot name it in a couple of words, it is doing too much. Return the result rather than printing it inside, so the caller decides what to do with it.' },
  tasks: [
    { id: 'fn-1', prompt: 'Write a function that doubles a number. Use it to print double 7, then double of double 3.',
      scaffold: { note: 'Define it first, then use it twice' },
      expect: ['14', '12'],
      hints: ['The definition needs a name and one parameter in brackets.',
              'Inside, hand back the value rather than printing it.',
              'A call can go straight inside another call.'],
      craft: 'usesFunction',
      solution: 'def twice(n):\n    return n * 2\nprint(twice(7))\nprint(twice(twice(3)))' },

    { id: 'fn-2', prompt: 'Write a function that takes a width and a height and gives back the area. Print the area of 3 by 4, then of 10 by 10.',
      scaffold: { note: 'Two parameters this time' },
      expect: ['12', '100'],
      hints: ['Parameters are separated by a comma inside the brackets.',
              'Multiply them and hand the answer back.'],
      craft: 'usesFunction',
      solution: 'def area(width, height):\n    return width * height\nprint(area(3, 4))\nprint(area(10, 10))' },

    { id: 'fn-3', prompt: 'This function prints instead of handing the value back, so the doubling fails. Fix it so the output is 20.',
      scaffold: { note: null, code: 'def add(a, b):\n    print(a + b)\nresult = add(4, 6)\nprint(result * 2)' },
      expect: ['20'],
      hints: ['Run it and read what comes out. Where does the 10 appear, and what is result?',
              'A function with no return hands back nothing at all.',
              'Change the printing line inside the function into a returning line.'],
      solution: 'def add(a, b):\n    return a + b\nresult = add(4, 6)\nprint(result * 2)' }
  ]
},

{
  id: 'debugging',
  level: 'Advanced',
  title: 'Finding out what went wrong',
  idea: 'Reading the message, then watching the program up to the moment it breaks.',
  teach: [
    { h: 'The message names a line',
      p: 'When a program stops, it tells you what it could not do and where. Go to that line first, before changing anything. Most of the time the mistake is on that line or the one above it.' },
    { h: 'Step to the moment before',
      p: 'Run the program and drag the step slider to just before the failing line. The Variables panel then shows exactly what the program believed at that moment, which is usually where the real mistake becomes obvious.' },
    { h: 'Wrong is not the same as broken',
      p: 'A program can finish perfectly and still be wrong. Compare your output against what you expected line by line — that difference is the bug, even when nothing complained.' }
  ],
  demo: { code: 'def average(a, b):\n    return (a + b) / 2\nprint(average(4, 10))',
          caption: 'Step into the function and watch a and b appear in their own frame.' },
  practice: { h: 'Change one thing, then run again',
    p: 'Two changes at once and you cannot tell which one helped. This is slower for about a minute and faster for the rest of your life.' },
  tasks: [
    { id: 'debug-1', prompt: 'Fix this so it prints 5.',
      scaffold: { note: null, code: 'total = 5\nprint(totl)' },
      expect: ['5'],
      hints: ['The message names something with no value. Compare it against the line above.', 'A name has to match exactly, every single time it is written.'],
      solution: 'total = 5\nprint(total)' },

    { id: 'debug-2', prompt: 'Fix the call so it prints the area of 4 by 6.',
      scaffold: { note: null, code: 'def area(width, height):\n    return width * height\nprint(area(4))' },
      expect: ['24'],
      hints: ['The message tells you how many values the function expects and how many it received.', 'Both values go inside the brackets, separated by a comma.'],
      solution: 'def area(width, height):\n    return width * height\nprint(area(4, 6))' },

    { id: 'debug-3', prompt: 'Nothing here fails, but it prints four lines when it should print one: the final total, 10.',
      scaffold: { note: null, code: 'total = 0\nfor i in range(1, 5):\n    total = total + i\n    print(total)' },
      expect: ['10'],
      hints: ['Run it and compare the four lines against what you wanted.', 'Everything indented inside the loop happens on every single pass.'],
      craft: 'fewPrints',
      solution: 'total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)' }
  ]
},

{
  id: 'errors',
  level: 'Advanced',
  title: 'When things go wrong on purpose',
  idea: 'Catching a failure instead of letting it stop the program.',
  unavailable: ['go'],
  teach: [
    { h: 'Some failures are expected',
      p: 'A missing key, a number that should not be negative, a file that is not there. These are not bugs in your code — they are situations your code has to survive.' },
    { h: 'try and catch',
      p: { python: 'The try block holds the risky work. If anything in it fails, the rest of the block is abandoned and the except block runs instead. The program then carries on.',
           javascript: 'The try block holds the risky work. If anything in it fails, the rest of the block is abandoned and the catch block runs instead. The program then carries on.',
           ruby: 'The begin block holds the risky work. If anything in it fails, the rest of the block is abandoned and the rescue block runs instead. The program then carries on.' } },
    { h: 'The error carries a message',
      p: { python: 'Polyglot always names the caught error err. Printing it shows what actually went wrong, which is far more useful than printing "something failed".',
           javascript: 'Polyglot always names the caught error err, and err.message is what went wrong. That is far more useful than printing "something failed".',
           ruby: 'Polyglot always names the caught error err, and err.message is what went wrong. That is far more useful than printing "something failed".' } },
    { h: 'You can raise your own',
      p: { python: 'raise Exception("age cannot be negative") stops the current work immediately and hands that message to whoever is willing to catch it. Use it when a value makes no sense to continue with.',
           javascript: 'throw new Error("age cannot be negative") stops the current work immediately and hands that message to whoever is willing to catch it. Use it when a value makes no sense to continue with.',
           ruby: 'raise "age cannot be negative" stops the current work immediately and hands that message to whoever is willing to catch it. Use it when a value makes no sense to continue with.' } },
    { h: 'What even counts as a failure varies',
      p: 'Asking a dictionary for a key it does not have raises an error in Python and C#, but hands back nothing at all in JavaScript, Ruby, PHP and Java. Polyglot treats it as a failure, because a silent nothing tends to surface later as a much stranger bug.' },
    { h: 'Not every language works this way',
      p: 'Go has no exceptions at all. Functions return an error alongside their result and the caller checks it every time. That is a deliberate disagreement about whether failures should be easy to ignore, and it is why this lesson has no Go version.' }
  ],
  demo: { code: 'def price_of(item):\n    prices = {"chai": 30}\n    if item in prices:\n        return prices[item]\n    raise Exception("no price for " + item)\n\ntry:\n    print(price_of("kulfi"))\nexcept Exception as err:\n    print("could not find it")\n    print(err)\nprint("still running")',
          caption: 'The last line proves the program survived. Step through and watch it jump out of the function.' },
  practice: { h: 'Catch what you can actually handle',
    p: 'Wrapping everything in a try that quietly swallows the message turns a loud, fixable failure into a silent, mysterious one. Catch a failure when you have something sensible to do about it.' },
  tasks: [
    { id: 'err-1', prompt: 'The take function always fails. Catch that failure so the program prints not found, then carries on to print done.',
      scaffold: { note: 'The call is the risky part', code: 'def take(item):\n    raise Exception("we have no " + item)\n\ntake("daal")\nprint("done")' },
      expect: ['not found', 'done'],
      hints: ['Put the risky call inside the block that is allowed to fail.',
              'The block that runs instead prints the two words asked for.',
              'The last line stays outside both blocks so it always runs.'],
      solution: 'def take(item):\n    raise Exception("we have no " + item)\n\ntry:\n    take("daal")\nexcept Exception as err:\n    print("not found")\nprint("done")' },

    { id: 'err-2', prompt: 'Raise a failure carrying the message out of stock, catch it, print that message, then print after.',
      scaffold: { note: 'Raise it, catch it, print what it said' },
      expect: ['out of stock', 'after'],
      hints: ['Raising takes a message, and it happens inside the block that is allowed to fail.',
              'The caught error can be printed directly and shows the message it was given.',
              'The last line sits outside both blocks so it still runs.'],
      solution: 'try:\n    raise Exception("out of stock")\nexcept Exception as err:\n    print(err)\nprint("after")' },

    { id: 'err-3', prompt: 'Write a function that refuses a negative age by raising an error with the message age cannot be negative. Call it with -5, catch the failure, and print the message.',
      scaffold: { note: 'Raise inside the function, catch outside it' },
      expect: ['age cannot be negative'],
      hints: ['Inside the function, check the value and raise when it makes no sense.',
              'The call goes inside a try, and the block that runs instead prints the caught message.'],
      craft: 'usesFunction',
      solution: 'def check(age):\n    if age < 0:\n        raise Exception("age cannot be negative")\n    return age\n\ntry:\n    print(check(-5))\nexcept Exception as err:\n    print(err)' }
  ]
},

{
  id: 'fizzbuzz',
  level: 'Advanced',
  title: 'Putting it together',
  idea: 'A loop, a chain of conditions, and the order they are tested in.',
  teach: [
    { h: 'The remainder',
      p: 'The % symbol gives what is left over after dividing. 17 % 5 is 2. When the remainder is 0, the division was exact — so i % 3 == 0 is how you ask "does 3 divide into this evenly?"' },
    { h: 'Order decides the answer',
      p: 'A number divisible by 15 is also divisible by 3 and by 5. Whichever test comes first wins, so the most specific case has to be checked before the looser ones or it can never happen.' },
    { h: 'The classic',
      p: 'FizzBuzz is the traditional first real programming problem: count upward, but say Fizz for multiples of three, Buzz for multiples of five, and FizzBuzz for multiples of both.' }
  ],
  demo: { code: 'print(17 % 5)\nprint(15 % 3)\nprint(15 % 5)',
          caption: 'Three remainders. Two of them are zero, which is the signal to look for.' },
  practice: { h: 'Test the combined case first',
    p: 'When conditions overlap, sort them from narrowest to widest. This is the same rule as the grade exercise, and it will keep appearing for the rest of your programming life.' },
  tasks: [
    { id: 'fb-1', prompt: 'Print every number from 1 to 20 that divides evenly by 3, and nothing else.',
      scaffold: { note: 'Loop over the numbers, print only some of them' },
      expect: ['3', '6', '9', '12', '15', '18'],
      hints: ['Loop from 1 up to and including 20.',
              'Inside the loop, ask whether the remainder after dividing by 3 is zero.',
              'No else is needed — when the condition is false, nothing should happen.'],
      craft: 'usesLoop',
      solution: 'for i in range(1, 21):\n    if i % 3 == 0:\n        print(i)' },

    { id: 'fb-2', prompt: 'FizzBuzz from 1 to 15. Fizz for multiples of 3, Buzz for multiples of 5, FizzBuzz for both, otherwise the number itself.',
      scaffold: { note: 'Order your conditions carefully' },
      expect: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'],
      hints: ['One loop, and inside it a chain of four possibilities.',
              'Check divisibility by 15 first, or it will never be reached.',
              'The final case is the plain number, so it belongs in the else.'],
      craft: 'usesLoop',
      solution: 'for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)' }
  ]
},

{
  id: 'dictionaries',
  title: 'Looking things up by name',
  idea: 'A dictionary finds a value by key instead of by position.',
  level: 'Intermediate',
  unavailable: ['go'],
  teach: [
    { h: 'Position versus name',
      p: 'A list answers "what is the third one". A dictionary answers "what is sara\u2019s age". Most real data is the second kind, which is why dictionaries turn up in almost every program you will ever read.' },
    { h: 'Keys are unique',
      p: 'Storing a value under a key that already exists replaces the old one rather than adding a second entry. That is usually what you want, and occasionally a bug you will spend an hour finding.' },
    { h: 'Asking for a key that is not there stops the program',
      p: { python: 'Check first with "sara" in ages, which is true or false and never fails.',
           javascript: 'Check first with "sara" in ages, which is true or false and never fails.',
           ruby: 'Check first with ages.key?("sara"), which is true or false and never fails.' } },
    { h: 'Looping visits the keys',
      p: 'Walking a dictionary hands you each key, and you look up the value yourself. Python, JavaScript and Ruby keep the order you inserted things in. Go deliberately randomises it so nobody can depend on it, and Java has no dictionary literal at all \u2014 you create the map and put entries in one by one. Switch to Java and look.' }
  ],
  demo: { code: 'ages = {"sara": 30, "bilal": 25}\nages["omar"] = 41\nprint(len(ages))\nfor name in ages:\n    print(name, ages[name])',
          caption: 'Step through and watch the dictionary grow in the Variables panel.' },
  practice: { h: 'Check before you reach',
    p: 'Any lookup of a key that came from outside your program \u2014 a user, a file, a form \u2014 should be guarded. A missing key is not an exotic case; it is Tuesday.' },
  tasks: [
    { id: 'dict-1', prompt: 'Build a dictionary of prices: chai is 30, samosa is 45. Print the price of chai, then how many entries there are.',
      scaffold: { note: 'Keys on the left, values on the right' },
      expect: ['30', '2'],
      hints: ['A dictionary literal uses braces, with each key and value separated inside.',
              'Look a value up by putting its key in square brackets.'],
      solution: 'prices = {"chai": 30, "samosa": 45}\nprint(prices["chai"])\nprint(len(prices))' },

    { id: 'dict-2', prompt: 'Add jalebi at 60 to the prices, then print whether jalebi is in there and whether kulfi is.',
      scaffold: { note: 'Add an entry, then ask two questions', code: 'prices = {"chai": 30, "samosa": 45}' },
      expect: ['True', 'False'],
      hints: ['Assigning to a key that does not exist yet creates it.',
              'The membership test gives back true or false, so it can be printed directly.'],
      solution: 'prices = {"chai": 30, "samosa": 45}\nprices["jalebi"] = 60\nprint("jalebi" in prices)\nprint("kulfi" in prices)' },

    { id: 'dict-3', prompt: 'Print every item and its price, one per line, as lines like: chai 30',
      scaffold: { note: 'Loop over the dictionary and look each value up', code: 'prices = {"chai": 30, "samosa": 45, "jalebi": 60}' },
      expect: ['chai 30', 'samosa 45', 'jalebi 60'],
      hints: ['The loop hands you each key, not each value.',
              'Inside the loop, look the value up using the key you were handed.'],
      craft: 'usesLoop',
      solution: 'prices = {"chai": 30, "samosa": 45, "jalebi": 60}\nfor item in prices:\n    print(item, prices[item])' },

    { id: 'dict-4', prompt: 'This stops with an error. Fix it so it prints the price when the item exists and the word missing when it does not.',
      scaffold: { note: null, code: 'prices = {"chai": 30}\nwanted = "kulfi"\nprint(prices[wanted])' },
      expect: ['missing'],
      hints: ['Read the error: it lists the keys the dictionary actually holds.',
              'Ask whether the key is there before reaching for it, and print the other word when it is not.'],
      solution: 'prices = {"chai": 30}\nwanted = "kulfi"\nif wanted in prices:\n    print(prices[wanted])\nelse:\n    print("missing")' }
  ]
},

{
  id: 'strings',
  title: 'Working with text properly',
  idea: 'Trimming, changing case, searching, and mixing text with numbers.',
  level: 'Intermediate',
  unavailable: ['go'],
  teach: [
    { h: 'Text has helpers built in',
      p: { python: 'name.upper() and name.lower() change case, name.strip() removes surrounding spaces, and name.startswith("a") tests the beginning.',
           javascript: 'name.toUpperCase() and name.toLowerCase() change case, name.trim() removes surrounding spaces, and name.startsWith("a") tests the beginning.',
           ruby: 'name.upcase and name.downcase change case, name.strip removes surrounding spaces, and name.start_with?("a") tests the beginning.' } },
    { h: 'They hand back new text',
      p: 'None of these change the original. name.upper() gives you a new piece of text and leaves name exactly as it was, which surprises people until it saves them.' },
    { h: 'Searching inside',
      p: { python: '"ob" in name asks whether that run of characters appears anywhere.',
           javascript: 'name.includes("ob") asks whether that run of characters appears anywhere.',
           ruby: 'name.include?("ob") asks whether that run of characters appears anywhere.' } },
    { h: 'Numbers are not text',
      p: { python: 'Joining "Total: " to 42 with + is refused. str(42) turns the number into text first, and then + works.',
           javascript: 'Joining "Total: " to 42 with + quietly does something in JavaScript, so be explicit: String(42) turns the number into text first.',
           ruby: 'Joining "Total: " to 42 with + is refused. 42.to_s turns the number into text first, and then + works.' } }
  ],
  demo: { code: 'name = "  Sobia  "\nclean = name.strip()\nprint(clean.upper(), clean.lower())\nprint("ob" in clean)\nprint("Total: " + str(42))',
          caption: 'Note that name still has its spaces afterwards \u2014 strip handed back a new piece of text.' },
  practice: { h: 'Clean input at the edge',
    p: 'Trim and lower-case anything typed by a person the moment it arrives, once, rather than sprinkling those calls through every comparison later on.' },
  tasks: [
    { id: 'str-1', prompt: 'The name arrives with spaces around it. Print it with the spaces removed and in capitals.',
      scaffold: { note: 'Two helpers, one after the other', code: 'name = "  ayesha  "' },
      expect: ['AYESHA'],
      hints: ['One helper removes the surrounding spaces, another changes the case.',
              'Each hands back new text, so you can apply the second to the result of the first.'],
      solution: 'name = "  ayesha  "\nprint(name.strip().upper())' },

    { id: 'str-2', prompt: 'Print whether the address contains an @ sign, and whether it starts with the letter a.',
      scaffold: { note: 'Two separate questions about the same text', code: 'address = "ayesha@example.com"' },
      expect: ['True', 'True'],
      hints: ['One of these is a membership test, the other is a helper about the beginning.',
              'Both give back true or false, so they can be printed directly.'],
      solution: 'address = "ayesha@example.com"\nprint("@" in address)\nprint(address.startswith("a"))' },

    { id: 'str-3', prompt: 'This refuses to run. Fix it so it prints: Score: 91',
      scaffold: { note: null, code: 'score = 91\nprint("Score: " + score)' },
      expect: ['Score: 91'],
      hints: ['Read the error. It names the two kinds of thing you tried to join.',
              'Turn the number into text first, then join it.'],
      solution: 'score = 91\nprint("Score: " + str(score))' }
  ]
},

{
  id: 'objects',
  level: 'Advanced',
  title: 'Objects and classes',
  idea: 'Keeping data together with the code that works on it.',
  unavailable: ['go'],
  teach: [
    { h: 'A class is a template',
      p: 'A class describes what something is made of and what it can do. An object is one actual thing built from that template. One Book class, a thousand books.' },
    { h: 'The constructor sets it up',
      p: { python: '__init__ runs once, the moment you create the object. Whatever it stores on self stays with that object for its whole life.',
           javascript: 'constructor runs once, the moment you create the object with new. Whatever it stores on this stays with that object for its whole life.',
           ruby: 'initialize runs once, the moment you call .new. Whatever it stores in an @field stays with that object for its whole life.' } },
    { h: 'The object refers to itself',
      p: { python: 'Inside the class, self means "the particular object this call is about". self.title is that object\u2019s own title, separate from every other Book.',
           javascript: 'Inside the class, this means "the particular object this call is about". this.title is that object\u2019s own title, separate from every other Book.',
           ruby: 'Inside the class, @title means "this particular object\u2019s title", separate from every other Book.' } },
    { h: 'Fields and methods',
      p: 'The values an object holds are its fields. The things it can do are its methods, and a method can always read the object\u2019s own fields.' }
  ],
  demo: { code: 'class Cup:\n    def __init__(self, size):\n        self.size = size\n    def describe(self):\n        return "a cup holding " + self.size\n\ncup = Cup("300ml")\nprint(cup.describe())',
          caption: 'Step into describe and watch self.size appear in the Variables panel.' },
  practice: { h: 'Set every field in the constructor',
    p: 'If a field only appears later, in some branch of some method, then some objects will not have it and the program will fail on those. Give every field a value the moment the object is born.' },
  tasks: [
    { id: 'obj-1', prompt: 'Write a Book class that stores a title and a page count. Make one for Hikayat with 210 pages, then print its title and pages on one line.',
      scaffold: { note: 'A class, a constructor that stores both values, then one object' },
      expect: ['Hikayat 210'],
      hints: ['The constructor takes the two values and stores each one on the object.',
              'Reading a field from outside uses the object name, a dot, and the field name.'],
      solution: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n\nbook = Book("Hikayat", 210)\nprint(book.title, book.pages)' },

    { id: 'obj-2', prompt: 'Give that Book a method called is_long that answers whether it has more than 200 pages, and print the answer.',
      scaffold: { note: 'A method can read the object it belongs to', code: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages' },
      expect: ['True'],
      hints: ['The method needs no values passed in — everything it needs is already on the object.',
              'A comparison is already true or false, so it can be handed straight back.'],
      solution: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n    def is_long(self):\n        return self.pages > 200\n\nbook = Book("Hikayat", 210)\nprint(book.is_long())' },

    { id: 'obj-3', prompt: 'This stops with an error. Fix it so it prints 90.',
      scaffold: { note: null, code: 'class Timer:\n    def __init__(self, seconds):\n        seconds = seconds\n    def show(self):\n        return self.seconds\n\ntimer = Timer(90)\nprint(timer.show())' },
      expect: ['90'],
      hints: ['Read the error: it names a field that was never set on the object.',
              'The constructor assigns to a plain local name, which vanishes the moment it finishes.'],
      solution: 'class Timer:\n    def __init__(self, seconds):\n        self.seconds = seconds\n    def show(self):\n        return self.seconds\n\ntimer = Timer(90)\nprint(timer.show())' }
  ]
},

{
  id: 'inheritance',
  level: 'Advanced',
  title: 'Building on a class',
  idea: 'A new class that starts from an existing one and adds to it.',
  unavailable: ['go'],
  teach: [
    { h: 'Start from what exists',
      p: 'A child class gets every field and method of its parent without repeating any of it. It then adds whatever is particular to itself.' },
    { h: 'Passing work upwards',
      p: { python: 'The child\u2019s constructor calls super().__init__(...) to let the parent set up the parts it owns, then sets up its own.',
           javascript: 'The child\u2019s constructor calls super(...) to let the parent set up the parts it owns, then sets up its own. JavaScript insists this happens before you touch this.',
           ruby: 'The child\u2019s initialize calls super(...) to let the parent set up the parts it owns, then sets up its own.' } },
    { h: 'Is-a, not has-a',
      p: 'Inheritance says a Dog is an Animal. If the sentence sounds wrong — a Car is an Engine — then the class should hold the other one as a field instead. That is composition, and it is the right answer more often than beginners expect.' },
    { h: 'Not every language has it',
      p: 'Go deliberately leaves inheritance out, which is why this lesson has no Go version. It composes small pieces instead. That is a real disagreement between language designers, not an oversight.' }
  ],
  demo: { code: 'class Vehicle:\n    def __init__(self, wheels):\n        self.wheels = wheels\n    def describe(self):\n        return "a vehicle"\n\nclass Car(Vehicle):\n    def __init__(self, wheels, doors):\n        super().__init__(wheels)\n        self.doors = doors\n\ncar = Car(4, 5)\nprint(car.wheels, car.doors)\nprint(car.describe())',
          caption: 'Car never defines describe, yet it has one. Step in and watch the constructor call its parent.' },
  practice: { h: 'Keep the chain shallow',
    p: 'One or two levels is almost always enough. Deep hierarchies make it impossible to answer the only question that matters: where does this behaviour actually come from?' },
  tasks: [
    { id: 'inh-1', prompt: 'Write an Account class holding an owner, then a Savings class that builds on it and adds a rate. Make a Savings for Sobia at 3, and print the owner and the rate.',
      scaffold: { note: 'Two classes, the second built on the first' },
      expect: ['Sobia 3'],
      hints: ['The child names its parent as part of its own class line.',
              'The child\u2019s constructor takes both values, hands the owner up to the parent, and keeps the rate itself.'],
      solution: 'class Account:\n    def __init__(self, owner):\n        self.owner = owner\n\nclass Savings(Account):\n    def __init__(self, owner, rate):\n        super().__init__(owner)\n        self.rate = rate\n\nsavings = Savings("Sobia", 3)\nprint(savings.owner, savings.rate)' },

    { id: 'inh-2', prompt: 'A Shape has a name and a method called label that returns it. Write Circle, built on Shape, that adds a radius. Print the label and the radius.',
      scaffold: { note: 'The child inherits label without writing it again', code: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n    def label(self):\n        return self.name' },
      expect: ['circle 7'],
      hints: ['Circle needs no label method of its own — it already has one.',
              'Hand the name up to the parent, then store the radius.'],
      solution: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n    def label(self):\n        return self.name\n\nclass Circle(Shape):\n    def __init__(self, name, radius):\n        super().__init__(name)\n        self.radius = radius\n\ncircle = Circle("circle", 7)\nprint(circle.label(), circle.radius)' },

    { id: 'inh-3', prompt: 'This one fails. Fix it so it prints: Rex 3',
      scaffold: { note: null, code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, age):\n        self.age = age\n\ndog = Dog("Rex", 3)\nprint(dog.name, dog.age)' },
      expect: ['Rex 3'],
      hints: ['The error names a field that was never set. Which class was supposed to set it?',
              'The child constructor never gives the parent a chance to do its part.'],
      solution: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, age):\n        super().__init__(name)\n        self.age = age\n\ndog = Dog("Rex", 3)\nprint(dog.name, dog.age)' }
  ]
},

{
  id: 'polymorphism',
  level: 'Mastery',
  title: 'One call, many behaviours',
  idea: 'Replacing a parent\u2019s method, and why that makes loops simpler.',
  unavailable: ['go'],
  teach: [
    { h: 'Overriding replaces',
      p: 'When a child defines a method the parent already has, the child\u2019s version wins for objects of that child. The parent\u2019s version is untouched for everything else.' },
    { h: 'The caller stops caring',
      p: 'A loop over a list of shapes can call area on each one without knowing or asking which kind it holds. Each object supplies its own answer. That is polymorphism, and it is why it removes so many if statements.' },
    { h: 'Extending rather than replacing',
      p: { python: 'A child\u2019s method can call super().method() to get the parent\u2019s answer and build on it, instead of throwing it away.',
           javascript: 'A child\u2019s method can call super.method() to get the parent\u2019s answer and build on it, instead of throwing it away.',
           ruby: 'A child\u2019s method can call super to get the parent\u2019s answer and build on it, instead of throwing it away.' } },
    { h: 'Statically typed languages need permission',
      p: 'Java treats every method this way automatically. C# does not: the parent must say virtual and the child must say override, or the wrong method gets called. Polyglot writes both for you — switch to C# and look.' }
  ],
  demo: { code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return self.name + " makes a sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return self.name + " says woof"\n\nclass Cat(Animal):\n    def speak(self):\n        return self.name + " says meow"\n\npets = [Dog("Rex"), Cat("Mitu"), Animal("Thing")]\nfor pet in pets:\n    print(pet.speak())',
          caption: 'One loop, three different answers, and no if statement anywhere.' },
  practice: { h: 'Keep the replaced method\u2019s promise',
    p: 'An overridden method should still do what its name says and hand back the same kind of thing. A child that quietly returns something different turns every caller into a guessing game.' },
  tasks: [
    { id: 'poly-1', prompt: 'A Shape has an area method returning 0. Write Square, which stores a side and returns its real area. Print the area of a square of side 6.',
      scaffold: { note: 'Replace the parent method in the child', code: 'class Shape:\n    def area(self):\n        return 0' },
      expect: ['36'],
      hints: ['Square needs a constructor to hold its side.', 'Define a method with exactly the same name as the parent\u2019s, and the child\u2019s wins.'],
      solution: 'class Shape:\n    def area(self):\n        return 0\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    def area(self):\n        return self.side * self.side\n\nsquare = Square(6)\nprint(square.area())' },

    { id: 'poly-2', prompt: 'Add a Rect class with a width and height, then loop over a square of side 3 and a rect of 2 by 5, printing each area.',
      scaffold: { note: 'One loop over both objects, no if statement', code: 'class Shape:\n    def area(self):\n        return 0\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    def area(self):\n        return self.side * self.side' },
      expect: ['9', '10'],
      hints: ['Rect builds on Shape the same way Square does.', 'Put both objects in a list and loop over it, calling area on each.'],
      craft: 'usesLoop',
      solution: 'class Shape:\n    def area(self):\n        return 0\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    def area(self):\n        return self.side * self.side\n\nclass Rect(Shape):\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n\nshapes = [Square(3), Rect(2, 5)]\nfor shape in shapes:\n    print(shape.area())' },

    { id: 'poly-3', prompt: 'The child was meant to replace the greeting but does not. Fix it so it prints: hello from the child',
      scaffold: { note: null, code: 'class Greeting:\n    def greet(self):\n        return "hello from the parent"\n\nclass Cheerful(Greeting):\n    def greeting(self):\n        return "hello from the child"\n\nthing = Cheerful()\nprint(thing.greet())' },
      expect: ['hello from the child'],
      hints: ['Run it. Which version answered, and why?', 'Replacing a method means matching its name exactly. One letter is enough to miss.'],
      solution: 'class Greeting:\n    def greet(self):\n        return "hello from the parent"\n\nclass Cheerful(Greeting):\n    def greet(self):\n        return "hello from the child"\n\nthing = Cheerful()\nprint(thing.greet())' }
  ]
},

{
  id: 'contracts',
  level: 'Mastery',
  title: 'Designing to a contract',
  idea: 'A base class that says what must exist, and lets each child decide how.',
  unavailable: ['go'],
  teach: [
    { h: 'Abstraction is a promise about shape',
      p: 'A base class can declare that every child will answer a particular question, without deciding how any of them does it. Callers then depend on the promise instead of on any one implementation.' },
    { h: 'Different languages, same idea',
      p: { python: 'Python leans on the method simply being there — if it answers, it counts. Java and C# make the promise explicit with abstract classes and interfaces, and refuse to compile if a child breaks it.',
           javascript: 'JavaScript leans on the method simply being there — if it answers, it counts. TypeScript adds interfaces that are checked as you write, and Java and C# refuse to compile if a child breaks the promise.',
           ruby: 'Ruby leans on the method simply being there — if it answers, it counts, which Rubyists call duck typing. Java and C# make the promise explicit and refuse to compile if a child breaks it.' } },
    { h: 'Depend on the promise, not the thing',
      p: 'Code written against the base class keeps working when a new child appears. That is the whole payoff: adding a shape should not mean editing the code that draws shapes.' },
    { h: 'Composition is the other answer',
      p: 'Go has no inheritance at all, and builds the same flexibility by holding small pieces inside bigger ones and matching interfaces implicitly. When a hierarchy starts feeling forced, this is usually why.' }
  ],
  demo: { code: 'class Report:\n    def title(self):\n        return "untitled"\n    def show(self):\n        return "Report: " + self.title()\n\nclass Sales(Report):\n    def title(self):\n        return "sales"\n\nprint(Report().show())\nprint(Sales().show())',
          caption: 'show was written once and never changed, yet it says something different for each child.' },
  practice: { h: 'Name the promise, not the implementation',
    p: 'Call the method area, not calculateAreaBySides. The caller cares what it gets back, never how the answer was found.' },
  tasks: [
    { id: 'con-1', prompt: 'A Greeter has a language method returning unknown, and a hello method that uses it. Write an Urdu greeter whose language is Urdu, and print its hello.',
      scaffold: { note: 'Only the language method needs replacing', code: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()' },
      expect: ['greeting in Urdu'],
      hints: ['The child replaces one method and inherits the other untouched.', 'hello never changes — it asks the object what its language is.'],
      solution: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()\n\nclass Urdu(Greeter):\n    def language(self):\n        return "Urdu"\n\nprint(Urdu().hello())' },

    { id: 'con-2', prompt: 'Add a Punjabi greeter too, then loop over one of each and print both greetings.',
      scaffold: { note: 'Adding a child should not mean editing anything that already worked', code: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()\n\nclass Urdu(Greeter):\n    def language(self):\n        return "Urdu"' },
      expect: ['greeting in Urdu', 'greeting in Punjabi'],
      hints: ['The second child follows exactly the same shape as the first.', 'Put one of each in a list and loop, calling hello on each.'],
      craft: 'usesLoop',
      solution: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()\n\nclass Urdu(Greeter):\n    def language(self):\n        return "Urdu"\n\nclass Punjabi(Greeter):\n    def language(self):\n        return "Punjabi"\n\ngreeters = [Urdu(), Punjabi()]\nfor greeter in greeters:\n    print(greeter.hello())' }
  ]
},

{
  id: 'sandbox',
  level: 'Free play',
  title: 'Sandbox',
  idea: 'No tasks, no checking. Write anything and watch it run.',
  teach: [
    { h: 'Yours',
      p: 'Nothing here is graded. Change the program below, run it, step through it, and switch it into the other language to see the same idea in different clothes.' }
  ],
  demo: { code: 'def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nfor i in range(8):\n    print(fib(i))',
          caption: 'A function that calls itself. Step in and watch the call depth grow.' },
  practice: { h: 'Break it on purpose',
    p: 'Deliberately causing an error and reading what comes back is one of the fastest ways to learn a language.' },
  tasks: [
    { id: 'sandbox-free', prompt: 'Write whatever you like. Nothing is checked.',
      scaffold: { note: null, code: 'total = 0\nfor i in range(1, 11):\n    total = total + i\nprint(total)' },
      expect: null, hints: [], solution: null }
  ]
}
];
/* CONTENT-END */
