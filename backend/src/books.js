const baseBooks = [
  { title: 'Pride and Prejudice', author: 'Jane Austen', sourceType: 'book', summary: 'Classic novel of manners and marriage in Regency England.' },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', sourceType: 'book', summary: 'Modern introduction to programming and JavaScript fundamentals.' },
  { title: 'MDN HTTP Overview', author: 'MDN Contributors', sourceType: 'documentation', summary: 'Reference guide explaining client-server HTTP message architecture.' }
];

const generated = Array.from({ length: 197 }, (_, idx) => {
  const num = idx + 4;
  const types = ['book', 'documentation', 'course'];
  return {
    title: Full-Stack Reference Volume ,
    author: Instructor Team ,
    sourceType: types[num % 3],
    summary: Curated learning resource # covering web architecture, REST APIs, and MongoDB persistence.
  };
});

export const initialBooks = [...baseBooks, ...generated];
