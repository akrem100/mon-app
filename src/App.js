import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import React, {useState} from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";

import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
  
function Alert(props) {
  return <MuiAlert elevation={6} 
                   variant="filled" {...props} />;
}

const App = () => {

  const lastdata=JSON.parse(localStorage.getItem('myData'));
  
  console.log((typeof(lastdata)),"ddsd");
  let submit;
  const [notvalid, setnotvalid] = useState(false);
  const [valid, setvalid] = useState(false);
  const [data, setData] = useState([]);
  const [dattt, setDatt] = useState([]);
  const onSubmit = async (values) => {
   
    // console.log(values.text);
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
        console.log(response.data.prediction[0]);
       if(response.data.prediction[0]> 0.5){
       
      const   a=JSON.parse(localStorage.getItem('myData'));
      const datt=[a];
      if(datt!=null){
        
        localStorage.setItem('myData',[JSON.stringify(...datt,response.data.prediction[0])]);
      }else {localStorage.setItem('myData',[JSON.stringify(response.data.prediction[0])]);}
      setDatt(datt);/**  if(datt!=null){
         
       localStorage.setItem('myData',[...datt,response.data.prediction[0]]);
       }else { datt=[response.data.prediction[0]]; console.log(datt);localStorage.setItem('myData',[response.data.prediction[0]]);}**/
        //window.alert(JSON.stringify("rejeté", 0, 5));
      }
        else{window.alert(JSON.stringify("accepte", 0, 2));}
        console.log(response.data);
        
        setData(response.data);
        console.log(dattt);
        //On traite la suite une fois la réponse obtenue
        setvalid(true);
        
        return response.data;
      })
      .catch(function (erreur) {
        //On traite ici les erreurs éventuellement survenues
        console.log("erreur");
        setnotvalid(false);
      });
  };
  
  return (
    <Styles>
  
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
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div>
              <p>resultat:</p>  <div>{JSON.stringify(data, 0, 2)}</div> 
              {valid?
              <Alert severity="warning">refuse Message</Alert> :<div></div>
        
        }
        {notvalid?
              <Alert severity="success">Accepte Message</Alert>:<div></div>
        }
     
            </form>
            
          );
        }}
      />
    </Styles>
  );
};



export default App;
