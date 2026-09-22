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
      p: 'Anything inside quotes is copied out exactly: spelling, spaces, capital letters and all. Open a quote and forget to close it and the program will not run at all.' }
  ],
  demo: { code: 'print("Hello!")\nprint("I am doing exactly what I was told.")',
          caption: 'Two instructions, run top to bottom.' },
  practice: { h: 'Say exactly what you mean',
    p: 'Most early errors are not misunderstandings of programming. They are a missing quote, a missing bracket, or a capital letter in the wrong place.' },
  tasks: [
    { id: 'speak-1', prompt: 'Print this line exactly: Good morning!',
      scaffold: { note: 'Write your instruction on the line below' },
      expect: ['Good morning!'],
      hints: ['You need one instruction, and it goes on its own line.',
              'The instruction is the one from the lesson above, with round brackets after it.',
              'Inside the brackets, put the text in double quotes: "Good morning!"'],
      solution: 'print("Good morning!")' },

    { id: 'speak-2', prompt: 'Print two lines: first Coffee, then Bagel.',
      scaffold: { note: 'Two instructions, one per line' },
      expect: ['Coffee', 'Bagel'],
      hints: ['Two separate instructions, one under the other.',
              'The order you write them is the order they happen.'],
      solution: 'print("Coffee")\nprint("Bagel")' },

    { id: 'speak-3', prompt: 'This program is broken. Fix it so it prints Latte.',
      scaffold: { note: null },
      override: { python: 'print("Latte)', javascript: 'console.log("Latte);', ruby: 'puts "Latte' },
      expect: ['Latte'],
      hints: ['Read the error message underneath. It names the problem.',
              'Count the quote marks. Text needs one at each end.'],
      solution: 'print("Latte")' }
  ]
},

{
  id: 'numbers',
  level: 'Basics',
  title: 'Doing arithmetic',
  idea: 'Numbers are values, not text, and the usual maths rules apply.',
  teach: [
    { h: 'Quotes change everything',
      p: 'Written with quotes, "5" is text: a character that looks like a five. Without quotes, 5 is a number you can do arithmetic with. Joining "5" and "5" gives "55". Adding 5 and 5 gives 10.' },
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
              'Then print the two names added together, not the numbers.'],
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
      p: 'The + symbol joins two pieces of text end to end. "Hello, " + "Jordan" becomes "Hello, Jordan". Notice the space is inside the quotes. The computer will not add one for you.' },
    { h: 'Text and numbers do not mix with +',
      p: 'Adding text to a number is refused, because there is no sensible answer. Instead, pass several values to the print instruction separated by commas, and each one is shown with a space between.' },
    { h: 'Measuring',
      p: { python: 'len(something) counts the characters in text, or the items in a list.',
           javascript: 'something.length counts the characters in text, or the items in a list.',
           ruby: 'something.length counts the characters in text, or the items in a list.' } }
  ],
  demo: { code: 'name = "Jordan"\nprint("Hello, " + name)\nprint("Letters:", len(name))',
          caption: 'Two ways to combine: joining, and passing several values.' },
  practice: { h: 'Prefer commas to gluing',
    p: 'Joining with + forces everything to be text and breaks the moment a number appears. Commas handle any mixture, so reach for them first.' },
  tasks: [
    { id: 'text-1', prompt: 'Store the name Morgan, then print: Hello, Morgan',
      scaffold: { note: 'Store the name first, then build the greeting' },
      expect: ['Hello, Morgan'],
      hints: ['Put the name in a variable on the first line.',
              'Join the greeting text to the name with +. Watch the comma and the space.'],
      solution: 'name = "Morgan"\nprint("Hello, " + name)' },

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
      p: { python: 'The line ends with a colon, and everything indented underneath it belongs to that choice. Indentation is not decoration here. It is how the computer knows where the block ends.',
           javascript: 'The condition sits in round brackets, and everything inside the curly braces belongs to that choice. The braces are how the computer knows where the block ends.',
           ruby: 'The condition follows the word if with no brackets needed, and everything up to the matching end belongs to that choice. That end is how the computer knows where the block stops.' } },
    { h: 'Otherwise',
      p: 'else covers every case the condition did not. Between an if and an else, exactly one block always runs, never both and never neither.' }
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
                ruby: 'That middle case is written elsif (no second e), followed by its own condition.' },
              'Check 80 first. If you check 60 first, a score of 90 would also pass it.'],
      solution: 'score = 72\nif score >= 80:\n    print("A")\nelif score >= 60:\n    print("B")\nelse:\n    print("C")' },

    { id: 'if-3', prompt: 'This prints the wrong word. The condition is right. The blocks are the wrong way round. Fix it.',
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
           javascript: '&& is satisfied only when both sides hold. || is satisfied when at least one does. Two symbols, not one. A single & or | means something else entirely.',
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
  id: 'check-basics',
  level: 'Basics',
  title: 'Checkpoint: the basics',
  idea: 'One program using everything from this level at once.',
  teach: [
    { h: 'Nothing new here',
      p: 'This uses only what the six lessons above covered: values, names, arithmetic, text, and a choice. If a piece feels shaky, the lesson that taught it is right there in the menu.' },
    { h: 'Work out the answer by hand first',
      p: 'Before writing anything, do the arithmetic on paper and decide which branch should run. Then your job is only to say it in code, which is a much smaller job.' },
    { h: 'Build it a line at a time',
      p: 'Write one line, run it, look at the output. Three lines that you have watched work beat twelve lines you are hoping about.' }
  ],
  demo: { code: 'cost = 7\ncount = 2\ntotal = cost * count\nif total > 10:\n    print("Large order:", total)\nelse:\n    print("Small order:", total)',
          caption: 'The same shape as the task, smaller.' },
  practice: { h: 'Name the intermediate results',
    p: 'Storing the subtotal in its own variable before applying anything to it makes the program readable and makes a wrong answer easy to locate.' },
  tasks: [
    { id: 'chk-basics', prompt: 'A drink costs 4 and someone buys 3. Members get 2 off any order over 10, non-members get 1 off, and orders of 10 or less get nothing off. This buyer is a member. Print three lines: Subtotal: 12, Discount: 2, Total: 10.',
      scaffold: { note: 'Work out the subtotal first, then decide the discount, then the total', code: 'price = 4\nquantity = 3\nmember = True' },
      expect: ['Subtotal: 12', 'Discount: 2', 'Total: 10'],
      hints: ['Multiply to get the subtotal and store it under its own name.',
              'The discount needs three cases, so it needs a middle branch as well as an if and an else.',
              'The first case is over 10 and a member, which is two things that must both hold.',
              'Print with commas so the label and the number can sit on one line.'],
      solution: 'price = 4\nquantity = 3\nmember = True\nsubtotal = price * quantity\nif subtotal > 10 and member:\n    discount = 2\nelif subtotal > 10:\n    discount = 1\nelse:\n    discount = 0\ntotal = subtotal - discount\nprint("Subtotal:", subtotal)\nprint("Discount:", discount)\nprint("Total:", total)' }
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
      p: { python: 'for i in range(1, 6): runs the block with i set to 1, then 2, 3, 4 and 5. The second number is where it stops, and it is not included, so range(1, 6) ends at 5.',
           javascript: 'for (let i = 1; i < 6; i++) runs the block with i set to 1, then 2, 3, 4 and 5. It reads as: start at 1, keep going while i is under 6, add one each time.',
           ruby: 'for i in 1...6 runs the block with i set to 1, then 2, 3, 4 and 5. The three dots mean the last number is not included.' } },
    { h: 'The counter is a normal variable',
      p: 'Inside the block, i holds this pass\'s value, so you can print it, add it to a total, or test it with an if. It exists only inside the loop.' }
  ],
  demo: { code: 'for i in range(1, 6):\n    print(i)\nprint("done")',
          caption: 'Step through and watch i climb in the Variables panel.' },
  practice: { h: 'Keep the running total outside',
    p: 'A total must be created before the loop starts, or it would be reset to zero on every pass. Whatever changes on each pass goes inside the loop. Whatever must last between passes goes outside it.' },
  tasks: [
    { id: 'loop-1', prompt: 'Print the numbers 1 to 5, one per line, using a loop instead of five instructions.',
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
      p: 'A counting loop needs to know how many passes up front. A while loop does not. It keeps going for as long as its condition holds, however many passes that takes.' },
    { h: 'Something inside must change',
      p: 'The condition is checked before every pass. If nothing inside the block moves it towards false, the loop runs forever. That is not a rare bug. It is the most common one there is.' },
    { h: 'This app stops runaway loops',
      p: 'This app gives up after a while and tells you the program ran too long. A real computer will not: it will simply sit there until you stop it yourself.' }
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
      p: 'Reusing the outer loop\u2019s variable in the inner loop destroys the outer one\u2019s place. Give them different names: row and col say what they are far better than i and j.' },
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
              'The last position is one less than the length, so with four items, it is position 3.'],
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
      hints: ['Read the error. It says exactly which positions this list has.', 'Three items means positions 0, 1 and 2, so the last one is the length minus one.'],
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
      p: { python: 'def twice(n): names a procedure and says it expects one value, which will be called n inside. A name like n, waiting for a value, is called a parameter. Nothing runs until someone calls twice(7).',
           javascript: 'function twice(n) names a procedure and says it expects one value, which will be called n inside. A name like n, waiting for a value, is called a parameter. Nothing runs until someone calls twice(7).',
           ruby: 'def twice(n) names a procedure and says it expects one value, which will be called n inside. A name like n, waiting for a value, is called a parameter. Nothing runs until someone calls twice(7).' } },
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
      p: 'A program can finish perfectly and still be wrong. Compare your output against what you expected, line by line. That difference is the bug, even when nothing complained.' }
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
      p: 'A missing key, a number that should not be negative, a file that is not there. These are not bugs in your code. They are situations your code has to survive.' },
    { h: 'try and catch',
      p: { python: 'The try block holds the risky work. If anything in it fails, the rest of the block is abandoned and the except block runs instead. The program then carries on.',
           javascript: 'The try block holds the risky work. If anything in it fails, the rest of the block is abandoned and the catch block runs instead. The program then carries on.',
           ruby: 'The begin block holds the risky work. If anything in it fails, the rest of the block is abandoned and the rescue block runs instead. The program then carries on.' } },
    { h: 'The error carries a message',
      p: { python: 'This app always names the caught error err. Printing it shows what actually went wrong, which is far more useful than printing "something failed".',
           javascript: 'This app always names the caught error err, and err.message is what went wrong. That is far more useful than printing "something failed".',
           ruby: 'This app always names the caught error err, and err.message is what went wrong. That is far more useful than printing "something failed".' } },
    { h: 'You can raise your own',
      p: { python: 'raise Exception("age cannot be negative") stops the current work immediately and hands that message to whoever is willing to catch it. Use it when a value makes no sense to continue with.',
           javascript: 'throw new Error("age cannot be negative") stops the current work immediately and hands that message to whoever is willing to catch it. Use it when a value makes no sense to continue with.',
           ruby: 'raise "age cannot be negative" stops the current work immediately and hands that message to whoever is willing to catch it. Use it when a value makes no sense to continue with.' } },
    { h: 'What even counts as a failure varies',
      p: 'Asking a dictionary for a key it does not have raises an error in Python and C#, but hands back nothing at all in JavaScript, Ruby, PHP and Java. This app treats it as a failure, because a silent nothing tends to surface later as a much stranger bug.' },
    { h: 'Not every language works this way',
      p: 'Go has no exceptions at all. Functions return an error alongside their result and the caller checks it every time. That is a deliberate disagreement about whether failures should be easy to ignore, and it is why this lesson has no Go version.' }
  ],
  demo: { code: 'def price_of(item):\n    prices = {"coffee": 3}\n    if item in prices:\n        return prices[item]\n    raise Exception("no price for " + item)\n\ntry:\n    print(price_of("matcha"))\nexcept Exception as err:\n    print("could not find it")\n    print(err)\nprint("still running")',
          caption: 'The last line proves the program survived. Step through and watch it jump out of the function.' },
  practice: { h: 'Catch what you can actually handle',
    p: 'Wrapping everything in a try that quietly swallows the message turns a loud, fixable failure into a silent, mysterious one. Catch a failure when you have something sensible to do about it.' },
  tasks: [
    { id: 'err-1', prompt: 'The take function always fails. Catch that failure so the program prints not found, then carries on to print done.',
      scaffold: { note: 'The call is the risky part', code: 'def take(item):\n    raise Exception("we are out of " + item)\n\ntake("sugar")\nprint("done")' },
      expect: ['not found', 'done'],
      hints: ['Put the risky call inside the block that is allowed to fail.',
              'The block that runs instead prints the two words asked for.',
              'The last line stays outside both blocks so it always runs.'],
      solution: 'def take(item):\n    raise Exception("we are out of " + item)\n\ntry:\n    take("sugar")\nexcept Exception as err:\n    print("not found")\nprint("done")' },

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
      p: 'The % symbol gives what is left over after dividing. 17 % 5 is 2. When the remainder is 0, the division was exact, so i % 3 == 0 is how you ask "does 3 divide into this evenly?"' },
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
              'No else is needed. When the condition is false, nothing should happen.'],
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
      p: 'A list answers "what is the third one". A dictionary answers "what is Ana\u2019s age". Most real data is the second kind, which is why dictionaries turn up in almost every program you will ever read.' },
    { h: 'Keys are unique',
      p: 'Storing a value under a key that already exists replaces the old one rather than adding a second entry. That is usually what you want, and occasionally a bug you will spend an hour finding.' },
    { h: 'Asking for a key that is not there stops the program',
      p: { python: 'Check first with "ana" in ages, which is true or false and never fails.',
           javascript: 'Check first with "ana" in ages, which is true or false and never fails.',
           ruby: 'Check first with ages.key?("ana"), which is true or false and never fails.' } },
    { h: 'Looping visits the keys',
      p: 'Walking a dictionary hands you each key, and you look up the value yourself. Python, JavaScript and Ruby keep the order you inserted things in. Go deliberately randomises it so nobody can depend on it, and Java has no dictionary literal at all. You create the map and put entries in one by one. Switch to Java and look.' }
  ],
  demo: { code: 'ages = {"ana": 30, "ben": 25}\nages["chris"] = 41\nprint(len(ages))\nfor name in ages:\n    print(name, ages[name])',
          caption: 'Step through and watch the dictionary grow in the Variables panel.' },
  practice: { h: 'Check before you reach',
    p: 'Any lookup of a key that came from outside your program (a user, a file, a form) should be guarded. A missing key is not rare. It happens all the time.' },
  tasks: [
    { id: 'dict-1', prompt: 'Build a dictionary of prices: coffee is 3, bagel is 4. Print the price of coffee, then how many entries there are.',
      scaffold: { note: 'Keys on the left, values on the right' },
      expect: ['3', '2'],
      hints: ['A dictionary literal uses braces, with each key and value separated inside.',
              'Look a value up by putting its key in square brackets.'],
      solution: 'prices = {"coffee": 3, "bagel": 4}\nprint(prices["coffee"])\nprint(len(prices))' },

    { id: 'dict-2', prompt: 'Add muffin at 5 to the prices, then print whether muffin is in there and whether scone is.',
      scaffold: { note: 'Add an entry, then ask two questions', code: 'prices = {"coffee": 3, "bagel": 4}' },
      expect: ['True', 'False'],
      hints: ['Assigning to a key that does not exist yet creates it.',
              'The membership test gives back true or false, so it can be printed directly.'],
      solution: 'prices = {"coffee": 3, "bagel": 4}\nprices["muffin"] = 5\nprint("muffin" in prices)\nprint("scone" in prices)' },

    { id: 'dict-3', prompt: 'Print every item and its price, one per line, as lines like: coffee 3',
      scaffold: { note: 'Loop over the dictionary and look each value up', code: 'prices = {"coffee": 3, "bagel": 4, "muffin": 5}' },
      expect: ['coffee 3', 'bagel 4', 'muffin 5'],
      hints: ['The loop hands you each key, not each value.',
              'Inside the loop, look the value up using the key you were handed.'],
      craft: 'usesLoop',
      solution: 'prices = {"coffee": 3, "bagel": 4, "muffin": 5}\nfor item in prices:\n    print(item, prices[item])' },

    { id: 'dict-4', prompt: 'This stops with an error. Fix it so it prints the price when the item exists and the word missing when it does not.',
      scaffold: { note: null, code: 'prices = {"coffee": 3}\nwanted = "scone"\nprint(prices[wanted])' },
      expect: ['missing'],
      hints: ['Read the error: it lists the keys the dictionary actually holds.',
              'Ask whether the key is there before reaching for it, and print the other word when it is not.'],
      solution: 'prices = {"coffee": 3}\nwanted = "scone"\nif wanted in prices:\n    print(prices[wanted])\nelse:\n    print("missing")' }
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
          caption: 'Notice that name still has its spaces afterwards, because strip handed back a new piece of text.' },
  practice: { h: 'Clean input at the edge',
    p: 'Trim and lower-case anything typed by a person the moment it arrives, once, rather than sprinkling those calls through every comparison later on.' },
  tasks: [
    { id: 'str-1', prompt: 'The name arrives with spaces around it. Print it with the spaces removed and in capitals.',
      scaffold: { note: 'Two helpers, one after the other', code: 'name = "  morgan  "' },
      expect: ['MORGAN'],
      hints: ['One helper removes the surrounding spaces, another changes the case.',
              'Each hands back new text, so you can apply the second to the result of the first.'],
      solution: 'name = "  morgan  "\nprint(name.strip().upper())' },

    { id: 'str-2', prompt: 'Print whether the address contains an @ sign, and whether it starts with the letter m.',
      scaffold: { note: 'Two separate questions about the same text', code: 'address = "morgan@example.com"' },
      expect: ['True', 'True'],
      hints: ['One of these is a membership test, the other is a helper about the beginning.',
              'Both give back true or false, so they can be printed directly.'],
      solution: 'address = "morgan@example.com"\nprint("@" in address)\nprint(address.startswith("m"))' },

    { id: 'str-3', prompt: 'This refuses to run. Fix it so it prints: Score: 91',
      scaffold: { note: null, code: 'score = 91\nprint("Score: " + score)' },
      expect: ['Score: 91'],
      hints: ['Read the error. It names the two kinds of thing you tried to join.',
              'Turn the number into text first, then join it.'],
      solution: 'score = 91\nprint("Score: " + str(score))' }
  ]
},

