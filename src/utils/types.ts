
export interface JournalEntry {
  imgUrl: string;
  rating: number;
  categories: string[];
  date: string; 
  description: string;
}
export interface JournalEntryWithID extends JournalEntry {
  id: string; 
}
