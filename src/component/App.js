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

const App = () => {
  
  const lastdata = JSON.parse(localStorage.getItem('myData'));

  console.log((typeof (lastdata)), "ddsd");
  let submit;
  const [notvalid, setnotvalid] = useState(false);
  const [valid, setvalid] = useState(false);
  const [data, setData] = useState([]);
  const [dattt, setDatt] = useState([]);
  const [list, setList] = useState([])





  const onSubmit = async (values) => {

    axios({
      method: "get",
      url: "https://moderation.logora.fr/predict?text=" + values.text,

      transformRequest: [
        (data, headers) => {
          // transform the data

          return data;
        }
      ]
    })
      .then(function (response) {
        


        if (response.data.prediction[0] > 0.5) {
          const historique = JSON.parse(localStorage.getItem('myData'));
          console.log('historique is ', historique)


          if (historique) {  
            const newItem = response.data.prediction[0]
            historique.push(newItem)
            localStorage.setItem('myData', JSON.stringify(historique));
            setList(historique)
          }

          if (!historique) {
            const d = []
            d.push(response.data.prediction[0])
            localStorage.setItem('myData', JSON.stringify(d));
            setList(d)
          }
         
          setvalid(true);
          setData(response.data);
          return response.data;

        }
        else{
          const arrayOfHistorique = []
          const historique = JSON.parse(localStorage.getItem('myData'));
          console.log('historique is ', historique)

          if (historique) {
            const newItem = response.data.prediction[0]
            historique.push(newItem)
            localStorage.setItem('myData', JSON.stringify(historique));
            setList(historique)
          }


          if (!historique) {
            const d = [];
            d.push(response.data.prediction[0]);
            localStorage.setItem('myData', JSON.stringify(d));
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
<h2>prediction</h2>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => {
          submit = handleSubmit;
          return (
            <form id="exampleForm" onSubmit={handleSubmit}>


              <div>
                <label>text</label>
                <Field
                  name="text"
                  component="input"
                  type="text"
                  placeholder="text"
                />
              </div>

              <div className="buttons">
                <button type="submit" disabled={submitting || pristine}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={form.reset,()=>{setData([])}}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div > 
              

              <p>resultat:</p>  <div>{JSON.stringify(data, 0, 2)}</div>
              {valid ?
                <Alert severity="error">la contribution est rejetée</Alert> : <div></div>

              }
              {notvalid ?
                <Alert severity="success">La contribution est acceptée</Alert> : <div></div>
              }


              <div>Historique:</div>
              <button
                  type="button"
                  onClick={()=>{localStorage.removeItem('myData');setList([]);}}
                  
                >
                  Reset Historique
                </button>
              <ol>
                {list.map((item, i) => <li key={i} > {item>0.5?<Refu >{item}(refu)</Refu>:<Accepte>{item}(accepte)</Accepte>}</li>)}
              </ol>
              
            </form>
          );
        }}
      />

    </Styles>
  );
};



export default App;