{
  id: 'check-intermediate',
  level: 'Intermediate',
  title: 'Checkpoint: loops, lists and dictionaries',
  idea: 'A small report built from everything in this level.',
  unavailable: ['go'],
  teach: [
    { h: 'Everything from this level, once',
      p: 'A function, a loop, a list, a dictionary and a text helper, all in one program. That combination is roughly what a real hundred-line program is made of.' },
    { h: 'Decide what each piece owns',
      p: 'The function should do one job and hand back a value. The loop should do one pass. When a program gets confusing it is nearly always because one piece is doing two things.' },
    { h: 'A dictionary and a list together',
      p: 'It is normal to walk a dictionary and collect its values into a list so you can hand them to something that expects a list. That is not a hack. It is the usual way to do it.' }
  ],
  demo: { code: 'scores = {"a": 10, "b": 30}\nvalues = []\nfor key in scores:\n    values.append(scores[key])\nprint(len(values), values[0], values[1])',
          caption: 'Walking a dictionary and collecting its values.' },
  practice: { h: 'Return values, print outside',
    p: 'Let the function compute and hand back. Printing inside it feels shorter today and blocks every reuse tomorrow.' },
  tasks: [
    { id: 'chk-inter', prompt: 'Three students are stored with their scores. Write an average function, then print three lines: how many students there are, their average, and the top scorer\u2019s name in capitals.',
      scaffold: { note: 'A function for the average, a loop to gather the values and find the top', code: 'scores = {"morgan": 80, "taylor": 95, "jordan": 62}' },
      expect: ['Students: 3', 'Average: 79', 'Top: TAYLOR'],
      hints: ['The average function takes a list, adds it up in a loop, and divides by how many there are.',
              'One pass over the dictionary can do two jobs: collect each value into a list, and remember the highest name so far.',
              'Compare scores[name] against the score of the best name you have kept.',
              'The name goes to capitals with a text helper before printing.'],
      craft: 'usesFunction',
      solution: 'def average(nums):\n    total = 0\n    for n in nums:\n        total = total + n\n    return total / len(nums)\n\nscores = {"morgan": 80, "taylor": 95, "jordan": 62}\nbest = "morgan"\nvalues = []\nfor name in scores:\n    values.append(scores[name])\n    if scores[name] > scores[best]:\n        best = name\nprint("Students:", len(scores))\nprint("Average:", average(values))\nprint("Top:", best.upper())' }
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
  demo: { code: 'class Cup:\n    def __init__(self, capacity):\n        self.capacity = capacity\n    def describe(self):\n        return "a cup holding " + self.capacity\n\ncup = Cup("300ml")\nprint(cup.describe())',
          caption: 'Step into describe and watch self.capacity appear in the Variables panel.' },
  practice: { h: 'Set every field in the constructor',
    p: 'If a field only appears later, in some branch of some method, then some objects will not have it and the program will fail on those. Give every field a value the moment the object is born.' },
  tasks: [
    { id: 'obj-1', prompt: 'Write a Book class that stores a title and a page count. Make one for Northern Trails with 210 pages, then print its title and pages on one line.',
      scaffold: { note: 'A class, a constructor that stores both values, then one object' },
      expect: ['Northern Trails 210'],
      hints: ['The constructor takes the two values and stores each one on the object.',
              'Reading a field from outside uses the object name, a dot, and the field name.'],
      solution: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n\nbook = Book("Northern Trails", 210)\nprint(book.title, book.pages)' },

    { id: 'obj-2', prompt: 'Give that Book a method called is_long that answers whether it has more than 200 pages, and print the answer.',
      scaffold: { note: 'A method can read the object it belongs to', code: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages' },
      expect: ['True'],
      hints: ['The method needs no values passed in. Everything it needs is already on the object.',
              'A comparison is already true or false, so it can be handed straight back.'],
      solution: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n    def is_long(self):\n        return self.pages > 200\n\nbook = Book("Northern Trails", 210)\nprint(book.is_long())' },

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
      p: 'Inheritance says a Dog is an Animal. If the sentence sounds wrong (a Car is an Engine), then the class should hold the other one as a field instead. That is composition, and it is the right answer more often than beginners expect.' },
    { h: 'Not every language has it',
      p: 'Go deliberately leaves inheritance out, which is why this lesson has no Go version. It composes small pieces instead. That is a real disagreement between language designers, not an oversight.' }
  ],
  demo: { code: 'class Vehicle:\n    def __init__(self, wheels):\n        self.wheels = wheels\n    def describe(self):\n        return "a vehicle"\n\nclass Car(Vehicle):\n    def __init__(self, wheels, doors):\n        super().__init__(wheels)\n        self.doors = doors\n\ncar = Car(4, 5)\nprint(car.wheels, car.doors)\nprint(car.describe())',
          caption: 'Car never defines describe, yet it has one. Step in and watch the constructor call its parent.' },
  practice: { h: 'Keep the chain shallow',
    p: 'One or two levels is almost always enough. Deep hierarchies make it impossible to answer the only question that matters: where does this behaviour actually come from?' },
  tasks: [
    { id: 'inh-1', prompt: 'Write an Account class holding an owner, then a Savings class that builds on it and adds a rate. Make a Savings for Taylor at 3, and print the owner and the rate.',
      scaffold: { note: 'Two classes, the second built on the first' },
      expect: ['Taylor 3'],
      hints: ['The child names its parent as part of its own class line.',
              'The child\u2019s constructor takes both values, hands the owner up to the parent, and keeps the rate itself.'],
      solution: 'class Account:\n    def __init__(self, owner):\n        self.owner = owner\n\nclass Savings(Account):\n    def __init__(self, owner, rate):\n        super().__init__(owner)\n        self.rate = rate\n\nsavings = Savings("Taylor", 3)\nprint(savings.owner, savings.rate)' },

    { id: 'inh-2', prompt: 'A Shape has a name and a method called label that returns it. Write Circle, built on Shape, that adds a radius. Print the label and the radius.',
      scaffold: { note: 'The child inherits label without writing it again', code: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n    def label(self):\n        return self.name' },
      expect: ['circle 7'],
      hints: ['Circle needs no label method of its own. It already has one.',
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
  id: 'recursion',
  level: 'Advanced',
  title: 'A function that calls itself',
  idea: 'Describe one step and hand the rest of the job back to the same function.',
  known: 'recursion',
  unavailable: [],
  teach: [
    { h: 'Some problems contain themselves',
      p: 'The total of a list is the first value plus the total of the rest. The rest is the same kind of problem, only smaller, and you already have a function that solves that kind of problem.' },
    { h: 'Two parts, always',
      p: 'A base case that answers outright without calling anything, and a recursive case that does one step and calls itself on what is left. Leave out the base case and it never stops.' },
    { h: 'It must get smaller',
      p: 'Every call has to move towards the base case: a shorter list, a smaller number, one position further along. If a call hands on a problem the same size as the one it got, nothing is progressing.' },
    { h: 'Each call keeps its own names',
      p: 'A call that is waiting on another call still holds its own values, untouched. That is what lets five copies of the same function be part-way through at once without treading on each other.' }
  ],
  demo: { code: 'def total_from(nums, i):\n    if i >= len(nums):\n        return 0\n    return nums[i] + total_from(nums, i + 1)\n\nprint(total_from([4, 5, 6], 0))',
          caption: 'Step in and watch i climb, then watch the answers come back out in reverse.' },
  practice: { h: 'Write the base case first',
              p: 'Decide what the smallest version of the problem answers before writing anything else. Most runaway recursions are a base case that was added last and does not quite cover the ending.' },
  tasks: [
    { id: 'rc-1',
      prompt: 'Write count_down(n) that prints n, then n - 1, and so on down to 1, by calling itself. Print nothing once n reaches 0. Call it with 3.',
      scaffold: { note: 'What should it do when n reaches 0?' },
      expect: ['3', '2', '1'],
      hints: [
        'When n is 0 there is nothing to print and nothing to call, so stop there.',
        'Otherwise print n, then ask the same function to handle n - 1.'
      ],
      solution: 'def count_down(n):\n    if n <= 0:\n        return 0\n    print(n)\n    return count_down(n - 1)\n\ncount_down(3)',
      craft: 'usesFunction' },
    { id: 'rc-2',
      prompt: 'Write total_from(nums, i) that adds up a list from position i onwards by calling itself, and print the total of [4, 5, 6] starting at 0.',
      scaffold: { note: 'The total from here is this value plus the total from the next one' },
      expect: ['15'],
      hints: [
        'Once i has run off the end of the list, the total of what is left is 0.',
        'Otherwise it is the value at i plus whatever the same function reports for i + 1.'
      ],
      solution: 'def total_from(nums, i):\n    if i >= len(nums):\n        return 0\n    return nums[i] + total_from(nums, i + 1)\n\nprint(total_from([4, 5, 6], 0))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'check-advanced',
  level: 'Advanced',
  title: 'Checkpoint: objects and failures',
  idea: 'A class, a child that extends it, and a failure you survive.',
  unavailable: ['go'],
  teach: [
    { h: 'Everything from this level, once',
      p: 'Two classes with one inheriting from the other, a method replaced in the child, and a lookup that is allowed to fail without stopping the program.' },
    { h: 'The loop should not care which kind it has',
      p: 'Both objects go in one list and the loop calls the same method on each. If you find yourself checking what kind something is, the child should probably have replaced a method instead.' },
    { h: 'Guard only the risky line',
      p: 'Wrap the lookup, not the whole program. A block that swallows everything hides the failures you would rather have seen.' }
  ],
  demo: { code: 'class Note:\n    def __init__(self, text):\n        self.text = text\n    def label(self):\n        return self.text\n\nclass Loud(Note):\n    def label(self):\n        return self.text.upper()\n\nfor note in [Note("hi"), Loud("hi")]:\n    print(note.label())',
          caption: 'One list, two kinds, one method call.' },
  practice: { h: 'Let the message speak',
    p: 'When you catch a failure, either print what it actually said or say something more useful than it did. "Something went wrong" is worse than the original.' },
  tasks: [
    { id: 'chk-adv', prompt: 'Write an Item class holding a name and a price with a label method returning the name. Write a Boxed child that also holds a count and whose label adds a space and x then the count. Print each item\u2019s label and price. Then write price_of(name) which returns the price from a stock dictionary holding only bagel, and raises a failure carrying the message not stocked for anything else. Ask it for scone, catch the failure, and print what it said.',
      scaffold: { note: 'Two classes and one function that refuses politely' },
      expect: ['coffee 3', 'bagel x6 4', 'not stocked'],
      hints: ['The child hands the name and price up to the parent, then keeps the count itself.',
              'To join the count onto the name it has to become text first.',
              'Put both objects in one list and loop, printing the label and the price for each.',
              'price_of checks whether the name is there, returns it if so, and raises a failure carrying the message if not.',
              'Whether a missing key is itself a failure varies by language, which is exactly why you raise your own.'],
      solution: 'class Item:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n    def label(self):\n        return self.name\n\nclass Boxed(Item):\n    def __init__(self, name, price, count):\n        super().__init__(name, price)\n        self.count = count\n    def label(self):\n        return self.name + " x" + str(self.count)\n\ndef price_of(name):\n    stock = {"bagel": 4}\n    if name in stock:\n        return stock[name]\n    raise Exception("not stocked")\n\nitems = [Item("coffee", 3), Boxed("bagel", 4, 6)]\nfor item in items:\n    print(item.label(), item.price)\ntry:\n    print(price_of("scone"))\nexcept Exception as err:\n    print(err)' }
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
      p: 'Java treats every method this way automatically. C# does not: the parent must say virtual and the child must say override, or the wrong method gets called. This app writes both for you. Switch to C# and look.' }
  ],
  demo: { code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return self.name + " makes a sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return self.name + " says woof"\n\nclass Cat(Animal):\n    def speak(self):\n        return self.name + " says meow"\n\npets = [Dog("Rex"), Cat("Whiskers"), Animal("Thing")]\nfor pet in pets:\n    print(pet.speak())',
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
      p: { python: 'Python leans on the method being there. If it answers, it counts. Java and C# make the promise explicit with abstract classes and interfaces, and refuse to compile if a child breaks it.',
           javascript: 'JavaScript leans on the method being there. If it answers, it counts. TypeScript adds interfaces that are checked as you write, and Java and C# refuse to compile if a child breaks the promise.',
           ruby: 'Ruby leans on the method being there. If it answers, it counts, which Rubyists call duck typing. Java and C# make the promise explicit and refuse to compile if a child breaks it.' } },
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
    { id: 'con-1', prompt: 'A Greeter has a language method returning unknown, and a hello method that uses it. Write a French greeter whose language is French, and print its hello.',
      scaffold: { note: 'Only the language method needs replacing', code: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()' },
      expect: ['greeting in French'],
      hints: ['The child replaces one method and inherits the other untouched.', 'hello never changes. It asks the object what its language is.'],
      solution: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()\n\nclass French(Greeter):\n    def language(self):\n        return "French"\n\nprint(French().hello())' },

    { id: 'con-2', prompt: 'Add a Spanish greeter too, then loop over one of each and print both greetings.',
      scaffold: { note: 'Adding a child should not mean editing anything that already worked', code: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()\n\nclass French(Greeter):\n    def language(self):\n        return "French"' },
      expect: ['greeting in French', 'greeting in Spanish'],
      hints: ['The second child follows exactly the same shape as the first.', 'Put one of each in a list and loop, calling hello on each.'],
      craft: 'usesLoop',
      solution: 'class Greeter:\n    def language(self):\n        return "unknown"\n    def hello(self):\n        return "greeting in " + self.language()\n\nclass French(Greeter):\n    def language(self):\n        return "French"\n\nclass Spanish(Greeter):\n    def language(self):\n        return "Spanish"\n\ngreeters = [French(), Spanish()]\nfor greeter in greeters:\n    print(greeter.hello())' }
  ]
},

{
  id: 'check-mastery',
  level: 'Mastery',
  title: 'Checkpoint: designing to a contract',
  idea: 'A base class that decides the shape, and children that fill it in.',
  unavailable: ['go'],
  teach: [
    { h: 'The payoff, in one program',
      p: 'One method written once in the parent, never edited again, saying something different for every child. Adding a fourth report should mean adding a class and touching nothing else.' },
    { h: 'The test of a good contract',
      p: 'If adding a new kind forces you back into code that already worked, the contract was drawn in the wrong place.' }
  ],
  demo: { code: 'class Greeting:\n    def word(self):\n        return "hello"\n    def say(self):\n        return self.word() + " there"\n\nclass Formal(Greeting):\n    def word(self):\n        return "good evening"\n\nprint(Greeting().say())\nprint(Formal().say())',
          caption: 'say was written once and never changed.' },
  practice: { h: 'Write the caller first',
    p: 'Decide what the code using your classes should look like, then design the classes so it reads that way. Doing it in the other order is how hierarchies end up shaped for their own convenience.' },
  tasks: [
    { id: 'chk-mastery', prompt: 'A Report has a title method returning untitled and a line method returning Report: followed by the title. Write Sales and Staff children whose titles are sales and staff. Put one of each and a plain Report in a list and print every line.',
      scaffold: { note: 'Only the title method changes in each child' },
      expect: ['Report: sales', 'Report: staff', 'Report: untitled'],
      hints: ['The parent has two methods. Each child replaces only one of them.',
              'The line method calls the object\u2019s own title, so it says something different per child without being rewritten.',
              'Put the three objects in a list and loop over it, printing the line for each.'],
      craft: 'usesLoop',
      solution: 'class Report:\n    def title(self):\n        return "untitled"\n    def line(self):\n        return "Report: " + self.title()\n\nclass Sales(Report):\n    def title(self):\n        return "sales"\n\nclass Staff(Report):\n    def title(self):\n        return "staff"\n\nreports = [Sales(), Staff(), Report()]\nfor report in reports:\n    print(report.line())' }
  ]
},

{
  id: 'complexity',
  level: 'Problems',
  title: 'Measure how the work grows',
  idea: 'What matters is not how long it takes on ten items, but what happens when there are ten thousand.',
  known: 'time complexity, usually written in Big O notation such as O(n) or O(n²)',
  unavailable: ['go'],   // the one-pass version needs a dictionary literal (decision 2)
  teach: [
    { h: 'Speed is the wrong question',
      p: 'A fast machine makes everything quicker by the same factor and changes nothing about which approach wins. The useful question is what happens to the work when the input doubles.' },
    { h: 'Three kinds of growth',
      p: 'If doubling the input doubles the work, the growth is called linear. Walking a list once grows like this. If doubling the input makes four times the work, it is called quadratic, and it usually means a loop inside a loop. If doubling the input adds only one more step, it is called logarithmic, which is what halving the search each time gives you.' },
    { h: 'Count the steps, not the seconds',
      p: 'Look at how many times the innermost line runs. One loop over n items runs it n times. A loop inside a loop runs it n times n. That count is the thing that grows.' },
    { h: 'You can watch it happen',
      p: 'Run the same program on a small input and then a doubled one, and compare the step counts. Quadrupling is not an opinion about your code. It is a measurement, and this app takes it for you.' }
  ],
  demo: { code: 'def has_duplicate(nums):\n    for i in range(0, len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False\n\nprint(has_duplicate([1, 2, 3, 2]))\nprint(has_duplicate([1, 2, 3]))',
          caption: 'Two nested loops over the same list: double the list and this does four times the work.' },
  practice: { h: 'Notice the loop inside the loop',
              p: 'Nearly every quadratic program in practice is a loop nested inside another over the same data. Spotting that shape is most of what reading for growth amounts to.' },
  tasks: [
    { id: 'cx-1',
      prompt: 'Write has_duplicate(nums) the nested-loop way: for each value, compare it against every later value. Print the result for [1, 2, 3, 2] and for [1, 2, 3]. The app will measure how the work grows.',
      scaffold: { note: 'Compare each value against the ones after it' },
      expect: ['True', 'False'],
      hints: [
        'The inner loop can start one place after the outer one, because comparing a value with itself proves nothing.',
        'Return as soon as you find a match. There is no reason to keep looking.'
      ],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(has_duplicate(nums))', sizes: [60, 120], target: 'quadratic' },
      solution: 'def has_duplicate(nums):\n    for i in range(0, len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False\n\nprint(has_duplicate([1, 2, 3, 2]))\nprint(has_duplicate([1, 2, 3]))',
      craft: 'usesFunction' },
    { id: 'cx-2',
      prompt: 'Now write it as one pass, remembering what you have already seen in a dictionary. Same two answers. This time the work should only double when the list doubles.',
      scaffold: { note: 'Remember what you have seen' },
      expect: ['True', 'False'],
      hints: [
        'Keep a dictionary of the values already met.',
        'Before recording a value, check whether it is already in there. If it is, you are done.'
      ],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(has_duplicate(nums))', sizes: [60, 120], target: 'linear' },
      solution: 'def has_duplicate(nums):\n    seen = {}\n    for x in nums:\n        if x in seen:\n            return True\n        seen[x] = True\n    return False\n\nprint(has_duplicate([1, 2, 3, 2]))\nprint(has_duplicate([1, 2, 3]))',
      craft: 'usesLoop' }
  ]
},

{
  id: 'complement',
  level: 'Problems',
  title: 'Remember what you have seen',
  idea: 'Turning "check every pair" into one pass with a dictionary.',
  known: 'a hash map lookup (a dictionary is a hash map), and the classic example is the "two sum" problem',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'Any problem asking whether two values combine to make something is this pattern: two that add to a target, two that differ by k, two that complete each other. The wording changes from problem to problem, but the pattern stays the same.' },
    { h: 'The obvious answer is too slow',
      p: 'Comparing every value against every other value takes n squared steps. At a thousand items that is a million, which is fine. At a hundred thousand it is ten billion, which is not.' },
    { h: 'The better way',
      p: 'Walk the list once. At each value, work out what its partner would have to be, and ask whether you have already walked past it. A dictionary answers that instantly, so one pass replaces the nested loop.' },
    { h: 'How you are told',
      p: 'Nobody says "make it linear". The input size says it: if n can reach a hundred thousand, n squared is out and you need one pass or a sort.' }
  ],
  demo: { code: 'def has_pair(nums, target):\n    seen = {}\n    for x in nums:\n        need = target - x\n        if need in seen:\n            return True\n        seen[x] = 1\n    return False\n\nprint(has_pair([2, 7, 11, 15], 9))\nprint(has_pair([1, 2, 3], 100))',
          caption: 'One pass. Step through and watch seen fill up behind you.' },
  practice: { h: 'Write the slow one first',
    p: 'Getting a correct slow answer on paper is what shows you which repeated work to remove. Jumping straight for the clever version is how people end up stuck with neither.' },
  tasks: [
    { id: 'cl-1', prompt: 'Write has_pair(nums, target) the obvious way: check every pair. Print the result for [2, 7, 11, 15] with target 9, then for [1, 2, 3] with target 100.',
      scaffold: { note: 'Two loops. Correct first, fast later.' },
      expect: ['True', 'False'],
      hints: ['An outer loop over every position, and an inner loop over every position.',
              'Skip the case where both loops are on the same item.',
              'Return as soon as you find a pair. Return False after both loops finish.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(has_pair(nums, -1))', sizes: [60, 120], target: 'quadratic' },
      solution: 'def has_pair(nums, target):\n    for i in range(0, len(nums)):\n        for j in range(0, len(nums)):\n            if i != j:\n                if nums[i] + nums[j] == target:\n                    return True\n    return False\n\nprint(has_pair([2, 7, 11, 15], 9))\nprint(has_pair([1, 2, 3], 100))' },

    { id: 'cl-2', prompt: 'Same answers, one pass. Rewrite has_pair so its cost grows in step with the list rather than with the square of it.',
      scaffold: { note: 'One loop, and a dictionary of what you have already passed' },
      expect: ['True', 'False'],
      hints: ['Before the loop, make an empty dictionary to hold the values you have seen.',
              'At each value, the partner you need is target minus this value.',
              'Ask whether that partner is already in the dictionary. If not, record this value and carry on.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(has_pair(nums, -1))', sizes: [60, 120], target: 'linear' },
      solution: 'def has_pair(nums, target):\n    seen = {}\n    for x in nums:\n        need = target - x\n        if need in seen:\n            return True\n        seen[x] = 1\n    return False\n\nprint(has_pair([2, 7, 11, 15], 9))\nprint(has_pair([1, 2, 3], 100))' }
  ]
},

{
  id: 'window',
  level: 'Problems',
  title: 'Slide the window',
  idea: 'Reusing the last answer instead of recomputing it.',
  known: 'the sliding window technique',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'Any question about a run of items next to each other is a window problem. For example: the best k in a row, the longest stretch without a repeat, or the smallest stretch that reaches a total.' },
    { h: 'The slow way',
      p: 'Adding up each window from scratch re-adds almost the same numbers every time. Two neighbouring windows differ by exactly two values: the one that entered and the one that left.' },
    { h: 'The better way',
      p: 'Compute the first window once. Then slide: add the value entering, subtract the value leaving. Every step after the first is two operations, however wide the window is.' },
    { h: 'Why it is worth the care',
      p: 'The slow version costs the window width times the list length. The sliding version costs the list length, and stops caring how wide the window is at all.' }
  ],
  demo: { code: 'def best_window(nums, k):\n    total = 0\n    for i in range(0, k):\n        total = total + nums[i]\n    best = total\n    for i in range(k, len(nums)):\n        total = total + nums[i] - nums[i - k]\n        if total > best:\n            best = total\n    return best\n\nprint(best_window([1, 9, 2, 8, 3], 2))',
          caption: 'Step through the second loop and watch total change by two values at a time.' },
  practice: { h: 'Say what the window holds before you code it',
    p: 'Write down, in a sentence, what is true of the window at the top of every pass. Nearly every window bug is that sentence quietly stopping being true.' },
  tasks: [
    { id: 'win-1', prompt: 'Write best_window(nums, k) the obvious way: for every starting position, add up the k values there and keep the largest. Print the result for [1, 9, 2, 8, 3] with k of 2.',
      scaffold: { note: 'A loop for each start, and a loop to add up that window' },
      expect: ['11'],
      hints: ['The outer loop starts at 0 and stops so the window still fits.',
              'The inner loop adds k values beginning at the start position.',
              'Keep the largest total you have seen in a variable.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(best_window(nums, K))', sizes: [60, 120], target: 'quadratic' },
      solution: 'def best_window(nums, k):\n    best = 0\n    for start in range(0, len(nums) - k + 1):\n        total = 0\n        for i in range(start, start + k):\n            total = total + nums[i]\n        if total > best:\n            best = total\n    return best\n\nprint(best_window([1, 9, 2, 8, 3], 2))' },

    { id: 'win-2', prompt: 'Same answer, sliding. Rewrite best_window so its cost stops depending on how wide the window is.',
      scaffold: { note: 'Build the first window, then add one and drop one' },
      expect: ['11'],
      hints: ['Add up the first k values before the main loop starts.',
              'Then loop from k to the end, adding the arriving value and subtracting the one k places back.',
              'Compare against the best after each slide.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(best_window(nums, K))', sizes: [60, 120], target: 'linear' },
      solution: 'def best_window(nums, k):\n    total = 0\n    for i in range(0, k):\n        total = total + nums[i]\n    best = total\n    for i in range(k, len(nums)):\n        total = total + nums[i] - nums[i - k]\n        if total > best:\n            best = total\n    return best\n\nprint(best_window([1, 9, 2, 8, 3], 2))' }
  ]
},

{
  id: 'twopointers',
  level: 'Problems',
  title: 'Close in from both ends',
  idea: 'When the list is sorted, order tells you which way to move.',
  known: 'the two-pointer technique',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'The list is sorted, and you are looking for a pair. The moment a problem hands you sorted input, it is telling you something. Sorting is never mentioned by accident.' },
    { h: 'The better way',
      p: 'Start at both ends. If the pair sums to too little, the only way up is to move the left pointer right. If it is too much, move the right pointer left. Each step throws away a value you have proved cannot work.' },
    { h: 'Why it is safe to discard',
      p: 'When the smallest and the largest are already too small together, nothing paired with that smallest value can reach the target. That is the whole argument, and it is worth being able to say it out loud.' },
    { h: 'The pointers meet',
      p: 'Each pass moves one pointer inward, so they meet after at most one pass through the list. That is what makes it linear.' }
  ],
  demo: { code: 'def has_pair_sorted(nums, target):\n    left = 0\n    right = len(nums) - 1\n    while left < right:\n        total = nums[left] + nums[right]\n        if total == target:\n            return True\n        if total < target:\n            left = left + 1\n        else:\n            right = right - 1\n    return False\n\nprint(has_pair_sorted([1, 3, 5, 9], 8))\nprint(has_pair_sorted([1, 3, 5, 9], 100))',
          caption: 'Step through and watch left and right close in on each other.' },
  practice: { h: 'Check the sorted claim',
    p: 'This only works on sorted input. If you are not certain the list is sorted, either sort it first and say so, or use the dictionary pattern instead.' },
  tasks: [
    { id: 'tp-1', prompt: 'The list is sorted. Write has_pair_sorted(nums, target) with two pointers closing in from the ends. Print the result for [1, 3, 5, 9] with target 8, then with target 100.',
      scaffold: { note: 'One pointer at each end, moving inward' },
      expect: ['True', 'False'],
      hints: ['Start one variable at 0 and another at the last position.',
              'Keep going while they have not met.',
              'Too small means move the left one up. Too large means move the right one down.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(has_pair_sorted(nums, -1))', sizes: [60, 120], target: 'linear' },
      craft: 'usesLoop',
      solution: 'def has_pair_sorted(nums, target):\n    left = 0\n    right = len(nums) - 1\n    while left < right:\n        total = nums[left] + nums[right]\n        if total == target:\n            return True\n        if total < target:\n            left = left + 1\n        else:\n            right = right - 1\n    return False\n\nprint(has_pair_sorted([1, 3, 5, 9], 8))\nprint(has_pair_sorted([1, 3, 5, 9], 100))' }
  ]
},

{
  id: 'counting',
  level: 'Problems',
  title: 'Count in one pass',
  idea: 'A dictionary turns "how many of each" into a single walk.',
  known: 'frequency counting, usually with a hash map',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'Most common, appears more than once, first one that never repeats, anagram of: any question about how often things occur is a counting problem.' },
    { h: 'The slow way',
      p: 'Counting occurrences of a value by scanning the whole list, then doing that for every value, walks the list once per item. That is n squared for a question that only needs one pass.' },
    { h: 'The better way',
      p: 'Walk once, keeping a dictionary from value to count. Everything you might be asked afterwards comes out of that dictionary: the most common value, the ones seen twice, the first one seen only once.' },
    { h: 'Track the answer as you go',
      p: 'You often do not need a second pass either. Keep the best-so-far updated inside the same loop and you finish with the answer already in hand.' }
  ],
  demo: { code: 'def most_common(nums):\n    counts = {}\n    best = nums[0]\n    for x in nums:\n        if x in counts:\n            counts[x] = counts[x] + 1\n        else:\n            counts[x] = 1\n        if counts[x] > counts[best]:\n            best = x\n    return best\n\nprint(most_common([3, 1, 3, 2, 3]))',
          caption: 'One pass, and the answer is ready the moment the loop ends.' },
  practice: { h: 'Reach for a dictionary before a nested loop',
    p: 'If you catch yourself writing a loop inside a loop over the same list, stop and ask what you could have remembered on the first pass. The answer is usually a dictionary.' },
  tasks: [
    { id: 'ct-1', prompt: 'Write most_common(nums) the obvious way: for each value, count how many times it appears by scanning the whole list. Print the result for [3, 1, 3, 2, 3].',
      scaffold: { note: 'A loop inside a loop, for now' },
      expect: ['3'],
      hints: ['For each value, walk the whole list and count matches.',
              'Keep the value with the highest count so far.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(most_common(nums))', sizes: [60, 120], target: 'quadratic' },
      solution: 'def most_common(nums):\n    best = nums[0]\n    best_count = 0\n    for x in nums:\n        count = 0\n        for y in nums:\n            if y == x:\n                count = count + 1\n        if count > best_count:\n            best_count = count\n            best = x\n    return best\n\nprint(most_common([3, 1, 3, 2, 3]))' },

    { id: 'ct-2', prompt: 'Same answer, one pass. Rewrite most_common using a dictionary of counts.',
      scaffold: { note: 'Count as you walk, and keep the leader updated' },
      expect: ['3'],
      hints: ['Make an empty dictionary before the loop.',
              'At each value, add one to its count, creating the entry the first time you see it.',
              'Compare its new count against the leader\u2019s count in the same pass.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(most_common(nums))', sizes: [60, 120], target: 'linear' },
      solution: 'def most_common(nums):\n    counts = {}\n    best = nums[0]\n    for x in nums:\n        if x in counts:\n            counts[x] = counts[x] + 1\n        else:\n            counts[x] = 1\n        if counts[x] > counts[best]:\n            best = x\n    return best\n\nprint(most_common([3, 1, 3, 2, 3]))' }
  ]
},

{
  id: 'bsearch',
  level: 'Problems',
  title: 'Halve it every time',
  idea: 'Sorted input means you can throw away half the list at each step.',
  known: 'binary search',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'The list is sorted and you are looking for one thing, or for the boundary where an answer stops being true. Sorted plus search is nearly always this.' },
    { h: 'The better way',
      p: 'Look at the middle. If it is what you want, stop. If it is too small, everything to its left is too small as well, so throw all of it away. Repeat on what is left.' },
    { h: 'Why it is so fast',
      p: 'Each step halves what remains, so a thousand items take about ten steps and a million take about twenty. Doubling the list adds one step, not double the work.' },
    { h: 'Halving needs whole numbers',
      p: { python: 'Use // rather than /. A single slash gives 4.5 for nine halved, and a position has to be a whole number.',
           javascript: 'Use Math.floor around the division. A plain slash gives 4.5 for nine halved, and a position has to be a whole number.',
           ruby: 'Use .div rather than /. A plain slash here would give a fraction, and a position has to be a whole number.' } },
    { h: 'The part everyone gets wrong',
      p: 'The loop must keep shrinking. If low or high does not move on some path, the search spins forever. This app will stop you, but the cause is always that.' }
  ],
  demo: { code: 'def find(nums, target):\n    low = 0\n    high = len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(find([1, 3, 5, 7, 9], 7))\nprint(find([1, 3, 5, 7, 9], 4))',
          caption: 'Step through and watch low and high close in. Four values disappear at once.' },
  practice: { h: 'Say what is still possible',
    p: 'Before writing the loop, finish this sentence: the answer, if it exists, is between low and high. Every line you write must keep that true.' },
  tasks: [
    { id: 'bs-1', prompt: 'The list is sorted. Write find(nums, target) returning the position of the target, or -1 if it is not there. Print the position of 7 in [1, 3, 5, 7, 9], then the result of looking for 4.',
      scaffold: { note: 'Track the range that could still hold the answer' },
      expect: ['3', '-1'],
      hints: ['Two variables mark the range still worth searching: the lowest and highest positions.',
              'The middle is halfway between them, rounded down to a whole position.',
              'Compare the value at the middle against the target.',
              'Too small means the answer is above the middle, so move the low mark past it.',
              'When the marks cross, the target was never there.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\ntotal = 0\nfor q in range(0, 40):\n    total = total + find(nums, N - 1)\nprint(total)',
               baseline: 'def find(nums, target):\n    return 0', sizes: [64, 256], target: 'logarithmic' },
      solution: 'def find(nums, target):\n    low = 0\n    high = len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(find([1, 3, 5, 7, 9], 7))\nprint(find([1, 3, 5, 7, 9], 4))' }
  ]
},

