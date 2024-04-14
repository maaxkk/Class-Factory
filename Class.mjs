"use strict";

import {
  initHidden, 
  setHiddenMethod, 
  setHiddenProp, 
  getHiddenProp, 
  getHiddenMethod,
  useHiddenMethod
} from "./hiddenFuncs.mjs"

const MyClass = (() => {

  /* static hidden stuff could go here */

  function publicMethod(name, value) {
    //prettier way to create class methods
    myClass2.prototype[name] = value
    console.log('.prototype', name)
    console.log(myClass2.prototype[name])
    console.log(myClass2.prototype)
  }

  function myClass2(value, secret) {
    /* Hidden instance stuff needs to be defined in the constructor */
    initHidden(this)
    setHiddenProp(this, '_hiddenProp', "I'm hidden!")
    setHiddenMethod(this, '_hiddenFunc', function() {
      return getHiddenProp(this, '_hiddenProp')
    })
    setHiddenProp(this, '_mySecret', `secret is ${secret}` )
    setHiddenMethod(this, '_getSecret', function() {
      return getHiddenProp(this, '_mySecret')
    })

    this.value = value
  }

  publicMethod('usesHidden', function() {
    return useHiddenMethod(this, '_hiddenFunc')
  })

  publicMethod('getSecretPublic', function () {
    return useHiddenMethod(this, '_getSecret')
  })

  return myClass2
})()

const myClass = new MyClass(5, 'I\'m an AI')
console.log(myClass)
console.log(myClass.usesHidden())
console.log(myClass.value)
console.log(myClass.getSecretPublic())
console.log(myClass)


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function ClassMaker(constructor, publicProps = {}, hiddenStaticProps = {}) {
  if (
    typeof constructor !== 'function' || 
    typeof publicProps !== 'object' || 
    typeof hiddenStaticProps !== 'object'
  ) return

  for(const name in publicProps) {
    constructor.prototype[name] = publicProps[name]
  }

  for(const name in hiddenStaticProps) {
    initHidden(constructor)
    if(typeof hiddenStaticProps[name] === 'function') {
      setHiddenMethod(constructor, name, hiddenStaticProps[name])
    } else {
      setHiddenProp(constructor, name, hiddenStaticProps[name])
    }
  }

  return constructor
}

const MyClass2 = ClassMaker(
  // create a constructor that utilizes hidden instance stuff
  function constructor(name, smth) {
    initHidden(this)
    setHiddenProp(this, '_message', "Created by ClassMaker!")
    setHiddenMethod(this, '_getMessage', function() {
      return getHiddenProp(this, '_message')
    });
    setHiddenProp(this, '_name', `Cool ${name}`)
    setHiddenMethod(this, '_getName', function() {
      return getHiddenProp(this, '_name')
    })
    // this.name = name
    this.smth = smth
  },

  // add public methods/properties
  {
    getMessage() {
      return useHiddenMethod(this, '_getMessage')
    },
    getName() {
      return useHiddenMethod(this, '_getName');
    },
    showHiddenStaticProp() {return getHiddenProp(this.constructor, '_hiddenStaticProperty')},
    setHiddenStaticProp(value) {return setHiddenProp(this.constructor, '_hiddenStaticProperty', value)}
  },

  // add hidden static methods/properties. 
  {
    _hiddenStaticProperty: "wahoo!"
  }
  
)

const myClass2Instance = new MyClass2("random name", 'something else')
console.log(myClass2Instance) // getName is in object chain
console.log(myClass2Instance.getName()) // cool random Name
console.log(myClass2Instance.getMessage())
console.log(myClass2Instance.showHiddenStaticProp())
myClass2Instance.setHiddenStaticProp('New value!')

const myClass2Instance2 = new MyClass2("weee")
console.log(myClass2Instance2.showHiddenStaticProp())
console.log(Object.getPrototypeOf(Object.getPrototypeOf(myClass2Instance2)))


