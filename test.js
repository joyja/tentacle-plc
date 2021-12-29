class Animal {
  static derived = new Set();
}
class Dog extends Animal {
  static dummy = Animal.derived.add(this.name);
}
class Cat extends Animal {
  static dummy = Animal.derived.add(this.name);
}
class Donkey extends Animal {
  static dummy = Animal.derived.add(this.name);
}

console.log(Animal.derived);