{
  id: 'sortscan',
  level: 'Problems',
  title: 'Sort it, then walk it once',
  idea: 'Sorting first turns a hard question into an easy walk.',
  known: 'sorting as a preprocessing step',
  unavailable: ['go', 'java', 'csharp', 'php', 'javascript', 'typescript'],
  teach: [
    { h: 'How to spot it',
      p: 'Closest pair, biggest gap, are any two the same, group the matching ones. Anything where being next to each other would make the answer obvious.' },
    { h: 'The better way',
      p: 'Sort, then walk the sorted list comparing each value with the one before it. Values that belong together are now adjacent, so a single pass answers the question.' },
    { h: 'What it costs',
      p: 'Sorting is n log n, and the walk after it is n, so the whole thing is n log n. That is slower than a one-pass dictionary but far faster than comparing every pair, and it is often much easier to get right.' },
    { h: 'Sorting is not the same everywhere',
      p: 'JavaScript compares values as text unless you tell it otherwise, so its default sort puts 10 before 9. Fixing that needs a comparison function, which is beyond what this app writes, so this lesson runs in Python, Ruby and Kotlin. It is one of the most famous traps in the language and worth knowing before you meet it.' },
    { h: 'Sorting hands back a copy here',
      p: { python: 'sorted(nums) gives you a new list in order and leaves the original alone, which is usually what you want.',
           javascript: 'nums.toSorted() gives you a new array in order and leaves the original alone, which is usually what you want.',
           ruby: 'nums.sort gives you a new array in order and leaves the original alone, which is usually what you want.' } }
  ],
  demo: { code: 'nums = [9, 1, 5, 3]\nranked = sorted(nums)\nsmallest = ranked[1] - ranked[0]\nfor i in range(1, len(ranked)):\n    gap = ranked[i] - ranked[i - 1]\n    if gap < smallest:\n        smallest = gap\nprint(smallest)\nprint(nums[0])',
          caption: 'The last line proves the original list was never touched.' },
  practice: { h: 'Ask whether order would help before you sort',
    p: 'Sorting is not free, and it destroys the original order unless you keep a copy. Reach for it when adjacency is what makes the answer easy, not out of habit.' },
  tasks: [
    { id: 'ss-1', prompt: 'Write closest_gap(nums) returning the smallest difference between any two values. Print the result for [9, 1, 5, 3], then for [10, 20, 31].',
      scaffold: { note: 'Sorted values put the closest pair side by side' },
      expect: ['2', '10'],
      hints: ['Comparing every pair works but costs far more than it needs to.',
              'Once the values are in order, the closest pair must be neighbours.',
              'Sort first, then walk from the second value comparing each with the one before it.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(N - i)\nprint(closest_gap(nums))', sizes: [60, 120], target: 'linear' },
      solution: 'def closest_gap(nums):\n    ranked = sorted(nums)\n    smallest = ranked[1] - ranked[0]\n    for i in range(1, len(ranked)):\n        gap = ranked[i] - ranked[i - 1]\n        if gap < smallest:\n            smallest = gap\n    return smallest\n\nprint(closest_gap([9, 1, 5, 3]))\nprint(closest_gap([10, 20, 31]))' }
  ]
},

