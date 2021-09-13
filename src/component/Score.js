import logo from './logo.svg';
import './App.css';

import React, { useState } from "react";
import { render } from "react-dom";
import Styles from "../Styles";
import {Refu,Accepte} from "../color";
import { Form, Field } from "react-final-form";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6}
    variant="filled" {...props} />;
}

const Score = () => {
  
  const lastdata = JSON.parse(localStorage.getItem('myscore'));
  console.log((typeof (lastdata)));
  let submit;
  const [notvalid, setnotvalid] = useState(false);
  const [valid, setvalid] = useState(false);
  const [data, setData] = useState([]);
  const [dattt, setDatt] = useState([]);
  const [list, setList] = useState([])



  const onSubmit = async (values) => {

    axios({
      method: "get",
      url: "https://moderation.logora.fr/score?text=" + values.text+"&votes"+values.vote,
      transformRequest: [
        (data, headers) => {
          // transform the data
          return data;
        }
      ]
    })
      .then(function (response) {
        

        if (response.data.score > 0.5) {
          const myscore = JSON.parse(localStorage.getItem('myscore'));
          console.log('myscore is ', myscore)

          if (myscore) {
            const newItem = response.data.score
            myscore.push(newItem)
            localStorage.setItem('myscore', JSON.stringify(myscore));
            setList(myscore)
          }

          if (!myscore) {
            const d = [];
            d.push(response.data.score);
            localStorage.setItem('myscore', JSON.stringify(d));
            setList(d)
          }
         
          setvalid(true);
          setData(response.data);
          return response.data;
        }

        else{
          const arrayOfmyscore = []
          const myscore = JSON.parse(localStorage.getItem('myscore'));
          

          if (myscore) {
            const newItem = response.data.score
            myscore.push(newItem)
            localStorage.setItem('myscore', JSON.stringify(myscore));
            setList(myscore);
          }

          if (!myscore) {
            const d = [];
            d.push(response.data.score);
            localStorage.setItem('myscore', JSON.stringify(d));
            setList(d);
          }
     
          setvalid(false);
          setnotvalid(true);
          setData(response.data);
          return response.data;}
      })
      .catch(function (erreur) {
   
        console.log("error");
        setnotvalid(false);
      });
  };






  return (
    <Styles>
<h2>Score</h2>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => {
          submit = handleSubmit;
          return (
              
            <form id="exampleForm" onSubmit={handleSubmit}>
                

              <div>
                <label>input</label>
                <Field
                  name="text"
                  component="input"
                  type="text"
                  placeholder="text"
                />
              </div>


              <div>
                <label>vote</label>
                <Field
                  name="vote"
                  component="input"
                  type="number"
                  placeholder="vote"
                />
              </div>
              <div className="buttons">
                <button type="submit" disabled={submitting || pristine}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div > 
              

              <p>resultat:</p>  <div>{JSON.stringify(data, 0, 2)}</div>
              {valid ?
               <Alert severity="success">votre Score est "1"</Alert> : <div></div>
              }
              {notvalid ?
               <Alert severity="error">votre Score est "0"</Alert>: <div></div>
              }


              <div>Historique:</div>
              <button
                  type="button"
                  onClick={()=>{localStorage.removeItem('myscore');setList([]);}}
                  
                >
                  Reset Historique
                </button>
              <ol>
                {list.map((item, i) => <li key={i} > {item>0.5?<Accepte>Score:{item}(1)</Accepte>:<Refu >Score:{item}(0)</Refu>}</li>)}
              </ol>
              
            </form>


          );
        }}
      />

    </Styles>
  );
};



export default Score;
