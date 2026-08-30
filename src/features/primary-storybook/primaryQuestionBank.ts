export type PrimaryYear = 1 | 2 | 3 | 4 | 5 | 6;
export type PrimarySubject = 'maths' | 'english';
export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5;

export type TeachingExplanation = {
  strategy: string;
  steps: string[];
};

export type FollowUpQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type PrimaryQuestion = {
  id: string;
  year: PrimaryYear;
  subject: PrimarySubject;
  topic: string;
  subtopic: string;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: TeachingExplanation;
  misconceptionFeedback: Record<string, string>;
  followUp: FollowUpQuestion;
  type: 'contextual-maths' | 'language-in-context';
};

type QuestionSeed = {
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
};
type CompactSeed = [string, string[], string, string, string];

const difficultyPattern: QuestionDifficulty[] = [1, 2, 2, 3, 4, 5];
const mathsTopics = ['number', 'operations', 'fractions', 'measurement', 'geometry', 'problem solving'];
const englishTopics = ['phonics', 'grammar', 'vocabulary', 'comprehension', 'inference', 'author craft'];
const variantNames = [
  ['Sam', 'Mia', 'Leo', 'Ava'],
  ['Kai', 'Zoe', 'Noah', 'Ella'],
  ['Luca', 'Priya', 'Nina', 'Ben'],
] as const;

const varyContext = (text: string, variant: number) => {
  const names = variantNames[variant];
  return text
    .split('Sam').join(names[0])
    .split('Mia').join(names[1])
    .split('Leo').join(names[2])
    .split('Ava').join(names[3]);
};

const makeQuestions = (year: PrimaryYear, subject: PrimarySubject, seeds: QuestionSeed[]): PrimaryQuestion[] =>
  seeds.flatMap((seed, seedIndex) => [0, 1, 2].map((variant) => {
    const topicList = subject === 'maths' ? mathsTopics : englishTopics;
    const topic = topicList[seedIndex % topicList.length];
    const question = varyContext(seed.question, variant);
    const options = seed.options.map((option) => varyContext(option, variant));
    const correctAnswer = varyContext(seed.correctAnswer, variant);
    const explanation = varyContext(seed.explanation, variant);
    const hint = varyContext(seed.hint, variant);
    const incorrectOptions = options.filter((option) => option !== correctAnswer);

    return {
      id: `y${year}-${subject}-${topic.split(' ').join('-')}-${String(seedIndex * 3 + variant + 1).padStart(3, '0')}`,
      year,
      subject,
      topic,
      subtopic: subject === 'maths' ? `year-${year}-${topic}` : `year-${year}-${topic}`,
      difficulty: difficultyPattern[seedIndex % difficultyPattern.length],
      type: subject === 'maths' ? 'contextual-maths' : 'language-in-context',
      question,
      options,
      correctAnswer,
      hint,
      explanation: {
        strategy: topic,
        steps: subject === 'maths'
          ? [`First, identify what the question is asking.`, hint, explanation]
          : [`Look closely at the important words or clues.`, hint, explanation],
      },
      misconceptionFeedback: Object.fromEntries(incorrectOptions.map((option, optionIndex) => [
        option,
        optionIndex === 0
          ? `That answer uses part of the information. ${hint}`
          : `Good attempt. Let’s check the clue that matters most.`,
      ])),
      followUp: {
        question: subject === 'maths'
          ? `Your turn: use the same method once more. ${question}`
          : `Your turn: use the same reading skill once more. ${question}`,
        options: [...options],
        correctAnswer,
        explanation,
      },
    } satisfies PrimaryQuestion;
  }));