{
  id: 'stack',
  level: 'Problems',
  title: 'Keep a pile of what is still open',
  idea: 'The most recent unfinished thing is the one that must close next.',
  known: 'a stack, where the last thing in is the first thing out',
  unavailable: ['go', 'java', 'kotlin', 'csharp'],
  teach: [
    { h: 'How to spot it',
      p: 'Brackets, tags, undo, nesting of any kind. Whenever the thing that opened most recently is the thing that has to finish first, you want a pile.' },
    { h: 'The better way',
      p: 'Walk the input. An opening item goes on top of the pile. A closing item must match what is on top: if it does, take that one off. If it does not, the input is wrong.' },
    { h: 'A list is a pile',
      p: 'Adding to the end and reading the last position is all a pile is. You do not need anything new, only the habit of touching nothing but the end.' },
    { h: 'Do not forget the end',
      p: 'Running out of input with things still on the pile means something never closed. That check is as important as the mismatches, and it is the one people leave out.' },
    { h: 'Walking through text differs a lot',
      p: 'Python, JavaScript, Ruby and PHP treat a character as a one-letter piece of text. Java, Kotlin and C# have a separate character type, so comparing one against "(" is refused outright. That is why this lesson is missing in those three.' }
  ],
  demo: { code: 'text = "((a)(b))"\nopen_now = 0\ndeepest = 0\nfor c in text:\n    if c == "(":\n        open_now = open_now + 1\n        if open_now > deepest:\n            deepest = open_now\n    if c == ")":\n        open_now = open_now - 1\nprint(deepest)',
          caption: 'Step through and watch open_now rise and fall as the brackets nest.' },
  practice: { h: 'Say what the pile means',
    p: 'Write down what being on the pile represents before you code: here it is "opened and not yet closed". A pile you cannot describe in a sentence will have a bug in it.' },
  tasks: [
    { id: 'st-1', prompt: 'Write depth(text) returning how deeply the round brackets nest at their deepest point. Print the result for "((a)(b))", then for "()".',
      scaffold: { note: 'Count what is currently open, and remember the highest it reached' },
      expect: ['2', '1'],
      hints: ['You do not need to store the brackets themselves, only how many are open.',
              'An opening bracket raises the count. A closing one lowers it.',
              'Keep the highest count you have seen in another variable.'],
      craft: 'usesLoop',
      solution: 'def depth(text):\n    open_now = 0\n    deepest = 0\n    for c in text:\n        if c == "(":\n            open_now = open_now + 1\n            if open_now > deepest:\n                deepest = open_now\n        if c == ")":\n            open_now = open_now - 1\n    return deepest\n\nprint(depth("((a)(b))"))\nprint(depth("()"))' }
  ]
},

