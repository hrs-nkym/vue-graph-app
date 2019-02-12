export let users = [
  {
    id: 1,
    name: 'gatsby taro',
    email: 'gatsby.taro@gmail.com',
    age: 32 
  },
  {
    id: 2,
    name: 'gridman age',
    email: 'gridman.age@gmail.com',
    age:  22
  },
];

let idSequence = 2;

export const generateId = () => ++idSequence;