const mathsSeeds: Record<PrimaryYear, CompactSeed[]> = {
  1: [
    ['Lily has 7 strawberries. Her dad gives her 4 more. How many strawberries does Lily have now?', ['9','10','11','12'], '11', 'Start at 7 and count on 4.', 'Seven plus four is eleven.'],
    ['Noah sees 12 ducks. 5 swim away. How many ducks are left?', ['5','6','7','8'], '7', 'Count back 5 from 12.', 'Twelve take away five leaves seven.'],
    ['A box has 9 red crayons and 3 blue crayons. How many crayons are there altogether?', ['10','11','12','13'], '12', 'Join the two groups.', 'Nine plus three is twelve.'],
    ['Mia builds a pattern: circle, square, circle, square. What comes next?', ['Circle','Triangle','Star','Rectangle'], 'Circle', 'Look at what repeats.', 'The pattern alternates circle and square.'],
    ['Sam has 14 blocks. Ava has 10 blocks. Who has more blocks?', ['Sam','Ava','They have the same','We cannot tell'], 'Sam', 'Compare 14 and 10.', 'Fourteen is greater than ten.'],
    ['A ribbon is longer than a pencil. Which object is shorter?', ['Ribbon','Pencil','Both','Neither'], 'Pencil', 'The question tells you the ribbon is longer.', 'If the ribbon is longer, the pencil is shorter.'],
    ['There are 6 birds on a fence and 6 more arrive. How many birds are there?', ['10','11','12','13'], '12', 'Double 6.', 'Six and six make twelve.'],
    ['Ella has 18 stickers and gives 7 away. How many remain?', ['9','10','11','12'], '11', 'Count back seven.', 'Eighteen minus seven is eleven.'],
    ['Four children each hold one balloon. How many balloons are there?', ['3','4','5','8'], '4', 'Match one balloon to each child.', 'Four children with one each means four balloons.'],
    ['A shape has three straight sides. Which shape is it?', ['Circle','Square','Triangle','Oval'], 'Triangle', 'Count the sides.', 'A triangle has three sides.'],
    ['Ben needs 15 shells. He has found 9. How many more does he need?', ['4','5','6','7'], '6', 'Count from 9 up to 15.', 'Nine plus six reaches fifteen.'],
    ['There are 20 seats. 13 are filled. How many seats are empty?', ['5','6','7','8'], '7', 'Find the gap from 13 to 20.', 'Twenty minus thirteen is seven.'],
  ],
  2: [
    ['A library shelf has 24 picture books and 13 story books. How many books are on the shelf?', ['27','37','47','57'], '37', 'Add the tens, then the ones.', 'Twenty-four plus thirteen is thirty-seven.'],
    ['Kai has 42 marbles and gives 18 away. How many remain?', ['22','24','26','34'], '24', 'Subtract 10, then subtract 8.', 'Forty-two minus eighteen is twenty-four.'],
    ['Which number has 5 tens and 7 ones?', ['507','75','57','12'], '57', 'Five tens is 50.', 'Fifty plus seven is fifty-seven.'],
    ['Three baskets each hold 2 apples. How many apples are there altogether?', ['5','6','7','8'], '6', 'Count three groups of two.', 'Two plus two plus two is six.'],
    ['A movie starts at 3:00 and ends at 4:00. How long is the movie?', ['30 minutes','1 hour','2 hours','3 hours'], '1 hour', 'Count from 3 o’clock to 4 o’clock.', 'The times are one hour apart.'],
    ['Zoe buys a pencil for 60 cents and an eraser for 20 cents. How much does she spend?', ['40 cents','70 cents','80 cents','$1'], '80 cents', 'Add the two prices.', 'Sixty cents plus twenty cents is eighty cents.'],
    ['A class lines up in 4 rows with 3 children in each row. How many children are there?', ['7','10','12','14'], '12', 'Add 3 four times.', 'Four groups of three make twelve.'],
    ['There are 35 cupcakes. 9 are eaten. How many are left?', ['24','25','26','27'], '26', 'Take away 10, then add 1.', 'Thirty-five minus nine is twenty-six.'],
    ['A pattern grows by 5: 10, 15, 20, __. What comes next?', ['21','24','25','30'], '25', 'Add five to 20.', 'The next multiple of five is twenty-five.'],
    ['Half of 12 toy cars are blue. How many are blue?', ['4','5','6','8'], '6', 'Split 12 into two equal groups.', 'Half of twelve is six.'],
    ['A bus has 28 passengers. 7 get off and 4 get on. How many passengers are now on the bus?', ['17','21','25','32'], '25', 'First subtract 7, then add 4.', 'Twenty-eight minus seven plus four is twenty-five.'],
    ['Four friends share 20 grapes equally. How many grapes does each friend receive?', ['4','5','6','8'], '5', 'Make four equal groups.', 'Twenty shared among four is five each.'],
  ],
  3: [
    ['There are 6 tables in a classroom. Each table has 4 students. How many students are there altogether?', ['10','20','24','28'], '24', 'Think of 6 groups of 4.', 'Six groups of four make twenty-four.'],
    ['Mia has 24 stickers. Her teacher gives her 18 more. How many stickers does she have altogether?', ['32','42','48','52'], '42', 'Add the tens and ones.', 'Twenty-four plus eighteen is forty-two.'],
    ['A baker packs 32 rolls equally into 4 baskets. How many rolls go in each basket?', ['6','7','8','9'], '8', 'Ask what number times 4 makes 32.', 'Thirty-two divided by four is eight.'],
    ['A book has 96 pages. Leo reads 28 pages. How many pages are left?', ['58','68','72','78'], '68', 'Subtract 20, then 8.', 'Ninety-six minus twenty-eight is sixty-eight.'],
    ['One quarter of 20 seedlings are flowering. How many are flowering?', ['4','5','10','15'], '5', 'Split 20 into four equal groups.', 'One quarter of twenty is five.'],
    ['A lesson begins at 10:15 and lasts 45 minutes. When does it finish?', ['10:45','11:00','11:15','11:45'], '11:00', 'Count 45 minutes forward.', 'Forty-five minutes after 10:15 is 11:00.'],
    ['Nina buys 3 notebooks for $4 each. How much does she spend?', ['$7','$10','$12','$14'], '$12', 'Find three groups of four dollars.', 'Three times four dollars is twelve dollars.'],
    ['A garden has 7 rows of 8 flowers. How many flowers are there?', ['48','54','56','64'], '56', 'Use 7 × 8.', 'Seven groups of eight make fifty-six.'],
    ['A 2-metre ribbon is cut into 4 equal pieces. How long is each piece?', ['25 cm','50 cm','75 cm','100 cm'], '50 cm', 'Two metres is 200 centimetres.', 'Two hundred divided by four is fifty centimetres.'],
    ['A shop had 75 balloons. It sold 29. How many remain?', ['44','46','54','56'], '46', 'Subtract 30, then add one.', 'Seventy-five minus twenty-nine is forty-six.'],
    ['There are 5 packs of 6 pencils and 4 loose pencils. How many pencils are there?', ['30','34','36','40'], '34', 'Find the pencils in packs, then add 4.', 'Five times six plus four is thirty-four.'],
    ['A class collects 48 cans on Monday and half as many on Tuesday. How many cans do they collect in total?', ['24','48','72','96'], '72', 'Find half of 48, then add it.', 'Half of forty-eight is twenty-four; together that is seventy-two.'],
  ],
  4: [
    ['A school orders 8 boxes with 36 pencils in each. How many pencils arrive?', ['244','268','288','296'], '288', 'Multiply 36 by 8.', 'Eight groups of thirty-six make 288.'],
    ['A museum had 1,250 visitors. 487 were children. How many were adults?', ['663','763','773','837'], '763', 'Subtract 487 from 1,250.', 'One thousand two hundred fifty minus 487 is 763.'],
    ['Three quarters of 28 students bring a hat. How many students bring a hat?', ['7','14','21','24'], '21', 'Find one quarter, then take three groups.', 'One quarter is seven, so three quarters is twenty-one.'],
    ['A 5-kilometre walk is split into 10 equal stages. How long is each stage?', ['50 m','100 m','500 m','1 km'], '500 m', 'Five kilometres is 5,000 metres.', 'Five thousand divided by ten is five hundred metres.'],
    ['A rectangle is 9 cm long and 4 cm wide. What is its perimeter?', ['13 cm','26 cm','36 cm','40 cm'], '26 cm', 'Add all four sides.', 'Nine plus four plus nine plus four is twenty-six.'],
    ['Four tickets cost $7.50 each. What is the total cost?', ['$11.50','$28.00','$30.00','$32.50'], '$30.00', 'Multiply $7.50 by four.', 'Four lots of $7.50 make $30.'],
    ['A farmer packs 156 eggs into cartons of 12. How many cartons are needed?', ['11','12','13','14'], '13', 'Ask how many twelves make 156.', 'One hundred fifty-six divided by twelve is thirteen.'],
    ['The temperature is 18°C and rises by 7°C. What is the new temperature?', ['11°C','24°C','25°C','27°C'], '25°C', 'Add seven to eighteen.', 'Eighteen plus seven is twenty-five.'],
    ['A tank holds 600 L. It is three-quarters full. How much water is in it?', ['150 L','300 L','450 L','500 L'], '450 L', 'Find a quarter, then multiply by three.', 'Three quarters of 600 litres is 450 litres.'],
    ['A concert has 24 rows of 18 seats. How many seats are there?', ['412','422','432','442'], '432', 'Multiply 24 by 18.', 'Twenty-four groups of eighteen make 432.'],
    ['Priya reads 35 pages on Monday and twice as many on Tuesday. How many pages does she read altogether?', ['70','95','105','140'], '105', 'Double 35, then add Monday.', 'Thirty-five plus seventy is 105.'],
    ['A shop reduces a $60 game by $15, then adds a $5 delivery fee. What is the final cost?', ['$40','$45','$50','$55'], '$50', 'Subtract the discount before adding delivery.', 'Sixty minus fifteen plus five is fifty.'],
  ],
  5: [
    ['A fundraiser sells 125 tickets at $8 each. How much money is raised?', ['$900','$1,000','$1,125','$1,250'], '$1,000', 'Multiply 125 by 8.', 'One hundred twenty-five groups of eight dollars make $1,000.'],
    ['A 3.6 km trail has 1.45 km completed. How much remains?', ['2.05 km','2.15 km','2.25 km','3.15 km'], '2.15 km', 'Line up the decimal points.', 'Three point six minus one point four five is two point one five.'],
    ['Two fifths of 45 students choose art. How many students choose art?', ['9','15','18','20'], '18', 'Find one fifth, then double it.', 'One fifth is nine, so two fifths is eighteen.'],
    ['A jacket costs $80 and is discounted by 25%. How much is the discount?', ['$15','$20','$25','$60'], '$20', 'Twenty-five percent is one quarter.', 'One quarter of eighty dollars is twenty dollars.'],
    ['A rectangular garden is 12 m by 7 m. What is its area?', ['19 m²','38 m²','72 m²','84 m²'], '84 m²', 'Area is length multiplied by width.', 'Twelve times seven is eighty-four square metres.'],
    ['A recipe for 4 people needs 300 g of flour. How much is needed for 10 people?', ['600 g','650 g','750 g','900 g'], '750 g', 'Find the amount per person first.', 'Seventy-five grams per person for ten people is 750 grams.'],
    ['A library has 2,450 books. It buys 375 and removes 128. How many books does it have now?', ['2,597','2,697','2,707','2,953'], '2,697', 'Add the new books, then subtract the removed books.', '2,450 plus 375 minus 128 is 2,697.'],
    ['A train travels 180 km in 3 hours at a steady speed. How far does it travel each hour?', ['50 km','60 km','90 km','540 km'], '60 km', 'Share the distance equally across three hours.', 'One hundred eighty divided by three is sixty.'],
    ['A class answered 42 of 50 questions correctly. What percentage is correct?', ['42%','50%','84%','92%'], '84%', 'Convert the score to an amount out of 100.', 'Forty-two out of fifty is eighty-four out of one hundred.'],
    ['Five identical boxes weigh 12.5 kg altogether. How much does each box weigh?', ['2 kg','2.5 kg','5 kg','7.5 kg'], '2.5 kg', 'Divide the total by five.', 'Twelve point five divided by five is two point five.'],
    ['A hall has 18 rows of 24 chairs. After 57 chairs are removed, how many remain?', ['365','375','385','489'], '375', 'Find the total first, then subtract 57.', 'Eighteen times twenty-four is 432; minus 57 is 375.'],
    ['A tank is 60% full with 360 L. What is the tank’s full capacity?', ['480 L','540 L','600 L','720 L'], '600 L', 'Find 10%, then multiply by ten.', 'If sixty percent is 360, ten percent is 60 and the whole is 600.'],
  ],
  6: [
    ['A school has 240 students. Three-fifths bring lunch from home. One-quarter of those bring a sandwich. How many bring a sandwich?', ['24','36','48','60'], '36', 'Find three-fifths of 240, then one-quarter of that.', 'Three-fifths is 144; one-quarter of 144 is 36.'],
    ['A laptop costs $1,200 and is reduced by 15%. What is the sale price?', ['$180','$1,020','$1,080','$1,185'], '$1,020', 'Find the discount, then subtract it.', 'Fifteen percent is $180; the sale price is $1,020.'],
    ['A map uses a scale of 1 cm to 5 km. Two towns are 7.5 cm apart. What is the real distance?', ['12.5 km','30 km','37.5 km','75 km'], '37.5 km', 'Multiply the map distance by five.', 'Seven point five times five is 37.5 kilometres.'],
    ['A water tank is two-thirds full. After 120 L is used, it is one-third full. What is its capacity?', ['240 L','300 L','360 L','480 L'], '360 L', 'The change is one third of the tank.', 'One third is 120 litres, so the whole is 360 litres.'],
    ['The ratio of red to blue beads is 3:5. There are 40 beads altogether. How many are red?', ['8','15','24','25'], '15', 'There are eight equal ratio parts.', 'Forty divided by eight is five; three parts make fifteen.'],
    ['A rectangle has an area of 96 cm² and a width of 8 cm. What is its perimeter?', ['20 cm','32 cm','40 cm','48 cm'], '40 cm', 'Find the missing length before finding the perimeter.', 'The length is twelve; twice twelve plus twice eight is forty.'],
    ['A bus leaves with 48 passengers. At the first stop one-quarter leave and 9 board. At the second stop one-third of the passengers leave. How many remain?', ['27','30','33','45'], '30', 'Work through each stop in order.', 'After stop one there are 45; one-third leaves, so 30 remain.'],
    ['A runner completes 7.5 laps of a 400 m track. How far does the runner travel?', ['2 km','2.5 km','3 km','3.5 km'], '3 km', 'Multiply laps by 400 metres.', 'Seven and a half times 400 metres is 3,000 metres, or 3 km.'],
    ['A recipe uses flour and sugar in a 4:1 ratio. If 750 g of mixture is made, how much flour is used?', ['150 g','450 g','600 g','625 g'], '600 g', 'Flour is four of five equal parts.', 'Each part is 150 g, so flour is 600 g.'],
    ['The average of four scores is 18. Three scores are 14, 17 and 21. What is the fourth?', ['18','20','22','24'], '20', 'Find the total needed for an average of 18.', 'The total is 72; the known scores total 52, leaving 20.'],
    ['A $250 bicycle increases in price by 12%, then is discounted by $20. What is the final price?', ['$260','$262','$280','$282'], '$260', 'Find 12% of $250 first.', 'The increase is $30, then subtracting $20 gives $260.'],
    ['A hall is filled to 75% of its 480-seat capacity. Then 48 people leave. What fraction of the seats remain occupied?', ['1/2','3/5','13/20','3/4'], '13/20', 'Find the occupied seats, subtract 48, then simplify over 480.', 'There are 360, then 312; 312/480 simplifies to 13/20.'],
  ],
};