{
  id: 'memo',
  level: 'Problems',
  title: 'Never compute the same thing twice',
  idea: 'Recursion plus a dictionary of answers already worked out.',
  known: 'memoization, a form of dynamic programming',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'A problem whose answer is built from smaller versions of itself, such as steps up a staircase, ways to make change, or paths through a grid. The version that calls itself is easy to write and extremely slow.' },
    { h: 'Why it is slow',
      p: 'The plain recursion recomputes the same smaller answers over and over. Working out the tenth value recomputes the eighth dozens of times, and the cost doubles with every step.' },
    { h: 'The better way',
      p: 'Keep a dictionary from question to answer. Before computing, look it up. After computing, store it. Each distinct question is then answered exactly once and the cost collapses to the number of distinct questions.' },
    { h: 'This is dynamic programming',
      p: 'The intimidating name describes exactly this: remember sub-answers instead of recomputing them. Writing it as recursion with a dictionary is the easiest way in, and it is worth knowing that the table version is the same idea turned inside out.' }
  ],
  demo: { code: 'def steps(n, memo):\n    if n <= 1:\n        return 1\n    if n in memo:\n        return memo[n]\n    answer = steps(n - 1, memo) + steps(n - 2, memo)\n    memo[n] = answer\n    return answer\n\nseen = {}\nprint(steps(10, seen))',
          caption: 'Step in and watch memo fill. The second time a number is asked for, the work is already done.' },
  practice: { h: 'Write it slow, watch it crawl, then remember',
    p: 'Run the version without the dictionary first and look at the step count. Seeing the cost explode is what makes the fix feel necessary rather than clever.' },
  tasks: [
    { id: 'mm-1', prompt: 'A staircase can be climbed one or two steps at a time. Write ways(n, memo) returning how many distinct climbs reach step n, remembering answers as you go. Print the answer for 10, then for 20.',
      scaffold: { note: 'The answer for n is the answer for n-1 plus the answer for n-2', code: 'remembered = {}' },
      expect: ['89', '10946'],
      hints: ['One step and two steps are the only ways to arrive, so the total is the sum of those two smaller answers.',
              'Stop at n of 1 or less, where there is exactly one way.',
              'Check the dictionary before computing, and store the answer in it before handing it back.',
              'Make the dictionary in a variable first and pass that in, so both calls share what has already been worked out.'],
      craft: 'usesFunction',
      solution: 'def ways(n, memo):\n    if n <= 1:\n        return 1\n    if n in memo:\n        return memo[n]\n    answer = ways(n - 1, memo) + ways(n - 2, memo)\n    memo[n] = answer\n    return answer\n\nremembered = {}\nprint(ways(10, remembered))\nprint(ways(20, remembered))' }
  ]
},

{
  id: 'prefix',
  level: 'Problems',
  title: 'Keep running totals',
  idea: 'Running totals turn every range question into one subtraction.',
  known: 'prefix sums',
  unavailable: [],
  teach: [
    { h: 'How to spot it',
      p: 'Many questions about the total of part of a list, asked over and over on data that is not changing. For example: the takings for days 3 to 7, or the rainfall between two months.' },
    { h: 'The slow way',
      p: 'Adding up a stretch means walking it. Answer twenty questions that way and you walk the list twenty times, even though the numbers never moved.' },
    { h: 'The better way',
      p: 'Walk once, writing down the total so far after every value. The sum of a stretch is then the running total at the end minus the running total at the start.' },
    { h: 'Why the extra zero',
      p: 'The running totals start with a zero for "nothing yet". That is what makes a stretch beginning at the first value work without a special case.' }
  ],
  demo: { code: 'def prefix_sums(nums):\n    sums = [0]\n    total = 0\n    for x in nums:\n        total = total + x\n        sums.append(total)\n    return sums\n\nsums = prefix_sums([2, 4, 6, 8])\nprint(sums[3] - sums[1])\nprint(sums[4] - sums[0])',
          caption: 'One pass builds the totals. Each answer after that is a single subtraction.' },
  practice: { h: 'Precompute what you will be asked repeatedly',
              p: 'When the data is fixed and the questions keep coming, spend one pass building something that answers them instantly. The cost is paid once instead of per question.' },
  tasks: [
    { id: 'pf-1',
      prompt: 'Write range_sum(nums, lo, hi) that adds the values from lo up to but not including hi by walking that stretch. Print the answers for (1, 3) and (0, 4) on [2, 4, 6, 8].',
      scaffold: { note: 'Walk the stretch and add as you go' },
      expect: ['10', '20'],
      hints: [
        'A loop from lo up to hi, adding each value it lands on.',
        'range(lo, hi) stops before hi, which is exactly the stretch you want.'
      ],
      solution: 'def range_sum(nums, lo, hi):\n    total = 0\n    for i in range(lo, hi):\n        total = total + nums[i]\n    return total\n\nnums = [2, 4, 6, 8]\nprint(range_sum(nums, 1, 3))\nprint(range_sum(nums, 0, 4))',
      craft: 'usesFunction' },
    { id: 'pf-2',
      prompt: 'Now build the running totals first, then answer both questions with a subtraction instead of a loop. Same two answers.',
      scaffold: { note: 'Build the running totals, then subtract' },
      expect: ['10', '20'],
      hints: [
        'Start the totals with a zero, then append the total after each value.',
        'The sum from lo to hi is totals[hi] minus totals[lo].'
      ],
      solution: 'def prefix_sums(nums):\n    sums = [0]\n    total = 0\n    for x in nums:\n        total = total + x\n        sums.append(total)\n    return sums\n\nsums = prefix_sums([2, 4, 6, 8])\nprint(sums[3] - sums[1])\nprint(sums[4] - sums[0])',
      craft: 'usesFunction' }
  ]
},

