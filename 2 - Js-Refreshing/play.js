'use strict'
/*
const name = 'Max';
let age = 29;
const hasHobbies = true;

age = 30;

const summarizeUser = (userName, userAge, userHasHobbies) => {
    return ('Name is ' 
    + userName 
    + ', age is '
    + userAge 
    + ' and has hobbies: ' 
    + userHasHobbies);
};

const add = (a,b) => a + b;
const addOne = a => a + 1;
const addRandom = () => 1+2;

console.log(addOne(1));
console.log(summarizeUser(name, age, hasHobbies));

*/
/*
const person ={
    name: 'Max',
    age: 29,
    greet(){
        console.log(`Hi, I am ${this.name}, and I am ${this.age} years old.`);
    }
};

const printName = ({name}) => {

console.log(name)
};

printName(person);

const {name, age} = person;
console.log(name, age);

// const copiedPerson = {...person};
// console.log(copiedPerson);

const hobbies = ['Sports', 'Cooking', 'Swimming'];
const [hobby1, ,hobby2] = hobbies;
console.log(hobby1, hobby2);

// // for(let hobby of hobbies) {
// //     console.log(hobby);
// // }
// // console.log(hobbies.map(hobby => 'hobby: ' + hobby));
// // console.log(hobbies);
// const copiedArray = [...hobbies];
// console.log(copiedArray);

// const toArray = (...args) => {
//     return args;
// };

// console.log(toArray(1,2,3,4));
*/

const fetchData = () => {

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500);
    });
    return promise;
};

setTimeout(() => {
    console.log('TImer is done!');
    fetchData().then(text => {
        console.log(text);
        return fetchData();
        }).then(text2 => {
            console.log(text2);
    });
}, 2000);

console.log('Hello');
console.log('HI');