// Normalise tuple-like seeds into named fields while keeping authoring compact.
const normalise = (seed: unknown): QuestionSeed => {
  const [question, options, correctAnswer, hint, explanation] = seed as [string, string[], string, string, string];
  return { question, options, correctAnswer, hint, explanation };
};

const englishPrompts: Record<PrimaryYear, CompactSeed[]> = {
  1: [
    ['Sam sees a cat wearing a hat. Which word rhymes with CAT?', ['Cup','Hat','Dog','Sun'], 'Hat', 'Say each word aloud.', 'Cat and hat share the same ending sound.'],
    ['Choose the missing word: The bird can ___.', ['fly','blue','nest','soft'], 'fly', 'The sentence needs an action.', 'Fly tells what the bird can do.'],
    ['Which word begins with the same sound as SUN?', ['Moon','Sock','Tree','Fish'], 'Sock', 'Listen to the first sound.', 'Sun and sock begin with /s/.'],
    ['Which sentence starts correctly?', ['dogs run.','Dogs run.','dogs Run.','Dogs Run'], 'Dogs run.', 'A sentence begins with a capital.', 'Dogs run. has a capital and full stop.'],
    ['Ava packs an apple for lunch. What does Ava pack?', ['A book','An apple','A hat','A ball'], 'An apple', 'Look for the object after “packs”.', 'The sentence says Ava packs an apple.'],
    ['Which word names a colour?', ['Jump','Green','Quickly','Chair'], 'Green', 'Think of what you can see in a rainbow.', 'Green is a colour word.'],
    ['The puppy is very ___. Choose the word that makes sense.', ['soft','run','under','barks'], 'soft', 'Describe how a puppy might feel.', 'Soft describes the puppy.'],
    ['Which word has the short /a/ sound?', ['Cake','Map','Bike','Moon'], 'Map', 'Say each middle sound.', 'Map has the short /a/ sound.'],
    ['Tom put on boots and opened an umbrella. What is the weather probably like?', ['Rainy','Hot','Snowy','Windless'], 'Rainy', 'Boots and umbrellas help in one kind of weather.', 'Those clues suggest rain.'],
    ['Choose the correct ending mark: Where is my bag__', ['.','?','!',','], '?', 'The sentence asks something.', 'A question ends with a question mark.'],
    ['Which word is the opposite of BIG?', ['Tall','Small','Wide','Round'], 'Small', 'Think of size.', 'Small is the opposite of big.'],
    ['Ben fed the fish before school. Who fed the fish?', ['The fish','Ben','School','No one'], 'Ben', 'Look at the beginning of the sentence.', 'Ben is the person doing the action.'],
  ],
  2: [
    ['The tiny mouse hid beneath the chair. Which word is an adjective?', ['mouse','hid','tiny','beneath'], 'tiny', 'Find the word that describes the mouse.', 'Tiny describes the noun mouse.'],
    ['Which word is a verb in “The children laughed loudly”?', ['children','laughed','loudly','the'], 'laughed', 'Find the action.', 'Laughed is what the children did.'],
    ['Choose the correct spelling.', ['frend','friend','freind','frind'], 'friend', 'Remember: i before e in this word.', 'Friend is spelled f-r-i-e-n-d.'],
    ['Mila placed the ice cream in the sun. Soon it became a puddle. What happened?', ['It froze','It melted','It grew','It vanished'], 'It melted', 'Think about heat and ice cream.', 'The sun warmed and melted it.'],
    ['Which sentence uses a capital letter correctly?', ['we live in Sydney.','We live in sydney.','We live in Sydney.','we live in sydney.'], 'We live in Sydney.', 'Sentence starts and place names need capitals.', 'Both We and Sydney need capital letters.'],
    ['Choose the best word: The rabbit moved __ across the grass.', ['quickly','green','rabbit','under'], 'quickly', 'The missing word tells how it moved.', 'Quickly describes the action moved.'],
    ['Which noun names a place?', ['School','Happy','Run','Slowly'], 'School', 'A noun can name a person, place or thing.', 'School names a place.'],
    ['“Please close the gate,” Mum said. Why are quotation marks used?', ['To show a question','To show spoken words','To show a title','To show a list'], 'To show spoken words', 'Look at what Mum says.', 'Quotation marks surround direct speech.'],
    ['The path was narrow, so only one person could walk on it. What does narrow mean?', ['Very wide','Not wide','Very long','Very dark'], 'Not wide', 'Use the clue about one person.', 'Narrow means having little width.'],
    ['Which word belongs in the sentence? Yesterday we __ to the park.', ['walk','walks','walked','walking'], 'walked', 'Yesterday tells you it happened in the past.', 'Walked is the past-tense form.'],
    ['Luca watered the drooping plant. The next morning its leaves stood tall. Why?', ['It received water','It became colder','It lost soil','It was moved'], 'It received water', 'Connect Luca’s action to the change.', 'Water helped the plant recover.'],
    ['Choose the best joining word: I wore a coat __ it was cold.', ['because','but','or','until'], 'because', 'The second part gives a reason.', 'Because connects an action to its reason.'],
  ],
  3: [
    ['Leo grabbed his umbrella before leaving home. What can you infer?', ['It may rain','It is midnight','He is swimming','It is very hot'], 'It may rain', 'An umbrella is a clue.', 'People often take umbrellas when rain is likely.'],
    ['The puppy bounded across the yard. What does bounded mean here?', ['Slept','Moved in lively leaps','Whispered','Ate slowly'], 'Moved in lively leaps', 'Picture an excited puppy moving.', 'Bounded means moved with energetic leaps.'],
    ['Which sentence is punctuated correctly?', ['After lunch we played soccer.','After lunch, we played soccer.','After, lunch we played soccer.','After lunch we, played soccer.'], 'After lunch, we played soccer.', 'The opening phrase needs a pause.', 'A comma follows the introductory phrase.'],
    ['Choose the pronoun that replaces “Mia and Zoe”: __ finished the project.', ['She','He','They','It'], 'They', 'The noun phrase names two people.', 'They refers to more than one person.'],
    ['The trail disappeared into a dense forest. Dense most nearly means:', ['Thin','Thick','Noisy','Short'], 'Thick', 'Use the forest clue.', 'A dense forest has many trees close together.'],
    ['Kai checked the map twice before choosing the path. What does this show?', ['He is careless','He is cautious','He is bored','He is lost forever'], 'He is cautious', 'Think about why someone checks twice.', 'Checking carefully shows caution.'],
    ['Which word is an adverb? The turtle moved slowly.', ['turtle','moved','slowly','the'], 'slowly', 'Find the word that tells how.', 'Slowly describes how the turtle moved.'],
    ['Choose the correct plural of “leaf”.', ['leafs','leaves','leafes','leavs'], 'leaves', 'The f changes in this plural.', 'Leaf becomes leaves.'],
    ['“The classroom was a beehive.” What does this suggest?', ['It held bees','It was busy','It was empty','It was outdoors'], 'It was busy', 'This comparison describes activity.', 'A beehive suggests a busy, active place.'],
    ['Which sentence combines the ideas best? Ana was tired. Ana finished the race.', ['Ana was tired, but she finished the race.','Ana tired race.','But Ana was tired.','Ana finished because tired.'], 'Ana was tired, but she finished the race.', 'The ideas contrast.', 'But clearly joins contrasting ideas.'],
    ['The sign said the bridge was fragile. What should walkers do?', ['Jump on it','Cross carefully','Run quickly','Ignore it'], 'Cross carefully', 'Fragile things can break.', 'Care is needed around something fragile.'],
    ['In “The wind whispered through the trees,” which technique is used?', ['Rhyme','Personification','A list','A question'], 'Personification', 'Can wind really whisper?', 'The wind is given a human action.'],
  ],
  4: [], 5: [], 6: [],
};