{
  id: 'reverse',
  level: 'Problems',
  title: 'Swap from both ends',
  idea: 'Turning a list around needs no second list. Two markers walking inward do it.',
  known: 'in-place reversal',
  unavailable: [],
  teach: [
    { h: 'How to spot it',
      p: 'Reverse this, mirror that, check whether it reads the same backwards. Anything where the first item belongs where the last one is.' },
    { h: 'The slow way',
      p: 'Building a second list to hold the reversed copy doubles the memory for a job that only ever moves values around inside the list you already have.' },
    { h: 'The better way',
      p: 'Put one marker at each end. Swap what they point at, then step them towards each other. Stop when they meet. By then every value has been moved exactly once.' },
    { h: 'The swap needs somewhere to stand',
      p: 'You cannot overwrite the low slot before you have read it, or the value is gone. Hold it in a temporary name first. That extra variable is what makes the swap work.' }
  ],
  demo: { code: 'def flip(items):\n    lo = 0\n    hi = len(items) - 1\n    while lo < hi:\n        temp = items[lo]\n        items[lo] = items[hi]\n        items[hi] = temp\n        lo = lo + 1\n        hi = hi - 1\n    return items\n\nflipped = flip([1, 2, 3, 4, 5])\nprint(flipped[0])\nprint(flipped[4])',
          caption: 'Step to the swap and watch lo and hi close in on each other.' },
  practice: { h: 'Ask whether you need a copy at all',
              p: 'Before allocating a second collection, check whether the job is really about rearranging what you have. Working in place is usually shorter as well as cheaper.' },
  tasks: [
    { id: 'rv-1',
      prompt: 'Write flip(items) that reverses the list in place using two markers, then print the first and last values of flip([1, 2, 3, 4, 5]).',
      scaffold: { note: 'One marker at each end, walking inward' },
      expect: ['5', '1'],
      hints: [
        'Keep going while the low marker is still below the high one.',
        'Hold the low value in a temporary name before you overwrite it.'
      ],
      solution: 'def flip(items):\n    lo = 0\n    hi = len(items) - 1\n    while lo < hi:\n        temp = items[lo]\n        items[lo] = items[hi]\n        items[hi] = temp\n        lo = lo + 1\n        hi = hi - 1\n    return items\n\nflipped = flip([1, 2, 3, 4, 5])\nprint(flipped[0])\nprint(flipped[4])',
      craft: 'usesFunction' }
  ]
},

