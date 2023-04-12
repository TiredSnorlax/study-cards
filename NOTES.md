# Study Cards

TODO: 
- Interfaces
    1. Deck (parent to cards) [ ]
      - id: ID
      - owner: ID 
      - access: ID[]
      - total cards: number
    2. Cards
      - id: ID
      - deck: Deck ID 
      - question: string
      - answer: string
      - difficulty
    3. User (parent to decks)
      - username: string
      - id: ID
    4. Results
      - deck: ID  
      - correct: number
      - time: string
- Pages
    1. Main page [ ]
      - List of all User's Decks
    2. Individual deck pages [ ]
      - Where User can edit cards provided they are owners or have editing status
    3. Profile page [ ]
      - Can view other people's profile
- Additional Features:
    1. Able to share decks with other users [ ]
    2. Daily study system
      - Get a streak when you play everyday


TODO: 
  1. Change components background to the css variables [x]
  2. Add shared with deck sections in main page [ ]