const advancedEnglish = (year: 4 | 5 | 6): CompactSeed[] => {
  const level = year === 4 ? 'clear' : year === 5 ? 'thoughtful' : 'precise';
  return [
    ['The old gate groaned as Maya pushed it open. What mood does “groaned” create?', ['Cheerful','Uneasy','Silly','Peaceful'], 'Uneasy', 'Listen to the sound and feeling of the verb.', 'Groaned creates an uneasy, mysterious mood.'],
    ['Although the sky was dark, the team continued training. What does “although” signal?', ['A cause','A contrast','A list','A question'], 'A contrast', 'Compare the two parts.', 'Dark weather contrasts with continuing training.'],
    ['The author calls the river “a silver ribbon”. What is this?', ['A metaphor','A fact','An instruction','A rhyme'], 'A metaphor', 'The river is said to be something else.', 'The image directly compares the river to a ribbon.'],
    ['Which revision is most concise?', ['Due to the fact that it rained, we stayed.','Because it rained, we stayed.','It rained and for that reason we stayed inside there.','We stayed due to rain happening.'], 'Because it rained, we stayed.', 'Choose the clearest version with no extra words.', 'The selected sentence is direct and concise.'],
    ['Nora reread the final paragraph and frowned. What can you infer?', ['She may be dissatisfied','She cannot read','She is asleep','She won a prize'], 'She may be dissatisfied', 'Use both actions as clues.', 'Rereading and frowning suggest concern or dissatisfaction.'],
    ['Which sentence uses a semicolon correctly?', ['The rain stopped; we continued walking.','The rain; stopped we continued.','The rain stopped; and.','The; rain stopped.'], 'The rain stopped; we continued walking.', 'A semicolon can join two complete related ideas.', 'Both sides are complete, closely related clauses.'],
    [`Which word has the most ${level} meaning for “looked carefully”?`, ['glanced','examined','saw','noticed'], 'examined', 'Choose the verb showing close attention.', 'Examined means looked at closely and carefully.'],
    ['The writer includes statistics after making a claim. What is their likely purpose?', ['To provide evidence','To change the topic','To create a character','To add dialogue'], 'To provide evidence', 'Ask how numbers support an argument.', 'Statistics can strengthen a claim with evidence.'],
    ['“The leaves danced in the breeze.” What effect does this language create?', ['It makes the scene vivid','It proves leaves have feet','It gives instructions','It states a measurement'], 'It makes the scene vivid', 'Think about the picture formed in your mind.', 'Personification creates a lively visual image.'],
    ['Which sentence maintains consistent tense?', ['She opened the book and begins reading.','She opens the book and began reading.','She opened the book and began reading.','She opening the book and reads.'], 'She opened the book and began reading.', 'Both actions happened in the past.', 'Opened and began are both past tense.'],
    ['A narrator reveals only one character’s thoughts. Which point of view is most likely?', ['First or limited third person','Omniscient only','Second person instructions','No point of view'], 'First or limited third person', 'Consider whose inner thoughts are available.', 'First person or limited third person follows one perspective.'],
    ['The final paragraph echoes the opening image. Why might an author do this?', ['To create a satisfying structure','To introduce a new setting','To remove the theme','To avoid an ending'], 'To create a satisfying structure', 'Think about how beginnings and endings connect.', 'Echoing the opening gives cohesion and closure.'],
  ];
};