{
  id: 'fastslow',
  level: 'Problems',
  title: 'Send a fast and a slow marker',
  idea: 'A fast marker catches a slow one only if the path loops back on itself.',
  known: 'fast and slow pointers, or Floyd\'s cycle detection',
  unavailable: [],
  teach: [
    { h: 'How to spot it',
      p: 'Following a chain where each place points at the next one, and asking whether it ever comes back around. A redirect loop is one example, and a sequence that repeats forever is another.' },
    { h: 'The slow way',
      p: 'Writing down every place you have visited so you can check for a repeat works, but it grows with the length of the chain. On a long chain that is a lot of remembering.' },
    { h: 'The better way',
      p: 'Send two markers along the same chain, one stepping once per turn and one stepping twice. On a straight path the fast one runs off the end. On a loop it comes around and lands on the slow one.' },
    { h: 'Why it has to meet',
      p: 'Once both markers are inside the loop, the fast one gains exactly one place per turn on the slow one. A gap that shrinks by one every turn must reach zero. It cannot jump past it.' }
  ],
  demo: { code: 'def has_loop(next_of, start):\n    slow = start\n    fast = start\n    while next_of[fast] >= 0 and next_of[next_of[fast]] >= 0:\n        slow = next_of[slow]\n        fast = next_of[next_of[fast]]\n        if slow == fast:\n            return True\n    return False\n\nprint(has_loop([1, 2, 3, 1], 0))\nprint(has_loop([1, 2, 3, -1], 0))',
          caption: 'The first chain loops back to place 1. The second runs off the end at -1.' },
  practice: { h: 'Two markers can replace a notebook',
              p: 'When you catch yourself recording everything just to notice a repeat, ask whether a second marker moving at a different speed would notice it for you, for free.' },
  tasks: [
    { id: 'fs-1',
      prompt: 'Write has_loop(next_of, start) using a slow marker and a fast one. Each place holds the number of the next place, and -1 means the chain ends. Print the result for [1, 2, 3, 1] and for [1, 2, 3, -1], both starting at 0.',
      scaffold: { note: 'Both markers start at the same place' },
      expect: ['True', 'False'],
      hints: [
        'Step the slow marker once and the fast marker twice on every turn.',
        'Before stepping the fast marker twice, check that both of those steps exist.'
      ],
      solution: 'def has_loop(next_of, start):\n    slow = start\n    fast = start\n    while next_of[fast] >= 0 and next_of[next_of[fast]] >= 0:\n        slow = next_of[slow]\n        fast = next_of[next_of[fast]]\n        if slow == fast:\n            return True\n    return False\n\nprint(has_loop([1, 2, 3, 1], 0))\nprint(has_loop([1, 2, 3, -1], 0))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'topk',
  level: 'Problems',
  title: 'Keep only the best few',
  idea: 'To find the biggest handful you never have to put everything in order.',
  known: 'top-k selection',
  unavailable: [],
  teach: [
    { h: 'How to spot it',
      p: 'The three highest scores, the five slowest queries, the ten nearest stops. A small number of winners pulled out of a large pile.' },
    { h: 'The slow way',
      p: 'Sorting the whole pile arranges every loser against every other loser, which is work nobody asked for. You wanted five names, not a full ranking of ten thousand.' },
    { h: 'The better way',
      p: 'Carry a shortlist of the best k seen so far. Each new value only has to beat the weakest one on the shortlist. If it does, it takes that place.' },
    { h: 'Compare against the weakest',
      p: 'What matters is knowing which entry on the shortlist is currently worst, because that is the only one a newcomer has to beat. On a short list, finding it by looking is cheap.' }
  ],
  demo: { code: 'def kth_largest(nums, k):\n    best = []\n    for x in nums:\n        if len(best) < k:\n            best.append(x)\n        else:\n            low = 0\n            for i in range(0, len(best)):\n                if best[i] < best[low]:\n                    low = i\n            if x > best[low]:\n                best[low] = x\n    smallest = best[0]\n    for v in best:\n        if v < smallest:\n            smallest = v\n    return smallest\n\nprint(kth_largest([5, 1, 9, 3, 7], 2))',
          caption: 'Step through and watch the shortlist swap out its weakest entry.' },
  practice: { h: 'Do not sort more than the question needs',
              p: 'Sorting is the reflex answer and often far more than was asked. When only a few winners matter, carrying a shortlist does less work and says what you meant more plainly.' },
  tasks: [
    { id: 'tk-1',
      prompt: 'Write kth_largest(nums, k) that keeps a shortlist of the k biggest values seen so far and returns the smallest one on it. Print the result for [5, 1, 9, 3, 7] with k of 2.',
      scaffold: { note: 'Carry a shortlist of the best k so far' },
      expect: ['7'],
      hints: [
        'Until the shortlist holds k values, every new value simply joins it.',
        'After that, a new value only matters if it beats the weakest entry, so find that entry first.'
      ],
      solution: 'def kth_largest(nums, k):\n    best = []\n    for x in nums:\n        if len(best) < k:\n            best.append(x)\n        else:\n            low = 0\n            for i in range(0, len(best)):\n                if best[i] < best[low]:\n                    low = i\n            if x > best[low]:\n                best[low] = x\n    smallest = best[0]\n    for v in best:\n        if v < smallest:\n            smallest = v\n    return smallest\n\nprint(kth_largest([5, 1, 9, 3, 7], 2))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'unionfind',
  level: 'Problems',
  title: 'Track who is connected',
  idea: 'Each group keeps one representative, so belonging together is one comparison.',
  known: 'union-find, also called a disjoint set',
  unavailable: [],
  teach: [
    { h: 'How to spot it',
      p: 'Friends of friends, machines on the same network, islands joined by bridges. Things merge into groups, and the question is whether two of them ended up in the same one.' },
    { h: 'The slow way',
      p: 'Re-walking the whole web of connections every time someone asks about a pair does the same exploration again and again, and it gets slower as more links arrive.' },
    { h: 'The better way',
      p: 'Give every group a representative. Each thing points at something in its group. Follow those pointers up and you reach the representative. Two things are together exactly when they reach the same one.' },
    { h: 'Merging is one pointer',
      p: 'Joining two groups does not touch their members. Point one representative at the other and every member of the first group now walks up into the second.' }
  ],
  demo: { code: 'def find(parent, x):\n    while parent[x] != x:\n        x = parent[x]\n    return x\n\ndef unite(parent, a, b):\n    ra = find(parent, a)\n    rb = find(parent, b)\n    if ra != rb:\n        parent[ra] = rb\n    return parent\n\nparent = [0, 1, 2, 3]\nparent = unite(parent, 0, 1)\nparent = unite(parent, 2, 3)\nprint(find(parent, 0) == find(parent, 1))\nprint(find(parent, 0) == find(parent, 3))',
          caption: 'Everyone starts as their own representative. Each join redirects exactly one of them.' },
  practice: { h: 'Let the structure answer the question',
              p: 'When the same question keeps being asked of changing data, look for an arrangement where the answer falls out of the shape rather than being recomputed each time.' },
  tasks: [
    { id: 'uf-1',
      prompt: 'Write find(parent, x), which follows the pointers up to a representative, and unite(parent, a, b), which merges two groups. Start from [0, 1, 2, 3], join 0 with 1 and 2 with 3, then print whether 0 and 1 are together, and whether 0 and 3 are.',
      scaffold: { note: 'Everyone starts as their own representative' },
      expect: ['True', 'False'],
      hints: [
        'Keep stepping up while a thing is not its own representative.',
        'To merge, find both representatives first, then point one at the other.'
      ],
      solution: 'def find(parent, x):\n    while parent[x] != x:\n        x = parent[x]\n    return x\n\ndef unite(parent, a, b):\n    ra = find(parent, a)\n    rb = find(parent, b)\n    if ra != rb:\n        parent[ra] = rb\n    return parent\n\nparent = [0, 1, 2, 3]\nparent = unite(parent, 0, 1)\nparent = unite(parent, 2, 3)\nprint(find(parent, 0) == find(parent, 1))\nprint(find(parent, 0) == find(parent, 3))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'backtracking',
  level: 'Problems',
  title: 'Try each choice both ways',
  idea: 'Every choice gives two cases to check: one where you take it and one where you do not.',
  known: 'backtracking',
  unavailable: [],
  teach: [
    { h: 'How to spot it',
      p: 'Choose some of these to hit a total, fit these pieces into that space, find an arrangement that satisfies the rules. You are picking a combination, not scanning one.' },
    { h: 'Why a loop is not enough',
      p: 'A loop walks a list once. Here each item asks a question (in or out?), and the answers affect each other, so what you are exploring is a tree of possibilities rather than a line.' },
    { h: 'The better way',
      p: 'Handle one item, then hand the rest of the problem to the same function. Ask it twice: once having taken the item, once having skipped it. Add up what both answers report.' },
    { h: 'Know when to stop',
      p: 'Every branch needs an ending. Hitting the target exactly is a success, running past it or off the end of the list is a dead end. Without both, the function never comes back.' }
  ],
  demo: { code: 'def count_ways(nums, i, target):\n    if target == 0:\n        return 1\n    if target < 0 or i >= len(nums):\n        return 0\n    return count_ways(nums, i + 1, target - nums[i]) + count_ways(nums, i + 1, target)\n\nprint(count_ways([2, 3, 5], 0, 5))',
          caption: 'Two of the branches reach zero exactly: 2 with 3, and 5 on its own.' },
  practice: { h: 'Let the function call itself on a smaller problem',
              p: 'When a choice changes what the rest of the problem looks like, describing one choice and delegating the remainder is shorter and clearer than steering the whole search by hand.' },
  tasks: [
    { id: 'bt-1',
      prompt: 'Write count_ways(nums, i, target) that counts how many groups of values chosen from position i onwards add up to exactly target. Print the count for [2, 3, 5] and a target of 5.',
      scaffold: { note: 'Take the value or skip it, then ask again' },
      expect: ['2'],
      hints: [
        'Hitting zero exactly counts as one way. Going below zero or past the end counts as none.',
        'The answer is the count when you take this value plus the count when you skip it.'
      ],
      solution: 'def count_ways(nums, i, target):\n    if target == 0:\n        return 1\n    if target < 0 or i >= len(nums):\n        return 0\n    return count_ways(nums, i + 1, target - nums[i]) + count_ways(nums, i + 1, target)\n\nprint(count_ways([2, 3, 5], 0, 5))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'matrix',
  level: 'Problems',
  title: 'Walk a grid row by row',
  idea: 'A grid is a list of rows, so two loops reach every square.',
  known: 'a two-dimensional array, or matrix',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'Seating plans, spreadsheets, game boards, images. Anything addressed by a row and a column rather than a single position.' },
    { h: 'How a grid is stored',
      p: 'A list whose items are themselves lists. grid[1] is the whole second row, and grid[1][2] is the third square of it. The row comes first, always.' },
    { h: 'The better way',
      p: 'One loop over the rows, another inside it over the squares of that row. The inner loop runs from the top for every row, which is what covers the whole grid.' },
    { h: 'Mind the edges',
      p: 'Grids are where off-by-one errors live, because there are two ways to fall off. When you compute a neighbour, check both the row and the column are still inside before looking.' }
  ],
  demo: { code: 'def grid_total(grid):\n    total = 0\n    for row in grid:\n        for v in row:\n            total = total + v\n    return total\n\ngrid = [[1, 2, 3], [4, 5, 6]]\nprint(grid_total(grid))\nprint(grid[1][2])',
          caption: 'Step through and watch the inner loop restart for the second row.' },
  practice: { h: 'Name the row and the column',
              p: 'Calling them r and c, in that order, everywhere you touch a grid saves more debugging than any other habit here. Mixed-up indices look correct and quietly read the wrong square.' },
  tasks: [
    { id: 'mx-1',
      prompt: 'Write grid_total(grid) that adds up every number in a grid. Print the total for [[1, 2, 3], [4, 5, 6]], then print the square at row 1, column 2.',
      scaffold: { note: 'A loop over rows, a loop inside it over squares' },
      expect: ['21', '6'],
      hints: [
        'The outer loop hands you a whole row at a time, and a row is a list.',
        'The inner loop walks the values of that one row.'
      ],
      solution: 'def grid_total(grid):\n    total = 0\n    for row in grid:\n        for v in row:\n            total = total + v\n    return total\n\ngrid = [[1, 2, 3], [4, 5, 6]]\nprint(grid_total(grid))\nprint(grid[1][2])',
      craft: 'usesFunction' }
  ]
},

{
  id: 'intervals',
  level: 'Problems',
  title: 'Merge overlapping stretches',
  idea: 'Once the stretches are in order, one pass decides what overlaps.',
  known: 'merging intervals',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'Meetings that clash, opening hours that join up, chapters covering the same pages. Each thing has a start and an end, and the question is about overlap.' },
    { h: 'The slow way',
      p: 'Comparing every stretch with every other one checks pairs that could never touch, and it grows badly. A diary with a hundred entries does not need five thousand comparisons.' },
    { h: 'The better way',
      p: 'Work through them in order of start. Carry the end of the stretch you are currently building. If the next one starts before that end, it overlaps and the end may need extending. If not, a new stretch begins.' },
    { h: 'Only the end matters',
      p: 'Once they are ordered by start, the only thing you have to remember is how far the current stretch reaches. That single number is what makes the whole job one pass.' }
  ],
  demo: { code: 'def merge_count(spans):\n    count = 1\n    end = spans[0][1]\n    for i in range(1, len(spans)):\n        if spans[i][0] <= end:\n            if spans[i][1] > end:\n                end = spans[i][1]\n        else:\n            count = count + 1\n            end = spans[i][1]\n    return count\n\nprint(merge_count([[1, 3], [2, 6], [8, 10]]))',
          caption: 'The first two join into one stretch reaching 6. The third starts after it, so it stands alone.' },
  practice: { h: 'Sort first, then the pass is easy',
              p: 'A lot of problems about ranges look tangled until the ranges are in order, and then become a single walk. When overlap is the question, ordering by start is almost always the first move.' },
  tasks: [
    { id: 'iv-1',
      prompt: 'The stretches arrive already ordered by start. Write merge_count(spans) that reports how many stretches remain once overlapping ones are merged. Print the count for [[1, 3], [2, 6], [8, 10]].',
      scaffold: { note: 'Carry the end of the stretch you are building' },
      expect: ['2'],
      hints: [
        'A stretch that starts at or before the end you are carrying overlaps it.',
        'When it overlaps, the end only moves if the new stretch reaches further.'
      ],
      solution: 'def merge_count(spans):\n    count = 1\n    end = spans[0][1]\n    for i in range(1, len(spans)):\n        if spans[i][0] <= end:\n            if spans[i][1] > end:\n                end = spans[i][1]\n        else:\n            count = count + 1\n            end = spans[i][1]\n    return count\n\nprint(merge_count([[1, 3], [2, 6], [8, 10]]))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'bfs',
  level: 'Problems',
  title: 'Search outward one step at a time',
  idea: 'Visit everything one step away, then everything two steps away, and the first arrival is the shortest route.',
  known: 'breadth-first search, or BFS',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'Fewest moves, shortest path, how far does the flood reach. This is about the fewest steps, where every step counts the same. It is not about the cheapest route when steps cost different amounts.' },
    { h: 'Why order matters',
      p: 'If you follow one route as far as it goes before trying the others, you may arrive by a long way round and never learn there was a shorter one. Going wide instead of deep means the first arrival is the best one.' },
    { h: 'The better way',
      p: 'Keep a queue of places to visit. Take the front one, look at its neighbours, and add any you have never reached, recording the distance as one more than the place you came from.' },
    { h: 'The queue is just a list and a marker',
      p: 'You do not need to remove anything from the front. Keep a head marker and step it forward. Everything before it has been handled, everything after is still waiting.' }
  ],
  demo: { code: 'def steps_to_corner(grid):\n    rows = len(grid)\n    cols = len(grid[0])\n    dist = []\n    for r in range(0, rows):\n        row = []\n        for c in range(0, cols):\n            row.append(-1)\n        dist.append(row)\n    qr = [0]\n    qc = [0]\n    dist[0][0] = 0\n    dr = [1, -1, 0, 0]\n    dc = [0, 0, 1, -1]\n    head = 0\n    while head < len(qr):\n        r = qr[head]\n        c = qc[head]\n        head = head + 1\n        for i in range(0, 4):\n            nr = r + dr[i]\n            nc = c + dc[i]\n            if nr >= 0 and nr < rows and nc >= 0 and nc < cols:\n                if grid[nr][nc] == 0 and dist[nr][nc] < 0:\n                    dist[nr][nc] = dist[r][c] + 1\n                    qr.append(nr)\n                    qc.append(nc)\n    return dist[rows - 1][cols - 1]\n\nprint(steps_to_corner([[0, 0, 0], [1, 1, 0], [0, 0, 0]]))',
          caption: 'A wall blocks the straight way down, so the route goes along the top and down the right side, which takes four steps.' },
  practice: { h: 'Record the distance when you queue it, not when you visit it',
              p: 'Writing down the distance at the moment you add a place is also what marks it as seen. One action does both jobs, and a place can never be queued twice.' },
  tasks: [
    { id: 'bf-1',
      prompt: 'Write steps_to_corner(grid) that reports the fewest steps from the top-left to the bottom-right, where 0 is open and 1 is a wall, moving up, down, left or right. Print the answer for [[0, 0, 0], [1, 1, 0], [0, 0, 0]].',
      scaffold: { note: 'A queue of places, and a distance for each square' },
      expect: ['4'],
      hints: [
        'Start with the top-left in the queue at distance 0, and every other square unvisited.',
        'Keep a head marker instead of removing from the front of the queue.'
      ],
      solution: 'def steps_to_corner(grid):\n    rows = len(grid)\n    cols = len(grid[0])\n    dist = []\n    for r in range(0, rows):\n        row = []\n        for c in range(0, cols):\n            row.append(-1)\n        dist.append(row)\n    qr = [0]\n    qc = [0]\n    dist[0][0] = 0\n    dr = [1, -1, 0, 0]\n    dc = [0, 0, 1, -1]\n    head = 0\n    while head < len(qr):\n        r = qr[head]\n        c = qc[head]\n        head = head + 1\n        for i in range(0, 4):\n            nr = r + dr[i]\n            nc = c + dc[i]\n            if nr >= 0 and nr < rows and nc >= 0 and nc < cols:\n                if grid[nr][nc] == 0 and dist[nr][nc] < 0:\n                    dist[nr][nc] = dist[r][c] + 1\n                    qr.append(nr)\n                    qc.append(nc)\n    return dist[rows - 1][cols - 1]\n\nprint(steps_to_corner([[0, 0, 0], [1, 1, 0], [0, 0, 0]]))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'toposort',
  level: 'Problems',
  title: 'Do whatever is ready first',
  idea: 'Repeatedly take anything whose prerequisites are already done.',
  known: 'topological sort',
  unavailable: ['go'],
  teach: [
    { h: 'How to spot it',
      p: 'Build steps, course prerequisites, getting dressed. Some things must happen before others, and you need an order that never breaks a rule.' },
    { h: 'Why sorting does not help',
      p: 'There is no single value to compare. Socks are not smaller than boots. The only thing you know is which pairs must come in a given order, and that says nothing about the pairs it does not mention.' },
    { h: 'The better way',
      p: 'Look for anything with nothing outstanding in front of it, take it, and mark it done. That may free up others. Repeat until everything has been taken.' },
    { h: 'When nothing is free',
      p: 'If a turn goes by with nothing ready and things still left over, the rules contradict each other: something is waiting on itself, round a loop. That is not a bug in your code, it is an answer: no order exists.' }
  ],
  demo: { code: 'def order_count(needs, names):\n    done = {}\n    for name in names:\n        done[name] = False\n    taken = 0\n    while taken < len(names):\n        picked = ""\n        for name in names:\n            if done[name] == False:\n                blocked = False\n                for before in needs[name]:\n                    if done[before] == False:\n                        blocked = True\n                if blocked == False:\n                    picked = name\n        if picked == "":\n            return -1\n        done[picked] = True\n        taken = taken + 1\n    return taken\n\nneeds = {"boots": [], "socks": [], "laces": ["boots"]}\nnames = ["boots", "socks", "laces"]\nprint(order_count(needs, names))',
          caption: 'Boots and socks are free from the start. Laces only becomes free once boots is done.' },
  practice: { h: 'A stuck state can be the answer',
              p: 'When a loop can run out of progress with work still left, that is usually worth reporting rather than looping forever. Deciding what to return in that case is part of the design, not an afterthought.' },
  tasks: [
    { id: 'ts-1',
      prompt: 'needs maps each thing to the list of things that must come before it. Write order_count(needs, names) that takes things whose prerequisites are all done until everything is taken, returning how many it took, or -1 if the rules contradict each other. Print the result for boots, socks and laces, where laces needs boots.',
      scaffold: { note: 'Take anything with nothing outstanding in front of it' },
      expect: ['3'],
      hints: [
        'Keep a record of what is done, starting with everything undone.',
        'If a whole pass finds nothing ready and things remain, the rules loop, so report -1.'
      ],
      solution: 'def order_count(needs, names):\n    done = {}\n    for name in names:\n        done[name] = False\n    taken = 0\n    while taken < len(names):\n        picked = ""\n        for name in names:\n            if done[name] == False:\n                blocked = False\n                for before in needs[name]:\n                    if done[before] == False:\n                        blocked = True\n                if blocked == False:\n                    picked = name\n        if picked == "":\n            return -1\n        done[picked] = True\n        taken = taken + 1\n    return taken\n\nneeds = {"boots": [], "socks": [], "laces": ["boots"]}\nnames = ["boots", "socks", "laces"]\nprint(order_count(needs, names))',
      craft: 'usesFunction' }
  ]
},

{
  id: 'check-problems',
  level: 'Problems',
  title: 'Checkpoint: spot it and solve it',
  idea: 'No pattern is named. Work out which one it is, then hit the speed.',
  unavailable: ['go'],
  teach: [
    { h: 'Nobody tells you the technique',
      p: 'This is the real shape of the thing: a statement, an input size, and no hint about which tool applies. Read it, name the pattern to yourself, then write it.' },
    { h: 'The size is the instruction',
      p: 'Assume the list can be very long. That rules out comparing every value against every other value, which is the only warning you get.' },
    { h: 'Say the pattern out loud first',
      p: 'If you cannot name what you are about to write before you write it, you are guessing, and the guess usually costs more time than the naming would have.' }
  ],
  demo: { code: 'def first_repeat(nums):\n    seen = {}\n    for x in nums:\n        if x in seen:\n            return x\n        seen[x] = 1\n    return -1\n\nprint(first_repeat([4, 1, 4, 2]))',
          caption: 'One pass, remembering what has gone by.' },
  practice: { h: 'Correct first, then fast',
    p: 'Write the version you are sure of, check the answers, then improve it. A fast wrong answer is worth nothing and takes longer to debug.' },
  tasks: [
    { id: 'chk-problems', prompt: 'Write has_repeat(nums) which answers whether any value appears more than once. Print the result for [1, 2, 3, 2], then for [1, 2, 3]. The list may be very long, so it must not compare every pair.',
      scaffold: { note: 'One pass. Decide what you need to remember as you go.' },
      expect: ['True', 'False'],
      hints: ['The question is about whether something has been seen before, which tells you what to keep.',
              'Make an empty dictionary before the loop and record each value as you pass it.',
              'At each value, check the dictionary before recording it, and return as soon as you find one already there.'],
      speed: { setup: 'nums = []\nfor i in range(0, N):\n    nums.append(i)\nprint(has_repeat(nums))', sizes: [60, 120], target: 'linear' },
      solution: 'def has_repeat(nums):\n    seen = {}\n    for x in nums:\n        if x in seen:\n            return True\n        seen[x] = 1\n    return False\n\nprint(has_repeat([1, 2, 3, 2]))\nprint(has_repeat([1, 2, 3]))' }
  ]
},

{
  id: 'project',
  level: 'Project',
  title: 'Build something you keep',
  idea: 'A text adventure, built in four stages, that you can actually play.',
  unavailable: ['go'],   // not input any more: Go has no dictionary literal in our subset (decision 2)
  teach: [
    { h: 'This one is yours',
      p: 'Four stages, each checked, and at the end a game you can play in the panel underneath and carry off in the file. Change the rooms, the items and the wording to whatever you like. The checks only care about the shape.' },
    { h: 'How input works here',
      p: { python: 'input() hands back whatever the player typed. The program cannot pause, so every time you type, this app runs the whole thing again from the start with all your answers so far. That is invisible while you play, and it means your game must be predictable: the same answers always give the same story.',
           javascript: 'prompt() hands back whatever the player typed. The program cannot pause, so every time you type, this app runs the whole thing again from the start with all your answers so far. That is invisible while you play, and it means your game must be predictable: the same answers always give the same story.',
           ruby: 'gets hands back whatever the player typed. The program cannot pause, so every time you type, this app runs the whole thing again from the start with all your answers so far. That is invisible while you play, and it means your game must be predictable: the same answers always give the same story.' } },
    { h: 'Everything you have learned, at once',
      p: 'A dictionary of rooms, a list for the pack, a loop that keeps asking, conditions that decide what happens, functions that keep it readable, and a failure you survive when someone types nonsense. That is the whole course in one program.' },
    { h: 'Build it in stages',
      p: 'Get one room printing before you write two. Get the loop running before you add items. Each stage below is checked on its own, so you always have something that works to go back to.' }
  ],
  demo: { code: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nhere = "hall"\nprint(rooms[here])\nprint("Exits: library")',
          caption: 'Stage one is only this: rooms in a dictionary, and printing where you are.' },
  practice: { h: 'Play it after every change',
    p: 'A game is the one kind of program where reading the code tells you almost nothing about whether it is any good. Type into it. You will find the dead ends immediately.' },
  tasks: [
    { id: 'proj-1', prompt: 'Stage one. Put two rooms in a dictionary keyed by name, start in the hall, and print the description of where you are followed by a line listing the exit.',
      scaffold: { note: 'A dictionary of descriptions, and a variable holding where you are' },
      expect: ['A cold stone hall.', 'Exits: library'],
      hints: ['The dictionary maps a room name to its description.',
              'Keep the current room name in its own variable so it can change later.',
              'Look the description up by that variable rather than writing it out again.'],
      solution: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nhere = "hall"\nprint(rooms[here])\nprint("Exits: library")' },

    { id: 'proj-2', prompt: 'Stage two. Ask the player where to go and move them. Print the new room\u2019s description. Use input() so the game can be played.',
      scaffold: { note: 'Read a line, then change where you are',
                  code: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nhere = "hall"\nprint(rooms[here])' },
      expect: ['A cold stone hall.', 'Where to?', 'Dust and quiet shelves.'],
      hints: ['Print the question first so the player knows what is wanted.',
              'input() hands back what they typed. Store it.',
              'If what they typed is a room name, set the current room to it and print that room\u2019s description.'],
      inputs: ['library'],
      solution: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nhere = "hall"\nprint(rooms[here])\nprint("Where to?")\nanswer = input()\nif answer in rooms:\n    here = answer\n    print(rooms[here])' },

    { id: 'proj-3', prompt: 'Stage three. Keep asking until the player types quit, and survive anything unexpected: if they name a room, move there and describe it. If they type quit, say Goodbye. Anything else gets You cannot go that way.',
      scaffold: { note: 'A loop that keeps asking, and three cases inside it',
                  code: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nhere = "hall"\nprint(rooms[here])' },
      expect: ['A cold stone hall.', 'Dust and quiet shelves.', 'You cannot go that way.', 'Goodbye'],
      hints: ['A while loop with a flag, or a loop you break out of when they type quit.',
              'Ask for a line at the top of each pass.',
              'Three cases: quit, a name that is in the rooms dictionary, and everything else.'],
      inputs: ['library', 'cellar', 'quit'],
      craft: 'usesLoop',
      solution: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nhere = "hall"\nprint(rooms[here])\nplaying = True\nwhile playing:\n    answer = input()\n    if answer == "quit":\n        print("Goodbye")\n        playing = False\n    elif answer in rooms:\n        here = answer\n        print(rooms[here])\n    else:\n        print("You cannot go that way.")' },

    { id: 'proj-4', prompt: 'Stage four. Give the library a lamp. Typing take picks up whatever is in the room and adds it to your pack. Typing pack lists what you are carrying. Keep quit working.',
      scaffold: { note: 'A dictionary of what each room holds, and a list for the pack',
                  code: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nitems = {"library": "a lamp"}\nhere = "hall"\npack = []\nprint(rooms[here])' },
      expect: ['A cold stone hall.', 'Dust and quiet shelves.', 'Taken: a lamp', 'Carrying: a lamp', 'Goodbye'],
      hints: ['A second dictionary maps a room name to the item lying there.',
              'take should check whether the current room has anything before adding it.',
              'pack can print the one thing you are carrying. A loop over the list handles more.',
              'Remove the item from the room once taken, or it can be picked up twice.'],
      inputs: ['library', 'take', 'pack', 'quit'],
      craft: 'usesLoop',
      solution: 'rooms = {"hall": "A cold stone hall.", "library": "Dust and quiet shelves."}\nitems = {"library": "a lamp"}\nhere = "hall"\npack = []\nprint(rooms[here])\nplaying = True\nwhile playing:\n    answer = input()\n    if answer == "quit":\n        print("Goodbye")\n        playing = False\n    elif answer == "take":\n        if here in items:\n            pack.append(items[here])\n            print("Taken: " + items[here])\n    elif answer == "pack":\n        for thing in pack:\n            print("Carrying: " + thing)\n    elif answer in rooms:\n        here = answer\n        print(rooms[here])\n    else:\n        print("You cannot go that way.")' }
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

/* ============================================================
   RECOGNITION BANK
   Statements only. The skill being drilled is naming the technique
   before writing anything, which is the step coursework skips.
   ============================================================ */
const PATTERN_NAMES = {
  complement: 'Remember what you have seen',
  window: 'Slide the window',
  twopointers: 'Close in from both ends',
  counting: 'Count in one pass',
  prefix: 'Keep running totals',
  reverse: 'Swap from both ends',
  fastslow: 'Send a fast and a slow marker',
  topk: 'Keep only the best few',
  unionfind: 'Track who is connected',
  backtracking: 'Try each choice both ways',
  matrix: 'Walk a grid row by row',
  intervals: 'Merge overlapping stretches',
  bfs: 'Search outward one step at a time',
  toposort: 'Do whatever is ready first'
};

const RECOGNISE = [
  { pattern: 'toposort',
    text: 'A recipe has steps, some of which cannot start until others have finished, and you want a running order that never breaks a rule.',
    why: 'Ordering constrained by which things must come first. Take whatever has nothing outstanding in front of it, mark it done, repeat.' },
  { pattern: 'bfs',
    text: 'A warehouse robot must reach a shelf across a floor plan of open squares and blocked ones, in as few moves as possible.',
    why: 'Fewest moves on a map where every move costs the same. Spreading out a step at a time means the first arrival is the shortest route.' },
  { pattern: 'intervals',
    text: 'A room booking system has a day of start and end times and needs to report the blocks of time the room is busy.',
    why: 'Things with a start and an end, asked about overlap. In order of start, one pass carrying the current end merges them.' },
  { pattern: 'matrix',
    text: 'A seating plan is stored row by row and you need the total number of people sitting in it.',
    why: 'Addressed by row and column. A loop over the rows with a loop inside it reaches every seat once.' },
  { pattern: 'topk',
    text: 'Out of two hundred thousand delivery times, report the five slowest of the day.',
    why: 'A handful of winners from a large pile. A shortlist of the worst five seen so far does it in one pass, without ranking everything else.' },
  { pattern: 'unionfind',
    text: 'People keep being introduced in pairs, and at any point someone asks whether two of them know each other through the chain of introductions.',
    why: 'Groups that merge over time, with repeated questions about whether two things ended up together. Each group keeps a representative and the answer is one comparison.' },
  { pattern: 'backtracking',
    text: 'Given a set of weights and a target, decide how many different selections of them balance the scale exactly.',
    why: 'Each weight is in or out, and the choices interact. Handle one, hand the rest to the same function twice, once taken and once skipped.' },
  { pattern: 'prefix',
    text: 'A shop has a year of daily takings that never change, and the manager keeps asking for the total between two dates.',
    why: 'Fixed data, the same question over and over about stretches of it. One pass of running totals answers each one with a subtraction.' },
  { pattern: 'reverse',
    text: 'Turn a list of song titles around so the last one plays first, without building a second playlist.',
    why: 'Rearranging in place. A marker at each end, swapping and stepping inward, moves every title exactly once.' },
  { pattern: 'fastslow',
    text: 'Each page on a site redirects to one other page. Decide whether following the redirects from the home page goes round forever.',
    why: 'A chain where each place points at the next, asking whether it loops. Two markers at different speeds meet inside a loop and never meet on a straight path.' },
  { pattern: 'complement',
    text: 'You have a list of ticket prices and a budget. Decide whether any two tickets together cost exactly the budget.',
    why: 'A pair adding to a target. For each price, the partner you need is budget minus that price, and a dictionary of prices already seen answers that in one pass.' },
  { pattern: 'complement',
    text: 'Given a list of card values, decide whether any two of them add up to twenty-one.',
    why: 'Same shape wearing a different costume: a pair summing to a fixed target. Work out the partner and ask whether you have already passed it.' },
  { pattern: 'complement',
    text: 'Given hourly temperature readings and a target difference, decide whether two readings differ by exactly that amount.',
    why: 'Still a pair, but the partner is reading minus target rather than target minus reading. The move is unchanged.' },

  { pattern: 'window',
    text: 'Given daily sales figures and a number of days k, find the highest total that any k consecutive days produced.',
    why: 'The word consecutive is the tell. Neighbouring stretches differ by one value entering and one leaving, so you slide rather than recompute.' },
  { pattern: 'window',
    text: 'Given a string of letters, find the length of the longest stretch that contains no repeated letter.',
    why: 'A stretch of adjacent items with a condition that stays true. The window grows at the right and shrinks from the left when the condition breaks.' },
  { pattern: 'window',
    text: 'Given a list of daily step counts, find the shortest run of consecutive days that together reach ten thousand steps.',
    why: 'Shortest run of consecutive items reaching a total. The window widens until it qualifies, then narrows from the left while it still does.' },

  { pattern: 'twopointers',
    text: 'The list of prices is already sorted from cheapest to most expensive. Decide whether two of them add to exactly the budget.',
    why: 'Sorted input is never mentioned by accident. Start at both ends: too small means raise the low one, too large means lower the high one.' },
  { pattern: 'twopointers',
    text: 'Given a sorted list of readings, remove the repeats in place and report how many distinct values remain.',
    why: 'Sorted, and you are rewriting the list itself. One pointer reads ahead while the other marks where the next kept value belongs.' },
  { pattern: 'twopointers',
    text: 'Given a sorted list of parcel weights and a van limit, pair the heaviest parcel with the lightest that still fits, using the fewest vans.',
    why: 'Sorted, and the decision is always about the current extremes. Take from both ends and move inward.' },

  { pattern: 'counting',
    text: 'Given a list of votes, report which candidate appears most often.',
    why: 'How often things occur. One walk building a dictionary from candidate to tally answers it, with the leader tracked as you go.' },
  { pattern: 'counting',
    text: 'Given two words, decide whether one is a rearrangement of the letters of the other.',
    why: 'This is about how many of each letter each word holds. Count both and compare the tallies.' },
  { pattern: 'counting',
    text: 'Given a list of sensor readings, report the first value that appears exactly once.',
    why: 'Occurrence counts again. Tally everything in one pass, then walk the original order looking for the first value whose tally is one.' }
];
/* CONTENT-END */
