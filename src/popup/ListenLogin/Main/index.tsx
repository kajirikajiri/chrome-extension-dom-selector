import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";

export default function Main() {
  const [email, setEmail] = useState('hogehoge@example.com')
  const [pass, setPass] = useState('password')
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(undefined)
  const [width, setWidth] = useState(0)
  useEffect(()=>{
    console.log('add listern')
    window.onresize = ()=>{
      setWidth(window.innerWidth)
    }
  }, [])

  const handleClick=(type:'login'|'signup'|'re')=>{
    if (type === 'login') {
      firebase.auth().signInWithEmailAndPassword(email, pass)
        .then((user) => {
          console.log('login', user)
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    } else if(type==="signup") {
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then((user) => {
          console.log('signup')
          console.log(user)
        })
        .catch((error) => {
          console.log(error)
          var errorCode = error.code;
          var errorMessage = error.message;
        });
      } else if (type === 're') {
          firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider)
  }).catch((error) => {
    console.log(error)
    var errorCode = error.code;
    var errorMessage = error.message;
  })
      }
  }

  if (loading) {
    return (
      <div>restore login ...</div>
    )
  }

  if (isLogin === true) {
    return (
      <div>now open menu !!</div>
    )
  }

  if (isLogin === false) {
    return (
      <button onClick={()=>handleClick("login")}>
        buttona
      </button>
    )
  }

}