englishPrompts[4] = advancedEnglish(4);
englishPrompts[5] = advancedEnglish(5);
englishPrompts[6] = advancedEnglish(6);

const linkRelatedFollowUps = (questions: PrimaryQuestion[]): PrimaryQuestion[] => questions.map((question) => {
  const related = questions.find((candidate) => candidate.topic === question.topic && candidate.subtopic === question.subtopic && candidate.id !== question.id && candidate.question !== question.question);
  if (!related) return question;
  return {
    ...question,
    followUp: {
      question: `Your turn: ${related.question}`,
      options: [...related.options],
      correctAnswer: related.correctAnswer,
      explanation: related.explanation.steps.at(-1) ?? related.hint,
    },
  };
});

export const primaryQuestionBank = Object.fromEntries(
  ([1, 2, 3, 4, 5, 6] as PrimaryYear[]).map((year) => [year, {
    maths: linkRelatedFollowUps(makeQuestions(year, 'maths', mathsSeeds[year].map(normalise))),
    english: linkRelatedFollowUps(makeQuestions(year, 'english', englishPrompts[year].map(normalise))),
  }]),
) as Record<PrimaryYear, Record<PrimarySubject, PrimaryQuestion[]>>;

export const getChallengeQuestions = (year: PrimaryYear, subject: PrimarySubject): PrimaryQuestion[] =>
  primaryQuestionBank[year][subject];
